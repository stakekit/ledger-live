import BigNumber from "bignumber.js";
import { cardanoRawAccount1 } from "./datasets/rawAccount.1";
import { cardanoScanAccounts } from "./datasets/scanAccounts";
import { CardanoInvalidPoolId, CardanoMinAmountError } from "./errors";
import { fromTransactionRaw } from "./transaction";
import type { Transaction } from "./types";
import type { DatasetTest } from "@ledgerhq/types-live";
import { Buffer as OriginalBuffer } from "buffer";

// NOTE: overrides polyfill set here libs/ledger-live-common/jest.polyfills.js
Object.defineProperty(globalThis, "Buffer", {
  value: OriginalBuffer,
  writable: true,
  configurable: true,
});

export const dataset: DatasetTest<Transaction> = {
  implementations: ["js"],
  currencies: {
    cardano_testnet: {
      scanAccounts: cardanoScanAccounts,
      accounts: [
        {
          raw: cardanoRawAccount1,
          transactions: [
            {
              name: "amount less then minimum",
              transaction: fromTransactionRaw({
                family: "cardano",
                recipient:
                  "addr_test1qpl90kc2jl5kr9tev0s7vays9yhwcdnq8nlylyk4dqsdq3g466elxnxwrzwq72pvp5akenj30t5s9et7frfvrxxx8xcsxrzs87",
                amount: "0.1",
                mode: "send",
                poolId: undefined,
              }),
              expectedStatus: {
                amount: new BigNumber("0.1"),
                errors: {
                  amount: new CardanoMinAmountError(),
                },
              },
            },
            /* // FIXME broken test
            {
              name: "token amount more than balance",
              transaction: fromTransactionRaw({
                family: "cardano",
                recipient:
                  "addr_test1qpl90kc2jl5kr9tev0s7vays9yhwcdnq8nlylyk4dqsdq3g466elxnxwrzwq72pvp5akenj30t5s9et7frfvrxxx8xcsxrzs87",
                amount: "101",
                subAccountId:
                  "js:2:cardano_testnet:806499588e0c4a58f4119f7e6e096bf42c3f774a528d2acec9e82ceebf87d1ceb3d4f3622dd2c77c65cc89c123f79337db22cf8a69f122e36dab1bf5083bf82d:cardano+cardano_testnet%2Fnative%2F47be64fcc8a7fe5321b976282ce4e43e4d29015f6613cfabcea28eab54657374",
                mode: "send",
                poolId: undefined,
              }),
              expectedStatus: {
                amount: new BigNumber("101"),
                errors: {
                  amount: new NotEnoughBalance(),
                },
              },
            },
            {
              name: "send max token",
              transaction: fromTransactionRaw({
                family: "cardano",
                recipient:
                  "addr_test1qpl90kc2jl5kr9tev0s7vays9yhwcdnq8nlylyk4dqsdq3g466elxnxwrzwq72pvp5akenj30t5s9et7frfvrxxx8xcsxrzs87",
                amount: "0",
                subAccountId:
                  "js:2:cardano_testnet:806499588e0c4a58f4119f7e6e096bf42c3f774a528d2acec9e82ceebf87d1ceb3d4f3622dd2c77c65cc89c123f79337db22cf8a69f122e36dab1bf5083bf82d:cardano+cardano_testnet%2Fnative%2F47be64fcc8a7fe5321b976282ce4e43e4d29015f6613cfabcea28eab54657374",
                mode: "send",
                useAllAmount: true,
                poolId: undefined,
              }),
              expectedStatus: {
                amount: new BigNumber("100"),
                totalSpent: new BigNumber("100"),
                errors: {},
                warnings: {},
              },
            },
            */
            {
              name: "delegate to invalid poolId",
              transaction: fromTransactionRaw({
                family: "cardano",
                recipient: "",
                amount: "0",
                mode: "delegate",
                poolId: "efae72c07a26e4542ba55ef59d35ad45ffaaac312865e3a758ede",
              }),
              expectedStatus: {
                errors: {
                  poolId: new CardanoInvalidPoolId(),
                },
              },
            },
            {
              name: "delegate valid poolId",
              transaction: fromTransactionRaw({
                family: "cardano",
                recipient: "",
                amount: "0",
                mode: "delegate",
                poolId: "efae72c07a26e4542ba55ef59d35ad45ffaaac312865e3a758ede997",
              }),
              expectedStatus: {},
            },
          ],
        },
      ],
    },
  },
};

describe("Cardano bridge", () => {
  test.todo(
    "This is an empty test to make jest command pass. Remove it once there is a real test.",
  );
});
