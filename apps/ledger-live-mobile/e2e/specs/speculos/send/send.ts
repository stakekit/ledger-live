import { setEnv } from "@ledgerhq/live-env";
import { verifyAppValidationSendInfo } from "../../../models/send";
import { Application } from "../../../page";
import { CLI } from "../../../utils/cliUtils";
import { Transaction } from "@ledgerhq/live-common/e2e/models/Transaction";
import { device } from "detox";
import invariant from "invariant";

async function navigateToSendScreen(app: Application, accountName: string) {
  await app.accounts.openViaDeeplink();
  await app.common.goToAccountByName(accountName);
  await app.account.tapSend();
}

const beforeAllFunction = async (app: Application, transaction: Transaction) => {
  await app.init({
    speculosApp: transaction.accountToDebit.currency.speculosApp,
    cliCommands: [
      () => {
        return CLI.liveData({
          currency: transaction.accountToDebit.currency.currencyId,
          index: transaction.accountToDebit.index,
          add: true,
          appjson: app.userdataPath,
        });
      },
    ],
  });

  await app.portfolio.waitForPortfolioPageToLoad();
};

export async function runSendTest(transaction: Transaction, tmsLink: string) {
  const app = new Application();

  $TmsLink(tmsLink);
  describe("Send from 1 account to another", () => {
    beforeAll(async () => {
      await beforeAllFunction(app, transaction);
    });

    it(`Send from ${transaction.accountToDebit.accountName} to ${transaction.accountToCredit.accountName}`, async () => {
      const addressToCredit = transaction.accountToCredit.address;
      await navigateToSendScreen(app, transaction.accountToDebit.accountName);
      await app.send.setRecipientAndContinue(addressToCredit, transaction.memoTag);
      await app.send.setAmountAndContinue(transaction.amount);

      const amountWithCode = transaction.amount + " " + transaction.accountToCredit.currency.ticker;
      await app.send.expectSummaryAmount(amountWithCode);
      await app.send.expectSummaryRecipient(addressToCredit);
      await app.send.expectSummaryMemoTag(transaction.memoTag);
      await app.send.summaryContinue();
      await app.send.dismissHighFeeModal();

      await verifyAppValidationSendInfo(app, transaction, amountWithCode);

      await app.speculos.signSendTransaction(transaction);

      await device.disableSynchronization();
      await app.common.successViewDetails();

      await app.operationDetails.waitForOperationDetails();
      await app.operationDetails.checkAccount(transaction.accountToDebit.accountName);
      await app.operationDetails.checkRecipient(addressToCredit);
      await app.operationDetails.checkTransactionType("OUT");
    });
  });
}

export async function runSendInvalidAddressTest(
  transaction: Transaction,
  expectedErrorMessage: string,
  tmsLink: string,
  accountName?: string,
) {
  const app = new Application();

  $TmsLink(tmsLink);
  describe("Send - invalid address input", () => {
    beforeAll(async () => {
      await beforeAllFunction(app, transaction);
    });

    it(`Send from ${transaction.accountToDebit.accountName} ${accountName || ""} to ${transaction.accountToCredit.accountName} - invalid address input`, async () => {
      await navigateToSendScreen(app, accountName || transaction.accountToDebit.accountName);
      await app.send.setRecipient(transaction.accountToCredit.address, transaction.memoTag);
      await app.send.expectSendRecipientError(expectedErrorMessage);
    });
  });
}

export async function runSendValidAddressTest(
  transaction: Transaction,
  tmsLink: string,
  accountName?: string,
  expectedWarningMessage?: string,
) {
  const app = new Application();

  $TmsLink(tmsLink);
  describe("Send - valid address & amount input", () => {
    beforeAll(async () => {
      await beforeAllFunction(app, transaction);
    });

    it(`Send from ${transaction.accountToDebit.accountName} ${accountName || ""} to ${transaction.accountToCredit.accountName} - valid address & amount input`, async () => {
      await navigateToSendScreen(app, accountName || transaction.accountToDebit.accountName);
      await app.send.setRecipient(transaction.accountToCredit.address, transaction.memoTag);
      await app.send.expectSendRecipientSuccess(expectedWarningMessage);
      await app.send.recipientContinue(transaction.memoTag);
      await app.send.setAmountAndContinue(transaction.amount);

      const amountWithCode = transaction.amount + " " + transaction.accountToCredit.currency.ticker;
      await app.send.expectSummaryAmount(amountWithCode);
      await app.send.expectSummaryRecipient(transaction.accountToCredit.address);
      await app.send.expectSummaryMemoTag(transaction.memoTag);
      if (expectedWarningMessage) await app.send.expectSummaryWarning(expectedWarningMessage);
    });
  });
}

export async function runSendInvalidAmountTest(
  transaction: Transaction,
  expectedErrorMessage: string,
  tmsLink: string,
) {
  const app = new Application();

  $TmsLink(tmsLink);
  describe("Check invalid amount input error", () => {
    beforeAll(async () => {
      await beforeAllFunction(app, transaction);
    });

    it(`Check "${expectedErrorMessage}" for ${transaction.accountToDebit.currency.name} - invalid amount ${transaction.amount} input error`, async () => {
      await navigateToSendScreen(app, transaction.accountToDebit.accountName);
      await app.send.setRecipientAndContinue(
        transaction.accountToCredit.address,
        transaction.memoTag,
      );
      await app.send.setAmount(transaction.amount);
      await app.send.expectSendAmountError(expectedErrorMessage);
    });
  });
}

export async function runSendInvalidTokenAmountTest(
  transaction: Transaction,
  expectedErrorMessage: RegExp | string,
  tmsLink: string,
) {
  const app = new Application();

  $TmsLink(tmsLink);
  describe("Send token (subAccount) - invalid amount input", () => {
    beforeAll(async () => {
      await beforeAllFunction(app, transaction);
    });

    it(`Check error message for ${transaction.accountToDebit.currency.name} - invalid amount ${transaction.amount} input error`, async () => {
      const addressToCredit = transaction.accountToCredit.address;
      await navigateToSendScreen(app, transaction.accountToDebit.currency.name);
      await app.send.setRecipientAndContinue(addressToCredit, transaction.memoTag);
      await app.send.setAmount(transaction.amount);
      if (expectedErrorMessage instanceof RegExp) {
        await app.send.expectSendAmountSuccess();
        await app.send.amountContinue();

        const amountWithCode =
          transaction.amount + " " + transaction.accountToCredit.currency.ticker;
        await app.send.expectSummaryAmount(amountWithCode);
        await app.send.expectSummaryRecipient(transaction.accountToCredit.address);
        await app.send.expectSendSummaryError(expectedErrorMessage);
      } else {
        await app.send.expectSendAmountError(expectedErrorMessage);
      }
    });
  });
}

export async function runSendMaxTest(transaction: Transaction, tmsLink: string) {
  setEnv("DISABLE_TRANSACTION_BROADCAST", true);
  const app = new Application();

  $TmsLink(tmsLink);
  describe("Verify send max user flow", () => {
    beforeAll(async () => {
      await beforeAllFunction(app, transaction);
    });

    it(`Check Valid amount input (${transaction.amount}) - ${transaction.accountToCredit.accountName}`, async () => {
      const addressToCredit = transaction.accountToCredit.address;
      await navigateToSendScreen(app, transaction.accountToDebit.accountName);
      await app.send.setRecipientAndContinue(addressToCredit, transaction.memoTag);
      const amount = await app.send.setAmount("max");
      await app.send.expectSendAmountSuccess();
      await app.send.amountContinue();

      await app.send.expectSummaryMaxAmount(amount);
      await app.send.expectSummaryRecipient(addressToCredit);
      await app.send.expectSummaryMemoTag(transaction.memoTag);
    });
  });
}

export async function runSendENSTest(transaction: Transaction, tmsLink: string) {
  setEnv("DISABLE_TRANSACTION_BROADCAST", true);
  const app = new Application();

  $TmsLink(tmsLink);
  describe("User sends funds to ENS address", () => {
    beforeAll(async () => {
      await beforeAllFunction(app, transaction);
    });

    it(`User sends funds to ENS address - ${transaction.accountToCredit.ensName}`, async () => {
      const ensName = transaction.accountToCredit.ensName;
      invariant(ensName, "ENS name is not provided");

      await navigateToSendScreen(app, transaction.accountToDebit.accountName);
      await app.send.setRecipientAndContinue(ensName, transaction.memoTag);
      await app.send.setAmountAndContinue(transaction.amount);

      const amountWithCode = transaction.amount + " " + transaction.accountToCredit.currency.ticker;
      await app.send.expectSummaryAmount(amountWithCode);
      await app.send.expectSummaryRecipient(transaction.accountToCredit.address);
      await app.send.expectSummaryRecipientEns(ensName);
      await app.send.expectSummaryMemoTag(transaction.memoTag);
      await app.send.summaryContinue();
      await app.send.dismissHighFeeModal();

      await verifyAppValidationSendInfo(app, transaction, amountWithCode);

      await app.speculos.signSendTransaction(transaction);

      await device.disableSynchronization();
      await app.common.successViewDetails();

      await app.operationDetails.waitForOperationDetails();
      await app.operationDetails.checkAccount(transaction.accountToDebit.accountName);
      await app.operationDetails.checkRecipient(transaction.accountToCredit.address);
      await app.operationDetails.checkTransactionType("OUT");
    });
  });
}
