import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Flex } from "@ledgerhq/native-ui";
import type { Device } from "@ledgerhq/live-common/hw/actions/types";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { prepareCurrency } from "~/bridge/cache";
import { ScreenName } from "~/const";
import { track } from "~/analytics";
import SelectDevice2, { SetHeaderOptionsRequest } from "~/components/SelectDevice2";
import DeviceActionModal from "~/components/DeviceActionModal";
import SkipSelectDevice from "../SkipSelectDevice";
import { ReceiveFundsStackParamList } from "~/components/RootNavigator/types/ReceiveFundsNavigator";
import {
  ReactNavigationHeaderOptions,
  StackNavigatorProps,
} from "~/components/RootNavigator/types/helpers";
import { NavigationHeaderCloseButtonAdvanced } from "~/components/NavigationHeaderCloseButton";
import { NavigationHeaderBackButton } from "~/components/NavigationHeaderBackButton";
import { useAppDeviceAction } from "~/hooks/deviceActions";
import { HOOKS_TRACKING_LOCATIONS } from "~/analytics/hooks/variables";

// Defines some of the header options for this screen to be able to reset back to them.
export const addAccountsSelectDeviceHeaderOptions = (
  onClose: () => void,
): ReactNavigationHeaderOptions => ({
  headerRight: () => <NavigationHeaderCloseButtonAdvanced onClose={onClose} />,
  headerLeft: () => <NavigationHeaderBackButton />,
});

export default function AddAccountsSelectDevice({
  navigation,
  route,
}: StackNavigatorProps<ReceiveFundsStackParamList, ScreenName.ReceiveAddAccountSelectDevice>) {
  const { currency } = route.params;
  const { colors } = useTheme();
  const [device, setDevice] = useState<Device | null>(null);
  const action = useAppDeviceAction();
  const isFocused = useIsFocused();

  const onClose = useCallback(() => {
    setDevice(null);
  }, []);

  const onResult = useCallback(
    // @ts-expect-error should be AppResult but navigation.navigate does not agree
    meta => {
      setDevice(null);
      const { inline } = route.params;
      const arg = { ...route.params, ...meta };
      if (inline) {
        navigation.replace(ScreenName.ReceiveAddAccount, arg);
      } else {
        navigation.navigate(ScreenName.ReceiveAddAccount, arg);
      }
    },
    [navigation, route],
  );

  useEffect(() => {
    // load ahead of time
    prepareCurrency(currency);
  }, [currency]);

  const analyticsPropertyFlow = route.params?.analyticsPropertyFlow;

  const onHeaderCloseButton = useCallback(() => {
    track("button_clicked", {
      button: "Close 'x'",
      page: route.name,
    });
  }, [route]);

  const requestToSetHeaderOptions = useCallback(
    (request: SetHeaderOptionsRequest) => {
      if (request.type === "set") {
        navigation.setOptions({
          headerShown: true,
          headerLeft: request.options.headerLeft,
          headerRight: request.options.headerRight,
        });
      } else {
        // Sets back the header to its initial values set for this screen
        navigation.setOptions({
          ...addAccountsSelectDeviceHeaderOptions(onHeaderCloseButton),
        });
      }
    },
    [navigation, onHeaderCloseButton],
  );

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <SkipSelectDevice route={route} onResult={setDevice} />
      <Flex px={16} py={8} flex={1}>
        <SelectDevice2
          onSelect={setDevice}
          stopBleScanning={!!device || !isFocused}
          requestToSetHeaderOptions={requestToSetHeaderOptions}
        />
      </Flex>
      <DeviceActionModal
        action={action}
        device={device}
        onResult={onResult}
        onClose={onClose}
        request={{ currency }}
        onSelectDeviceLink={() => setDevice(null)}
        analyticsPropertyFlow={analyticsPropertyFlow || "add account"}
        location={HOOKS_TRACKING_LOCATIONS.receiveFlow}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    padding: 16,
  },
});
