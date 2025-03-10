import {
  useValidators,
  useSolanaStakesWithMeta,
} from "@ledgerhq/live-common/families/solana/react";
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import ValidatorRow from "../../shared/components/ValidatorRow";
import { StepProps } from "../types";
import { useMaybeAccountUnit } from "~/renderer/hooks/useAccountUnit";
import NotEnoughFundsToUnstake from "~/renderer/components/NotEnoughFundsToUnstake";
import { NotEnoughBalance } from "@ledgerhq/errors";

export default function StepValidator({
  account,
  transaction,
  status,
  error,
  t: _t,
  onClose,
}: StepProps) {
  const unit = useMaybeAccountUnit(account);
  if (account === null || transaction === null || account?.solanaResources === undefined || !unit) {
    throw new Error("account, transaction and solana resouces required");
  }
  const { solanaResources } = account;
  if (transaction?.model.kind !== "stake.undelegate") {
    throw new Error("unsupported transaction");
  }
  const { stakeAccAddr } = transaction.model.uiState;
  const stakesWithMeta = useSolanaStakesWithMeta(account.currency, solanaResources.stakes);
  const stakeWithMeta = stakesWithMeta.find(s => s.stake.stakeAccAddr === stakeAccAddr);
  if (stakeWithMeta === undefined) {
    throw new Error(`stake with account address <${stakeAccAddr}> not found`);
  }
  const { stake } = stakeWithMeta;
  const validators = useValidators(account.currency);
  const validator = validators.find(v => v.voteAccount === stake.delegation?.voteAccAddr);
  if (validator === undefined) {
    return null;
  }
  const notEnoughFundsError = status.errors?.fee instanceof NotEnoughBalance;

  return (
    <Box flow={1}>
      <TrackPage
        category="Solana Delegation Deactivate"
        name="Step Validator"
        flow="stake"
        action="deactivate"
        currency="sol"
      />
      {error && <ErrorBanner error={error} />}
      <ValidatorRow
        disableHover
        active
        currency={account.currency}
        validator={validator}
        unit={unit}
      />
      {status.errors.fee && !notEnoughFundsError && <ErrorDisplay error={status.errors.fee} />}
      {notEnoughFundsError ? <NotEnoughFundsToUnstake account={account} onClose={onClose} /> : null}
    </Box>
  );
}
export function StepValidatorFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length > 0;
  const canNext = !bridgePending && !hasErrors;
  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          id="delegate-continue-button"
          disabled={!canNext}
          isLoading={bridgePending}
          primary
          onClick={() => transitionTo("connectDevice")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
