import { LiveAppManifest } from "@ledgerhq/live-common/platform/types";
import { getEnv } from "@ledgerhq/live-env";
import { Flex } from "@ledgerhq/native-ui";
import React from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components/native";
import { Web3AppWebview } from "~/components/Web3AppWebview";
import { WebviewState } from "~/components/Web3AppWebview/types";
import { getCountryLocale } from "~/helpers/getStakeLabelLocaleBased";
import { useSettings } from "~/hooks";
import {
  counterValueCurrencySelector,
  discreetModeSelector,
  exportSettingsSelector,
} from "~/reducers/settings";
import { useSwapLiveAppCustomHandlers } from "./hooks/useSwapLiveAppCustomHandlers";

type Props = {
  manifest: LiveAppManifest;
  setWebviewState: React.Dispatch<React.SetStateAction<WebviewState>>;
};

const SWAP_API_BASE = getEnv("SWAP_API_BASE");
const SWAP_USER_IP = getEnv("SWAP_USER_IP");

export function WebView({ manifest, setWebviewState }: Props) {
  const customHandlers = useSwapLiveAppCustomHandlers(manifest);
  const { theme } = useTheme();
  const { language } = useSettings();
  const { ticker: currencyTicker } = useSelector(counterValueCurrencySelector);
  const discreet = useSelector(discreetModeSelector);
  const countryLocale = getCountryLocale();
  const exportSettings = useSelector(exportSettingsSelector);

  return (
    <Flex pb={1} flex={1}>
      <Web3AppWebview
        manifest={manifest}
        customHandlers={customHandlers}
        onStateChange={setWebviewState}
        inputs={{
          swapApiBase: SWAP_API_BASE,
          swapUserIp: SWAP_USER_IP,
          devMode: exportSettings.developerModeEnabled ? "true" : "false",
          theme,
          lang: language,
          locale: language, // LLM doesn't support different locales. By doing this we don't have to have specific LLM/LLD logic in earn, and in future if LLM supports locales we will change this from `language` to `locale`
          countryLocale,
          currencyTicker,
          discreetMode: discreet ? "true" : "false",
          OS: Platform.OS,
        }}
      />
    </Flex>
  );
}
