import type { CurrenciesData, DatasetTest } from "@ledgerhq/types-live";
import type { Transaction } from "../types";
import { fromTransactionRaw } from "../bridge/transaction";
import BigNumber from "bignumber.js";
import { AmountRequired, InvalidAddress, NotEnoughBalance } from "@ledgerhq/errors";
import { CasperInvalidTransferId, InvalidMinimumAmount, MayBlockAccount } from "../errors";
import { getEstimatedFees } from "../bridge/bridgeHelpers/fee";

const SEED_IDENTIFIER = "0202ba6dc98cbe677711a45bf028a03646f9e588996eb223fad2485e8bc391b01581";
const RECIPIENT_ADDRESS_SECP256k1 =
  "0203A17118eC0e64c4e4FdbDbEe0eA14D118C9aAf08C6c81bbB776Cae607cEB84EcB";
const RECIPIENT_ADDRESS_EDSA25519 =
  "0203A17118eC0e64c4e4FdbDbEe0eA14D118C9aAf08C6c81bbB776Cae607cEB84EcB";

const casper: CurrenciesData<Transaction> = {
  scanAccounts: [
    {
      name: "casper seed 1",
      apdus: `
      => 11010000142c000080fa010080000000800000000000000000
      <= 038c8cb0f62b4efcd0c7868c2e749dda649affe30ff0f95fc91ce48ea67f077d1630323033384338636230663632623445466344304337383638633265373439446461363439614646453330664630663935666339314345343845413637463037374431369000
      => 11010000142c000080fa010080000000800000000001000000
      <= 02ba6dc98cbe677711a45bf028a03646f9e588996eb223fad2485e8bc391b0158130323032624136444339386362453637373731316134356266303238413033363436463965353838393936654232323366616432343835653862633339316230313538319000
      => 11010000142c000080fa010080000000800000000002000000
      <= 022aab9b6ed404f8cffe76ce493e1995d195b5f141ee7d5b7fb20fce60f2a4969130323032324141423942364544343034663843464645373663653439334531393935643139354235463134314565374435423766623230464345363066324134393639319000
      `,
    },
  ],
  accounts: [
    {
      raw: {
        id: `js:2:casper:${SEED_IDENTIFIER}:casper_wallet`,
        seedIdentifier: SEED_IDENTIFIER,
        name: "Casper 1",
        derivationMode: "casper_wallet" as const,
        index: 0,
        freshAddress: SEED_IDENTIFIER,
        freshAddressPath: "44'/506'/0'/0/1",
        blockHeight: 0,
        operations: [],
        pendingOperations: [],
        currencyId: "casper",
        lastSyncDate: "",
        balance: "1000",
      },
      transactions: [
        {
          name: "not a valid address",
          transaction: fromTransactionRaw({
            family: "casper",
            recipient: "novalidaddress",
            fees: getEstimatedFees().toString(),
            amount: "1000",
          }),
          expectedStatus: {
            errors: {
              recipient: new InvalidAddress(),
            },
            warnings: {},
          },
        },
        {
          name: "not enough balance",
          transaction: fromTransactionRaw({
            family: "casper",
            recipient: RECIPIENT_ADDRESS_SECP256k1,
            fees: getEstimatedFees().toString(),
            amount: (300 * 1e9).toString(),
          }),
          expectedStatus: {
            errors: {
              amount: new NotEnoughBalance(),
            },
            warnings: {},
          },
        },
        {
          name: "amount required",
          transaction: fromTransactionRaw({
            family: "casper",
            recipient: RECIPIENT_ADDRESS_SECP256k1,
            amount: "0",
            fees: getEstimatedFees().toString(),
          }),
          expectedStatus: {
            errors: {
              amount: new AmountRequired(),
            },
            warnings: {},
          },
        },
        {
          name: "minimum amount required",
          transaction: fromTransactionRaw({
            family: "casper",
            fees: getEstimatedFees().toString(),
            recipient: RECIPIENT_ADDRESS_SECP256k1,
            amount: "1",
          }),

          expectedStatus: {
            errors: {
              amount: new InvalidMinimumAmount(),
            },
            warnings: {},
          },
        },
        {
          name: "sufficient amount - recipient address secp256k1",
          transaction: fromTransactionRaw({
            family: "casper",
            recipient: RECIPIENT_ADDRESS_SECP256k1,
            amount: "3",
            fees: getEstimatedFees().toString(),
          }),
          expectedStatus: {
            amount: new BigNumber("3"),
            errors: {},
            warnings: {},
          },
        },
        {
          name: "sufficient amount - recipient address ed25519",
          transaction: fromTransactionRaw({
            family: "casper",
            recipient: RECIPIENT_ADDRESS_EDSA25519,
            amount: "3",
            fees: getEstimatedFees().toString(),
          }),
          expectedStatus: {
            amount: new BigNumber("3"),
            errors: {},
            warnings: {},
          },
        },
        {
          name: "invalid transferID",
          transaction: fromTransactionRaw({
            family: "casper",
            recipient: RECIPIENT_ADDRESS_SECP256k1,
            fees: getEstimatedFees().toString(),
            amount: "3",
            transferId: "afdsaf1",
          }),
          expectedStatus: {
            amount: new BigNumber("3"),
            errors: {
              sender: new CasperInvalidTransferId(),
            },
            warnings: {},
          },
        },
        {
          name: "may block account warning",
          transaction: fromTransactionRaw({
            family: "casper",
            recipient: RECIPIENT_ADDRESS_SECP256k1,
            fees: getEstimatedFees().toString(),
            amount: (999 * 1e9).toString(),
          }),
          expectedStatus: {
            errors: {},
            warnings: {
              amount: new MayBlockAccount(),
            },
          },
        },
      ],
    },
  ],
};

export const dataset: DatasetTest<Transaction> = {
  implementations: ["js"],
  currencies: {
    casper,
  },
};
