import { getAccountCurrency } from "@ledgerhq/live-common/account/helpers";
import { getAccountBridge } from "@ledgerhq/live-common/bridge/index";
import useBridgeTransaction from "@ledgerhq/live-common/bridge/useBridgeTransaction";
import { SOLANA_DELEGATION_RESERVE } from "@ledgerhq/live-common/families/solana/staking";
import { useTheme } from "@react-navigation/native";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Keyboard,
  Linking,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Flex, Link, Text } from "@ledgerhq/native-ui";
import { TrackScreen } from "~/analytics";
import Button from "~/components/Button";
import CancelButton from "~/components/CancelButton";
import CurrencyUnitValue from "~/components/CurrencyUnitValue";
import GenericErrorBottomModal from "~/components/GenericErrorBottomModal";
import KeyboardView from "~/components/KeyboardView";
import RetryButton from "~/components/RetryButton";
import Touchable from "~/components/Touchable";
import { ScreenName } from "~/const";
import InfoIcon from "~/icons/Info";
import { accountScreenSelector } from "~/reducers/accounts";
import AmountInput from "~/screens/SendFunds/AmountInput";
import type { StackNavigatorProps } from "~/components/RootNavigator/types/helpers";
import type { SolanaDelegationFlowParamList } from "./types";
import QueuedDrawer from "~/components/QueuedDrawer";
import { GenericInformationBody } from "~/components/GenericInformationBody";
import { ExternalLinkMedium, InformationFill } from "@ledgerhq/native-ui/assets/icons";
import { urls } from "~/utils/urls";
import { useAccountUnit } from "~/hooks/useAccountUnit";

type Props = StackNavigatorProps<SolanaDelegationFlowParamList, ScreenName.SolanaEditAmount>;

export default function DelegationSelectAmount({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { account } = useSelector(accountScreenSelector(route));
  const { t } = useTranslation();

  invariant(account?.type === "Account", "must be account");

  const [maxSpendable, setMaxSpendable] = useState(0);

  const bridge = getAccountBridge(account);

  const { transaction, setTransaction, status, bridgePending, bridgeError } = useBridgeTransaction(
    () => ({
      account,
      transaction: {
        ...bridge.createTransaction(account),
        amount: new BigNumber(route.params.amount ?? 0),
        family: "solana",
        model: {
          kind: "stake.createAccount",
          uiState: {
            delegate: { voteAccAddress: "" },
          },
        },
      },
    }),
  );

  invariant(transaction, "transaction must be defined");

  useEffect(() => {
    let cancelled = false;
    bridge.estimateMaxSpendable({ account, transaction }).then(estimate => {
      if (cancelled) return;
      setMaxSpendable(estimate.toNumber());
    });

    return () => {
      cancelled = true;
    };
  }, [transaction, setMaxSpendable, bridge, account]);

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const onChange = (amount: BigNumber) => {
    setTransaction(bridge.updateTransaction(transaction, { amount }));
  };

  const toggleUseAllAmount = () => {
    setTransaction(
      bridge.updateTransaction(transaction, {
        useAllAmount: !transaction.useAllAmount,
      }),
    );
  };

  const onContinue = () => {
    navigation.navigate(ScreenName.DelegationSummary, {
      ...route.params,
      amount: status.amount.toNumber(),
    });
  };

  const [bridgeErr, setBridgeErr] = useState(bridgeError);
  useEffect(() => setBridgeErr(bridgeError), [bridgeError]);

  const onBridgeErrorCancel = useCallback(() => {
    setBridgeErr(null);
    const parent = navigation.getParent();
    if (parent) parent.goBack();
  }, [navigation]);

  const onBridgeErrorRetry = useCallback(() => {
    setBridgeErr(null);
    setTransaction(bridge.updateTransaction(transaction, {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTransaction, account, transaction]);

  const blur = useCallback(() => Keyboard.dismiss(), []);

  const { useAllAmount } = transaction;
  const { amount } = status;
  const unit = useAccountUnit(account);
  const currency = getAccountCurrency(account);
  const onMaxSpendableLearnMore = useCallback(() => Linking.openURL(urls.maxSpendable), []);

  return (
    <>
      <TrackScreen
        category="SendFunds"
        name="Amount"
        currencyName={currency.name}
        flow="stake"
        action="delegation"
        currency="sol"
      />
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <KeyboardView style={styles.container}>
          <TouchableWithoutFeedback onPress={blur}>
            <View style={styles.amountWrapper}>
              <AmountInput
                editable={!useAllAmount}
                account={account}
                onChange={onChange}
                value={amount}
                error={
                  amount.eq(0) && (bridgePending || !transaction.useAllAmount)
                    ? null
                    : status.errors.amount
                }
                warning={status.warnings.amount}
                testID="solana-delegation-amount-input"
              />

              <View style={styles.bottomWrapper}>
                <View style={[styles.available]}>
                  <Touchable
                    style={styles.availableLeft}
                    event={"MaxSpendableInfo"}
                    onPress={() => setInfoModalOpen(true)}
                  >
                    <View>
                      <Text color="grey">
                        <Trans i18nKey="send.amount.available" />{" "}
                        <InfoIcon size={12} color="grey" />
                      </Text>
                      {maxSpendable > 0 && (
                        <Text fontWeight="semiBold" color="grey">
                          <CurrencyUnitValue showCode unit={unit} value={maxSpendable} />
                        </Text>
                      )}
                    </View>
                  </Touchable>
                  <View style={styles.availableRight}>
                    <Text style={styles.maxLabel} color="grey">
                      <Trans i18nKey="send.amount.useMax" />
                    </Text>
                    <Switch
                      style={styles.switch}
                      value={useAllAmount ?? false}
                      onValueChange={toggleUseAllAmount}
                    />
                  </View>
                </View>
                <View style={styles.available}>
                  <Text color="grey">
                    <InfoIcon size={12} color="grey" />{" "}
                    <Trans
                      i18nKey="solana.delegation.reserveWarning"
                      values={{
                        amount: SOLANA_DELEGATION_RESERVE,
                      }}
                    />
                  </Text>
                </View>
                <View style={styles.continueWrapper}>
                  <Button
                    event="SendAmountCoinContinue"
                    type="primary"
                    title={
                      <Trans
                        i18nKey={!bridgePending ? "common.continue" : "send.amount.loadingNetwork"}
                      />
                    }
                    onPress={onContinue}
                    testID="solana-delegation-amount-continue"
                    disabled={!!status.errors.amount || bridgePending}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardView>
      </SafeAreaView>

      <QueuedDrawer
        isRequestingToBeOpened={!!infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      >
        <Flex>
          <GenericInformationBody
            Icon={InformationFill}
            iconColor={"primary.c80"}
            title={t("send.info.maxSpendable.title")}
            description={t("send.info.maxSpendable.description")}
          />
          <Flex px="6">
            <Link
              type="main"
              size="large"
              Icon={ExternalLinkMedium}
              onPress={onMaxSpendableLearnMore}
            >
              {t("common.learnMore")}
            </Link>
          </Flex>
        </Flex>
      </QueuedDrawer>

      <GenericErrorBottomModal
        error={bridgeErr}
        onClose={onBridgeErrorRetry}
        footerButtons={
          <>
            <CancelButton containerStyle={styles.button} onPress={onBridgeErrorCancel} />
            <RetryButton
              containerStyle={[styles.button, styles.buttonRight]}
              onPress={onBridgeErrorRetry}
            />
          </>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  available: {
    flexDirection: "row",
    display: "flex",
    flexGrow: 1,
    marginBottom: 16,
  },
  availableRight: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  availableLeft: {
    justifyContent: "center",
    flexGrow: 1,
  },
  maxLabel: {
    marginRight: 4,
  },
  bottomWrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  continueWrapper: {
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
  amountWrapper: {
    flex: 1,
  },
  switch: {
    opacity: 0.99,
  },
  infoDescriptionWrapper: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "red",
    width: 100,
  },
  infoDescription: {
    flexShrink: 1,
    marginBottom: 14,
  },
  learnMore: {
    marginRight: 4,
    alignSelf: "flex-end",
  },
});
