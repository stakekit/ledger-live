import { DerivationModes } from "../types";
import BitcoinLikeWallet from "../wallet";
import * as utils from "../utils";
import { Account } from "../account";
import { getCryptoCurrencyById } from "@ledgerhq/cryptoassets";

describe("testing estimateMaxSpendable", () => {
  const wallet = new BitcoinLikeWallet();
  let account: Account;
  it("should generate an account", async () => {
    account = await wallet.generateAccount(
      {
        xpub: "xpub6CV2NfQJYxHn7MbSQjQip3JMjTZGUbeoKz5xqkBftSZZPc7ssVPdjKrgh6N8U1zoQDxtSo6jLarYAQahpd35SJoUKokfqf1DZgdJWZhSMqP",
        path: "44'/0'",
        index: 0,
        currency: "bitcoin",
        network: "mainnet",
        derivationMode: DerivationModes.LEGACY,
      },
      getCryptoCurrencyById("bitcoin"),
    );

    expect(account.xpub.xpub).toEqual(
      "xpub6CV2NfQJYxHn7MbSQjQip3JMjTZGUbeoKz5xqkBftSZZPc7ssVPdjKrgh6N8U1zoQDxtSo6jLarYAQahpd35SJoUKokfqf1DZgdJWZhSMqP",
    );
  });

  it("should estimate max spendable correctly", async () => {
    await wallet.syncAccount(account);
    let maxSpendable = await wallet.estimateAccountMaxSpendable(account, 0, []);
    const balance = 109088;
    expect(maxSpendable.toNumber()).toEqual(balance);
    const maxSpendableExcludeUtxo = await wallet.estimateAccountMaxSpendable(account, 0, [
      {
        hash: "f80246be50064bb254d2cad82fb0d4ce7768582b99c113694e72411f8032fd7a",
        outputIndex: 0,
      },
    ]);
    expect(maxSpendableExcludeUtxo.toNumber()).toEqual(balance - 1000);
    let feesPerByte = 100;
    maxSpendable = await wallet.estimateAccountMaxSpendable(account, feesPerByte, []);
    expect(maxSpendable.toNumber()).toEqual(
      balance -
        feesPerByte *
          utils.maxTxSizeCeil(2, [], true, account.xpub.crypto, account.xpub.derivationMode),
    );
    feesPerByte = 10000;
    maxSpendable = await wallet.estimateAccountMaxSpendable(account, feesPerByte, []);
    expect(maxSpendable.toNumber()).toEqual(0);
  }, 120000);

  it("should generate a new account", async () => {
    account = await wallet.generateAccount(
      {
        xpub: "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz", // 5400ms
        path: "44'/0'",
        index: 0,
        currency: "bitcoin",
        network: "mainnet",
        derivationMode: DerivationModes.LEGACY,
      },
      getCryptoCurrencyById("bitcoin"),
    );

    expect(account.xpub.xpub).toEqual(
      "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz",
    );
  });

  it("should estimate max spendable correctly with utxo rbf set to true", async () => {
    await wallet.syncAccount(account);
    let maxSpendable = await wallet.estimateAccountMaxSpendable(account, 0, []);
    const balance = 12706308;
    expect(maxSpendable.toNumber()).toEqual(balance);
    const maxSpendableExcludeUtxo = await wallet.estimateAccountMaxSpendable(account, 0, [
      {
        hash: "a24445474a9a7c0698e8db221ad2cae06792a899e9bc7f5a590687c3c810c480",
        outputIndex: 0,
      },
    ]);
    expect(maxSpendableExcludeUtxo.toNumber()).toEqual(balance - 1000);
    let feesPerByte = 100;
    maxSpendable = await wallet.estimateAccountMaxSpendable(account, feesPerByte, []);
    expect(maxSpendable.toNumber()).toEqual(
      balance -
        feesPerByte *
          utils.maxTxSizeCeil(18, [], true, account.xpub.crypto, account.xpub.derivationMode),
    );
    feesPerByte = 10000;
    maxSpendable = await wallet.estimateAccountMaxSpendable(account, feesPerByte, []);
    expect(maxSpendable.toNumber()).toEqual(0);
  }, 120000);
});
