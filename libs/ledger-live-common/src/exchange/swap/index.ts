import { getEnv } from "@ledgerhq/live-env";
import { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import {
  AccessDeniedError,
  CurrencyDisabledAsInputError,
  CurrencyDisabledAsOutputError,
  CurrencyDisabledError,
  CurrencyNotSupportedByProviderError,
  CurrencyNotSupportedError,
  JSONDecodeError,
  JSONRPCResponseError,
  NoIPHeaderError,
  NotImplementedError,
  SwapGenericAPIError,
  TradeMethodNotSupportedError,
  UnexpectedError,
  ValidationError,
} from "../../errors";
import getCompleteSwapHistory from "./getCompleteSwapHistory";
import initSwap from "./initSwap";
import { postSwapAccepted, postSwapCancelled } from "./postSwapState";
import getExchangeRates from "./getExchangeRates";
import { maybeTezosAccountUnrevealedAccount } from "./maybeTezosAccountUnrevealedAccount";
import { maybeTronEmptyAccount } from "./maybeTronEmptyAccount";
import { maybeKeepTronAccountAlive } from "./maybeKeepTronAccountAlive";
import { ExchangeSwap } from "./types";

export { getAvailableProviders } from "../providers";

export const operationStatusList = {
  finishedOK: ["finished"],
  finishedKO: ["refunded"],
};

// A swap operation is considered pending if it is not in a finishedOK or finishedKO state
export const isSwapOperationPending: (status: string) => boolean = status =>
  !operationStatusList.finishedOK.includes(status) &&
  !operationStatusList.finishedKO.includes(status);

const getSwapAPIBaseURL: () => string = () => getEnv("SWAP_API_BASE");
const getSwapUserIP = () => {
  const SWAP_USER_IP = getEnv("SWAP_USER_IP");
  if (SWAP_USER_IP) {
    return { "X-Forwarded-For": SWAP_USER_IP };
  }
  return undefined;
};

const SWAP_API_BASE_PATTERN = /.*\/v(?<version>\d+)\/*$/;
const getSwapAPIVersion: () => number = () => {
  const version = Number(getSwapAPIBaseURL().match(SWAP_API_BASE_PATTERN)?.groups?.version);
  if (version == null || isNaN(version)) {
    throw new SwapGenericAPIError(
      "Configured swap API base URL is invalid, should end with /v<number>",
    );
  }
  return version;
};

const USStates = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District Of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const countries = {
  US: "United States",
};

const swapBackendErrorCodes = {
  "100": JSONRPCResponseError,
  "101": JSONDecodeError,
  "200": NoIPHeaderError,
  "300": CurrencyNotSupportedError,
  "301": CurrencyDisabledError,
  "302": CurrencyDisabledAsInputError,
  "303": CurrencyDisabledAsOutputError,
  "304": CurrencyNotSupportedByProviderError,
  "400": TradeMethodNotSupportedError,
  "500": UnexpectedError,
  "600": NotImplementedError,
  "700": ValidationError,
  "701": AccessDeniedError,
};

export const getSwapAPIError = (errorCode: number, errorMessage?: string) => {
  if (errorCode in swapBackendErrorCodes) return new swapBackendErrorCodes[errorCode](errorMessage);
  return new Error(errorMessage);
};

type Keys = Partial<Record<CryptoCurrency["id"], { title: string; description: string }>>;

const INCOMPATIBLE_NANO_S_TOKENS_KEYS: Keys = {
  solana: {
    title: "swap.incompatibility.spl_tokens_title",
    description: "swap.incompatibility.spl_tokens_description",
  },
  solana_testnet: {
    title: "swap.incompatibility.spl_tokens_title",
    description: "swap.incompatibility.spl_tokens_description",
  },
  solana_devnet: {
    title: "swap.incompatibility.spl_tokens_title",
    description: "swap.incompatibility.spl_tokens_description",
  },
};

const INCOMPATIBLE_NANO_S_CURRENCY_KEYS: Keys = {
  ton: {
    title: "swap.incompatibility.ton_title",
    description: "swap.incompatibility.ton_description",
  },
  cardano: {
    title: "swap.incompatibility.ada_title",
    description: "swap.incompatibility.ada_description",
  },
  cardano_testnet: {
    title: "swap.incompatibility.ada_title",
    description: "swap.incompatibility.ada_description",
  },
  aptos: {
    title: "swap.incompatibility.apt_title",
    description: "swap.incompatibility.apt_description",
  },
  aptos_testnet: {
    title: "swap.incompatibility.apt_title",
    description: "swap.incompatibility.apt_description",
  },
  near: {
    title: "swap.incompatibility.near_title",
    description: "swap.incompatibility.near_description",
  },
  cosmos: {
    title: "swap.incompatibility.cosmos_title",
    description: "swap.incompatibility.cosmos_description",
  },
  cosmos_testnet: {
    title: "swap.incompatibility.cosmos_title",
    description: "swap.incompatibility.cosmos_description",
  },
};

const getIncompatibleCurrencyKeys = (exchange: ExchangeSwap) => {
  const parentFrom =
    exchange.fromAccount.type === "TokenAccount"
      ? INCOMPATIBLE_NANO_S_TOKENS_KEYS[exchange.fromAccount.token.parentCurrency.id]
      : undefined;
  const parentTo =
    exchange.toAccount.type === "TokenAccount"
      ? INCOMPATIBLE_NANO_S_TOKENS_KEYS[exchange.toAccount.token.parentCurrency.id]
      : undefined;
  const from =
    exchange.fromAccount.type === "Account"
      ? INCOMPATIBLE_NANO_S_CURRENCY_KEYS[exchange.fromAccount.currency.id]
      : undefined;
  const to =
    exchange.toAccount.type === "Account"
      ? INCOMPATIBLE_NANO_S_CURRENCY_KEYS[exchange.toAccount.currency.id]
      : undefined;

  return parentFrom || parentTo || from || to;
};

export {
  getSwapAPIBaseURL,
  getSwapUserIP,
  getSwapAPIVersion,
  getCompleteSwapHistory,
  postSwapAccepted,
  getExchangeRates,
  maybeTezosAccountUnrevealedAccount,
  maybeTronEmptyAccount,
  maybeKeepTronAccountAlive,
  postSwapCancelled,
  initSwap,
  USStates,
  countries,
  getIncompatibleCurrencyKeys,
};
