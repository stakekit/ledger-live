import BigNumber from "bignumber.js";
import { firstValueFrom, reduce } from "rxjs";
import { getCryptoCurrencyById } from "@ledgerhq/cryptoassets/index";
import { Account, AccountBridge, SyncConfig, TransactionCommon } from "@ledgerhq/types-live";
import { TronCoinConfig } from "../config";
import { defaultTronResources } from "../logic/utils";
import { Transaction, TronAccount } from "../types";
import { createBridges } from "./index";
import account1Fixture from "./fixtures/synchronization.account1.fixture.json";

const tron = getCryptoCurrencyById("tron");
const defaultSyncConfig = {
  paginationConfig: {},
  blacklistedTokenIds: [],
};
function syncAccount<T extends TransactionCommon, A extends Account = Account>(
  bridge: AccountBridge<T, A>,
  account: A,
  syncConfig: SyncConfig = defaultSyncConfig,
): Promise<A> {
  return firstValueFrom(
    bridge.sync(account, syncConfig).pipe(reduce((a, f: (arg0: A) => A) => f(a), account)),
  );
}

const dummyAccount: TronAccount = {
  type: "Account",
  id: "",
  derivationMode: "",
  seedIdentifier: "",
  used: false,
  currency: tron,
  index: 0,
  freshAddress: "",
  freshAddressPath: "",
  swapHistory: [],
  blockHeight: 0,
  balance: new BigNumber(0),
  spendableBalance: new BigNumber(0),
  operationsCount: 0,
  operations: [],
  pendingOperations: [],
  lastSyncDate: new Date(0),
  creationDate: new Date(),
  balanceHistoryCache: {
    HOUR: {
      balances: [],
      latestDate: undefined,
    },
    DAY: {
      balances: [],
      latestDate: undefined,
    },
    WEEK: {
      balances: [],
      latestDate: undefined,
    },
  },
  tronResources: {} as any,
};

const reviver = (key: string, value: unknown) => {
  // Format date
  if (
    [
      "date",
      "creationDate",
      "expiredAt",
      "lastVotedDate",
      "lastWithdrawnRewardDate",
      // "lastSyncDate",
      // "latestDate",
    ].includes(key) === true
  ) {
    return value !== null
      ? typeof value === "string"
        ? new Date(value as string)
        : new Date(value as number)
      : new Date("1970-01-01T00:00:00.000Z");
  }

  // BigNumber conversion
  if (["unwithdrawnReward"].includes(key) === true) {
    return new BigNumber(value as string);
  }

  // Remove undesired properties as they always change
  if (
    [
      "blockHeight",
      "lastSyncDate",
      "latestDate",
      "energy",
      "balanceHistoryCache", // Balance can be purged?
    ].includes(key) === true
  ) {
    return undefined;
  }

  return value;
};

describe("Sync Accounts", () => {
  let bridge: ReturnType<typeof createBridges>;

  beforeAll(() => {
    const signer = jest.fn();
    const coinConfig = (): TronCoinConfig => ({
      status: {
        type: "active",
      },
      explorer: {
        url: "https://tron.coin.ledger.com",
      },
    });
    bridge = createBridges(signer, coinConfig);
  });

  it("should always have tronResources", async () => {
    const account = await syncAccount<Transaction, TronAccount>(
      bridge.accountBridge,
      dummyAccount,
      defaultSyncConfig,
    );

    expect(account.tronResources).toEqual(defaultTronResources);
  });

  it.each([
    {
      id: "TL24LCps5FKwp3PoU1MvrYrwhi5LU1tHre",
      expectedAccount: JSON.parse(JSON.stringify(account1Fixture), reviver),
    },
    // "TAVrrARNdnjHgCGMQYeQV7hv4PSu7mVsMj",
    // "THAe4BNVxp293qgyQEqXEkHMpPcqtG73bi",
    // "TRqkRnAj6ceJFYAn2p1eE7aWrgBBwtdhS9",
    // "TUxd6v64YTWkfpFpNDdtgc5Ps4SfGxwizT",
    // "TY2ksFgpvb82TgGPwUSa7iseqPW5weYQyh",
  ])(
    "should always be sync without error for address %s",
    async ({ id, expectedAccount }) => {
      const account = await syncAccount<Transaction, TronAccount>(bridge.accountBridge, {
        ...dummyAccount,
        id: `js:2:tron:${id}:`,
        freshAddress: id,
      });

      expect(account.id).toEqual(`js:2:tron:${id}:`);

      expect(account).toMatchObject(expectedAccount);
    },
    15 * 1_000,
  );
});
