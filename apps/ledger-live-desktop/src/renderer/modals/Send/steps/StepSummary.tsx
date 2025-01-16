import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import {
  getAccountCurrency,
  getFeesCurrency,
  getFeesUnit,
  getMainAccount,
} from "@ledgerhq/live-common/account/index";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import FormattedVal from "~/renderer/components/FormattedVal";
import Text from "~/renderer/components/Text";
import TranslatedError from "~/renderer/components/TranslatedError";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconQrCode from "~/renderer/icons/QrCode";
import IconWallet from "~/renderer/icons/Wallet";
import { rgba } from "~/renderer/styles/helpers";
import CounterValue from "~/renderer/components/CounterValue";
import Alert from "~/renderer/components/Alert";
import NFTSummary from "~/renderer/screens/nft/Send/Summary";
import { StepProps } from "../types";
import AccountTagDerivationMode from "~/renderer/components/AccountTagDerivationMode";
import { getLLDCoinFamily } from "~/renderer/families";
import { useMaybeAccountUnit } from "~/renderer/hooks/useAccountUnit";
import { useMaybeAccountName } from "~/renderer/reducers/wallet";
import MemoIcon from "~/renderer/icons/MemoIcon";
import { Flex } from "@ledgerhq/react-ui";
import { useFeature } from "@ledgerhq/live-common/featureFlags/index";
import { getMemoTagValueByTransactionFamily } from "~/newArch/features/MemoTag/utils";

const FromToWrapper = styled.div``;
const Circle = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 12px;
`;
const VerticalSeparator = styled.div`
  height: 18px;
  background: ${p => p.theme.colors.palette.text.shade20};
  width: 1px;
  margin: 1px 0px 0px 15px;
`;
const Separator = styled.div`
  height: 1px;
  background: ${p => p.theme.colors.palette.text.shade20};
  width: 100%;
  margin: 15px 0;
`;

const WARN_FROM_UTXO_COUNT = 50;

const StepSummary = (props: StepProps) => {
  const { account, parentAccount, transaction, status, currencyName, isNFTSend, transitionTo } =
    props;
  const mainAccount = account && getMainAccount(account, parentAccount);
  const unit = useMaybeAccountUnit(account);
  const accountName = useMaybeAccountName(account);
  const lldMemoTag = useFeature("lldMemoTag");

  if (!account || !mainAccount || !transaction) {
    return null;
  }

  const { estimatedFees, amount, totalSpent, warnings } = status;
  const txInputs = "txInputs" in status ? status.txInputs : undefined;
  const { feeTooHigh } = warnings;
  const currency = getAccountCurrency(account);
  const feesCurrency = getFeesCurrency(mainAccount);
  const feesUnit = getFeesUnit(feesCurrency);
  const utxoLag = txInputs ? txInputs.length >= WARN_FROM_UTXO_COUNT : null;
  const hasNonEmptySubAccounts =
    account.type === "Account" &&
    (account.subAccounts || []).some(subAccount => subAccount.balance.gt(0));

  const specific = currency ? getLLDCoinFamily(mainAccount.currency.family) : null;
  const SpecificSummaryNetworkFeesRow = specific?.StepSummaryNetworkFeesRow;

  const memo = lldMemoTag?.enabled
    ? getMemoTagValueByTransactionFamily(transaction)
    : (
        transaction as Transaction & {
          memo: string;
        }
      )?.memo;
  const handleOnEditMemo = () => {
    transitionTo("recipient");
  };

  return (
    <Box flow={4} mx={40}>
      <TrackPage
        category="Send Flow"
        name="Step Summary"
        currencyName={currencyName}
        isNFTSend={isNFTSend}
      />
      {utxoLag ? (
        <Alert type="warning">
          <Trans i18nKey="send.steps.details.utxoLag" />
        </Alert>
      ) : null}
      {transaction.useAllAmount && hasNonEmptySubAccounts ? (
        <Alert type="primary">
          <Trans
            i18nKey="send.steps.details.subaccountsWarning"
            values={{
              currency: currency.name,
            }}
          />
        </Alert>
      ) : null}
      <FromToWrapper>
        <Box>
          <Box horizontal alignItems="center">
            <Circle>
              <IconWallet size={14} />
            </Circle>
            <Box flex="1">
              <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                <Trans i18nKey="send.steps.details.from" />
              </Text>
              <Box horizontal alignItems="center">
                <div
                  style={{
                    marginRight: 7,
                  }}
                >
                  <CryptoCurrencyIcon size={16} currency={currency} />
                </div>
                <Text
                  ff="Inter"
                  color="palette.text.shade100"
                  fontSize={4}
                  style={{
                    flex: 1,
                  }}
                >
                  {accountName}
                </Text>
                <AccountTagDerivationMode account={account} />
              </Box>
            </Box>
          </Box>
          <VerticalSeparator />
          <Box horizontal alignItems="center">
            <Circle>
              <IconQrCode size={14} />
            </Circle>
            <Box flex={1}>
              <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                <Trans i18nKey="send.steps.details.to" />
              </Text>
              {transaction.recipientDomain && (
                <Text
                  data-testid="transaction-recipient-ens"
                  ff="Inter|Bold"
                  color="palette.text.shade100"
                  fontSize={4}
                >
                  {transaction.recipientDomain.domain}
                </Text>
              )}
              <Ellipsis>
                <Text
                  ff="Inter"
                  color={
                    transaction.recipientDomain ? "palette.text.shade70" : "palette.text.shade100"
                  }
                  fontSize={4}
                  data-testid="recipient-address"
                >
                  {transaction.recipient}
                </Text>
              </Ellipsis>
            </Box>
          </Box>
          {lldMemoTag?.enabled
            ? memo && (
                <>
                  <VerticalSeparator />
                  <Flex justifyContent="space-between">
                    <Box horizontal alignItems="center">
                      <Circle>
                        <MemoIcon size={14} />
                      </Circle>
                      <Box flex={1}>
                        <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                          <Trans i18nKey="operationDetails.extra.memo" />
                        </Text>
                        <Ellipsis>
                          <Text
                            ff="Inter"
                            color={
                              transaction.recipientDomain
                                ? "palette.text.shade70"
                                : "palette.text.shade100"
                            }
                            fontSize={4}
                            data-testid="recipient-address"
                          >
                            {memo}
                          </Text>
                        </Ellipsis>
                      </Box>
                    </Box>
                    <Button
                      lighterPrimary
                      style={{
                        backgroundColor: "transparent",
                      }}
                      onClick={handleOnEditMemo}
                    >
                      Edit
                    </Button>
                  </Flex>
                </>
              )
            : memo && (
                <Box horizontal justifyContent="space-between" alignItems="center" mb={2}>
                  <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                    <Trans i18nKey="operationDetails.extra.memo" />
                  </Text>
                  <Ellipsis ml={2}>
                    <Text ff="Inter|Medium" fontSize={4}>
                      {memo}
                    </Text>
                  </Ellipsis>
                </Box>
              )}
        </Box>
        <Separator />
        {!isNFTSend ? (
          <Box horizontal justifyContent="space-between" mb={2}>
            <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
              <Trans i18nKey="send.steps.details.amount" />
            </Text>
            <Box>
              <FormattedVal
                color={"palette.text.shade80"}
                disableRounding
                unit={unit}
                val={amount}
                fontSize={4}
                inline
                showCode
                data-testid="transaction-amount"
              />
              <Box textAlign="right">
                <CounterValue
                  color="palette.text.shade60"
                  fontSize={3}
                  currency={currency}
                  value={amount}
                  alwaysShowSign={false}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <NFTSummary transaction={transaction} currency={mainAccount.currency} />
        )}
        {SpecificSummaryNetworkFeesRow ? (
          <SpecificSummaryNetworkFeesRow
            feeTooHigh={feeTooHigh}
            feesUnit={feesUnit}
            estimatedFees={estimatedFees}
            feesCurrency={feesCurrency}
          />
        ) : (
          <>
            <Box horizontal justifyContent="space-between">
              <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                <Trans i18nKey="send.steps.details.fees" />
              </Text>
              <Box>
                <FormattedVal
                  color={feeTooHigh ? "warning" : "palette.text.shade80"}
                  disableRounding
                  unit={feesUnit}
                  alwaysShowValue
                  val={estimatedFees}
                  fontSize={4}
                  inline
                  showCode
                />
                <Box textAlign="right">
                  <CounterValue
                    color={feeTooHigh ? "warning" : "palette.text.shade60"}
                    fontSize={3}
                    currency={feesCurrency}
                    value={estimatedFees}
                    alwaysShowSign={false}
                    alwaysShowValue
                  />
                </Box>
              </Box>
            </Box>
            {feeTooHigh ? (
              <Box horizontal justifyContent="flex-end" alignItems="center" color="warning">
                <IconExclamationCircle size={10} />
                <Text
                  ff="Inter|Medium"
                  fontSize={2}
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  <TranslatedError error={feeTooHigh} />
                </Text>
              </Box>
            ) : null}
          </>
        )}

        {!totalSpent.eq(amount) ? (
          <>
            <Separator />
            <Box horizontal justifyContent="space-between">
              <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                <Trans i18nKey="send.totalSpent" />
              </Text>

              <Box>
                <FormattedVal
                  color={"palette.text.shade80"}
                  disableRounding
                  unit={unit}
                  val={totalSpent}
                  fontSize={4}
                  inline
                  showCode
                  alwaysShowValue
                />
                <Box textAlign="right">
                  <CounterValue
                    color="palette.text.shade60"
                    fontSize={3}
                    currency={currency}
                    value={totalSpent}
                    alwaysShowSign={false}
                    alwaysShowValue
                  />
                </Box>
              </Box>
            </Box>
          </>
        ) : null}
      </FromToWrapper>
    </Box>
  );
};

export const StepSummaryFooter = (props: StepProps) => {
  const { account, status, bridgePending, transitionTo } = props;

  const onNext = async () => {
    transitionTo("device");
  };

  if (!account) {
    return null;
  }

  const { errors } = status;
  const canNext = !bridgePending && !Object.keys(errors).length;

  return (
    <>
      <Button id={"send-summary-continue-button"} primary disabled={!canNext} onClick={onNext}>
        <Trans i18nKey="common.continue" />
      </Button>
    </>
  );
};

export default StepSummary;
