import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { getEnv } from "@ledgerhq/live-env";
import type { Transaction } from "@ledgerhq/live-common/generated/types";
import {
  ExchangeSwap,
  ExchangeRate,
  InitSwapResult,
  SwapTransaction,
  SwapTransactionType,
} from "@ledgerhq/live-common/exchange/swap/types";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/bridge/react/index";
import addToSwapHistory from "@ledgerhq/live-common/exchange/swap/addToSwapHistory";
import { addPendingOperation, getMainAccount } from "@ledgerhq/live-common/account/index";
import { AccountLike, DeviceInfo, Operation, SignedOperation } from "@ledgerhq/types-live";
import { Device } from "@ledgerhq/live-common/hw/actions/types";
import { postSwapAccepted, postSwapCancelled } from "@ledgerhq/live-common/exchange/swap/index";
import { InstalledItem } from "@ledgerhq/live-common/apps/types";
import { useBroadcast } from "@ledgerhq/live-common/hooks/useBroadcast";
import { HardwareUpdate, renderLoading } from "~/components/DeviceAction/rendering";
import { updateAccountWithUpdater } from "~/actions/accounts";
import DeviceAction from "~/components/DeviceAction";
import QueuedDrawer from "~/components/QueuedDrawer";
import ModalBottomAction from "~/components/ModalBottomAction";
import { UnionToIntersection } from "~/types/helpers";
import type { StackNavigatorNavigation } from "~/components/RootNavigator/types/helpers";
import { ScreenName } from "~/const";
import type { SwapNavigatorParamList } from "~/components/RootNavigator/types/SwapNavigator";
import { useInitSwapDeviceAction, useTransactionDeviceAction } from "~/hooks/deviceActions";
import { BigNumber } from "bignumber.js";
import { mevProtectionSelector } from "~/reducers/settings";
import { DeviceModelId } from "@ledgerhq/devices";

export type DeviceMeta = {
  result: { installed: InstalledItem[] } | null | undefined;
  device: Device;
  deviceInfo: DeviceInfo;
};

interface Props {
  swapTx: SwapTransactionType;
  exchangeRate: ExchangeRate;
  deviceMeta: DeviceMeta;
  onError: (_error: { error: Error; swapId?: string }) => void;
  onCancel: () => void;
  isOpen: boolean;
}

type NavigationProp = StackNavigatorNavigation<SwapNavigatorParamList>;
type Keys = Record<string, { title: string; description: string }>;

const INCOMPATIBLE_NANO_S_TOKENS_KEYS: Keys = {
  solana: {
    title: "transfer.swap2.incompatibility.spl_tokens_title",
    description: "transfer.swap2.incompatibility.spl_tokens_description",
  },
};

const INCOMPATIBLE_NANO_S_CURRENCY_KEYS: Keys = {
  ton: {
    title: "transfer.swap2.incompatibility.ton_title",
    description: "transfer.swap2.incompatibility.ton_description",
  },
  cardano: {
    title: "transfer.swap2.incompatibility.ada_title",
    description: "transfer.swap2.incompatibility.ada_description",
  },
};

const getIncompatibleCurrencyKeys = (exchange: ExchangeSwap) => {
  const parentFrom =
    (exchange?.fromAccount?.type === "TokenAccount" && exchange?.fromParentAccount?.currency?.id) ||
    "";
  const parentTo =
    (exchange?.toAccount?.type === "TokenAccount" && exchange?.toParentAccount?.currency?.id) || "";
  const from =
    (exchange?.fromAccount.type === "Account" && exchange?.fromAccount?.currency?.id) || "";
  const to = (exchange?.toAccount.type === "Account" && exchange?.toAccount?.currency?.id) || "";

  return (
    INCOMPATIBLE_NANO_S_TOKENS_KEYS[parentFrom] ||
    INCOMPATIBLE_NANO_S_TOKENS_KEYS[parentTo] ||
    INCOMPATIBLE_NANO_S_CURRENCY_KEYS[from] ||
    INCOMPATIBLE_NANO_S_CURRENCY_KEYS[to]
  );
};

export function Confirmation({
  swapTx: swapTxProp,
  exchangeRate: exchangeRateProp,
  onError,
  onCancel,
  deviceMeta,
  isOpen,
}: Props) {
  // tx should not change once user enter device action flow.
  const swapTx = useRef(swapTxProp);
  const exchangeRate = useRef(exchangeRateProp);
  const provider = exchangeRate.current.provider;

  const {
    from: { account: fromAccount, parentAccount: fromParentAccount },
    to: { account: toAccount, parentAccount: toParentAccount },
  } = swapTx.current.swap;

  const exchange = useMemo<ExchangeSwap>(
    () => ({
      fromAccount: fromAccount as AccountLike,
      fromParentAccount,
      toAccount: toAccount as AccountLike,
      toParentAccount,
    }),
    [fromAccount, fromParentAccount, toAccount, toParentAccount],
  );

  const [swapData, setSwapData] = useState<InitSwapResult | null>(null);
  const [signedOperation, setSignedOperation] = useState<SignedOperation | null>(null);
  const mevProtected = useSelector(mevProtectionSelector);
  const dispatch = useDispatch();
  const broadcast = useBroadcast({
    account: fromAccount,
    parentAccount: fromParentAccount,
    broadcastConfig: { mevProtected },
  });
  const tokenCurrency =
    fromAccount && fromAccount.type === "TokenAccount" ? fromAccount.token : null;
  const navigation = useNavigation<NavigationProp>();

  const onComplete = useCallback(
    ({
      magnitudeAwareRate,
      ...result
    }: {
      operation: Operation;
      swapId: string;
      magnitudeAwareRate: BigNumber;
    }) => {
      const { operation, swapId } = result;
      /**
       * If transaction broadcast are disabled, consider the swap as cancelled
       * since the partner will never receive the funds
       */
      if (getEnv("DISABLE_TRANSACTION_BROADCAST")) {
        postSwapCancelled({
          provider,
          swapId,
          swapStep: "SIGN_COIN_TRANSACTION",
          statusCode: "DISABLE_TRANSACTION_BROADCAST",
          errorMessage: "DISABLE_TRANSACTION_BROADCAST",
          sourceCurrencyId: swapTx.current.swap.from.currency?.id,
          targetCurrencyId: swapTx.current.swap.to.currency?.id,
          hardwareWalletType: deviceMeta.device.modelId,
          swapType: exchangeRate.current.tradeMethod,
        });
      } else {
        postSwapAccepted({
          provider,
          swapId,
          transactionId: operation.hash,
          sourceCurrencyId: swapTx.current.swap.from.currency?.id,
          targetCurrencyId: swapTx.current.swap.to.currency?.id,
          hardwareWalletType: deviceMeta.device.modelId,
          swapType: exchangeRate.current.tradeMethod,
        });
      }

      const mainAccount = fromAccount && getMainAccount(fromAccount, fromParentAccount);

      if (!mainAccount || !exchangeRate) return;
      dispatch(
        updateAccountWithUpdater({
          accountId: mainAccount.id,
          updater: account =>
            addPendingOperation(
              addToSwapHistory({
                account,
                operation,
                transaction: swapTx.current.transaction as Transaction,
                swap: {
                  exchange,
                  exchangeRate: {
                    ...exchangeRate.current,
                    magnitudeAwareRate,
                  },
                },
                swapId,
              }),
              operation,
            ),
        }),
      );

      if (typeof swapTx.current.swap.from.amount !== "undefined") {
        navigation.replace(ScreenName.SwapPendingOperation, {
          swapOperation: {
            fromAccountId: fromAccount.id,
            fromParentAccount,
            toAccountId: toAccount!.id,
            toParentAccount,
            toExists: false,
            operation,
            provider,
            swapId,
            status: "pending",
            fromAmount: swapTx.current.swap.from.amount,
            toAmount: exchangeRate.current.toAmount,
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      toAccount,
      fromAccount,
      fromParentAccount,
      dispatch,
      navigation,
      exchange,
      toParentAccount,
      provider,
    ],
  );

  useEffect(() => {
    if (swapData && signedOperation) {
      const { swapId, magnitudeAwareRate } = swapData;
      broadcast(signedOperation).then(
        operation => {
          onComplete({ operation, swapId, magnitudeAwareRate });
        },
        error => {
          onError(error);
        },
      );
    }
  }, [broadcast, onComplete, onError, signedOperation, swapData]);

  const silentSigningAction = useTransactionDeviceAction();
  const swapAction = useInitSwapDeviceAction();

  const { t } = useTranslation();

  const keys = getIncompatibleCurrencyKeys(exchange);

  if (deviceMeta?.device?.modelId === DeviceModelId.nanoS && keys) {
    return (
      <QueuedDrawer isRequestingToBeOpened={isOpen} preventBackdropClick onClose={onCancel}>
        <ModalBottomAction
          footer={
            <View style={styles.footerContainer}>
              <HardwareUpdate
                t={t}
                device={deviceMeta.device}
                i18nKeyTitle={keys.title}
                i18nKeyDescription={keys.description}
              />
            </View>
          }
        />
      </QueuedDrawer>
    );
  }

  return (
    <QueuedDrawer isRequestingToBeOpened={isOpen} preventBackdropClick onClose={onCancel}>
      <SyncSkipUnderPriority priority={100} />
      <ModalBottomAction
        footer={
          <View style={styles.footerContainer}>
            {signedOperation ? (
              renderLoading({
                t,
                description: t("transfer.swap.broadcasting"),
                lockModal: true,
              })
            ) : !swapData ? (
              <DeviceAction
                key={"initSwap"}
                action={swapAction}
                device={deviceMeta.device}
                request={{
                  exchange,
                  exchangeRate: exchangeRate.current,
                  transaction: swapTx.current.transaction as SwapTransaction,
                }}
                onResult={result => {
                  const { initSwapResult, initSwapError, swapId } = result as UnionToIntersection<
                    typeof result
                  >;
                  if (initSwapError) {
                    onError({ error: initSwapError, swapId });
                  } else {
                    setSwapData(initSwapResult);
                  }
                }}
                onError={error => onError({ error })}
                analyticsPropertyFlow="swap"
              />
            ) : (
              <DeviceAction
                action={silentSigningAction}
                device={deviceMeta.device}
                request={{
                  status: swapTx.current.status,
                  tokenCurrency,
                  parentAccount: fromParentAccount,
                  account: fromAccount as AccountLike,
                  transaction: swapData.transaction,
                  appName: "Exchange",
                }}
                onResult={result => {
                  const { transactionSignError, signedOperation, swapId } =
                    result as UnionToIntersection<typeof result>;
                  if (transactionSignError) {
                    onError({ error: transactionSignError, swapId });
                  } else {
                    setSignedOperation(signedOperation);
                  }
                }}
                onError={error => onError({ error })}
                analyticsPropertyFlow="swap"
              />
            )}
          </View>
        }
      />
    </QueuedDrawer>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
  },
});
