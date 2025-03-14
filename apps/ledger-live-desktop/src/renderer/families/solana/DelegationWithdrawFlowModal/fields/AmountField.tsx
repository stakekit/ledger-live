import {
  SolanaAccount,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/families/solana/types";
import invariant from "invariant";
import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import { useAccountUnit } from "~/renderer/hooks/useAccountUnit";
type Props = {
  account: SolanaAccount;
  transaction: Transaction;
  status: TransactionStatus;
};
const InputRight = styled(Box).attrs(() => ({
  ff: "Inter",
  color: "palette.text.shade80",
  fontSize: 4,
  justifyContent: "center",
  pr: 3,
}))``;
export default function AmountField({ account, transaction, status }: Props) {
  invariant(transaction.family === "solana", "AmountField: solana family expected");
  const defaultUnit = useAccountUnit(account);
  return (
    <InputCurrency
      disabled
      error={status.errors.amount}
      defaultUnit={defaultUnit}
      renderRight={<InputRight>{defaultUnit.code}</InputRight>}
      containerProps={{
        grow: true,
      }}
      value={transaction.amount}
      onChange={() => null}
    />
  );
}
