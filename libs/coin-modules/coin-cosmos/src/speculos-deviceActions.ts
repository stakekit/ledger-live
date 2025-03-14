import type { DeviceAction, State } from "@ledgerhq/coin-framework/bot/types";
import { deviceActionFlow, SpeculosButton } from "@ledgerhq/coin-framework/bot/specs";
import type { Transaction } from "./types";

const typeWording = {
  send: "Send",
  delegate: "Delegate",
  redelegate: "Redelegate",
  undelegate: "Undelegate",
  claimReward: "Withdraw Reward",
  claimRewardCompound: "(not tested)",
};

const zenrockTypeWording = {
  send: "Send",
  delegate: "zrchain/MsgDelegate",
  redelegate: "zrchain/MsgBeginRedelegate",
  undelegate: "zrchain/MsgUndelegate",
  claimReward: "Withdraw Reward",
  claimRewardCompound: "(not tested)",
};

export const acceptTransaction: DeviceAction<Transaction, State<Transaction>> = deviceActionFlow({
  steps: [
    {
      title: "Review",
      button: SpeculosButton.RIGHT,
    },
    {
      title: "Please",
      button: SpeculosButton.RIGHT,
    },
    {
      title: "Sequence",
      button: SpeculosButton.RIGHT,
    },
    {
      title: "Chain ID",
      button: SpeculosButton.RIGHT,
    },
    {
      title: "Account",
      button: SpeculosButton.RIGHT,
    },
    {
      title: "Type",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ transaction, account }) => {
        if (account.currency.id === "zenrock") {
          return zenrockTypeWording[transaction.mode];
        }
        return typeWording[transaction.mode];
      },
    },
    {
      title: "Validator Source",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ transaction }) => transaction.sourceValidator || "",
    },
    {
      title: "Validator Dest",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ transaction }) => transaction.validators[0].address,
    },
    {
      title: "Validator",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ transaction }, acc) =>
        transaction.validators[acc.filter(a => a.title === "Validator").length].address,
    },
    {
      title: "Memo",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ transaction }) => transaction.memo || "",
    },
    {
      title: "Fee",
      button: SpeculosButton.RIGHT,
    },
    {
      title: "Gas",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ transaction }) => transaction.gas?.toString() || "",
    },
    {
      title: "Amount",
      button: SpeculosButton.RIGHT,
    },
    {
      title: "From",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ account }) => account.freshAddress,
    },
    {
      title: "To",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ transaction }) => transaction.recipient,
    },
    {
      title: "Delegator",
      button: SpeculosButton.RIGHT,
      expectedValue: ({ account }) => account.freshAddress,
    },
    {
      title: "APPROVE",
      button: SpeculosButton.BOTH,
      final: true,
    },
    {
      title: "REJECT",
    },
  ],
});
