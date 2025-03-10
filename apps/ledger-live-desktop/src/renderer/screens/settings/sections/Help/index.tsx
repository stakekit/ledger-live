import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import ExportLogsBtn from "~/renderer/components/ExportLogsButton";
import TroubleshootNetworkBtn from "~/renderer/components/TroubleshootNetworkButton";
import OpenUserDataDirectoryBtn from "~/renderer/components/OpenUserDataDirectoryBtn";
import RowItem from "../../RowItem";
import { SettingsSectionBody as Body, SettingsSectionRow as Row } from "../../SettingsSection";
import CleanButton from "./CleanButton";
import ResetButton from "./ResetButton";
import RepairDeviceButton from "./RepairDeviceButton";
import LaunchOnboardingBtn from "./LaunchOnboardingBtn";
import { useLocalizedUrl } from "~/renderer/hooks/useLocalizedUrls";
import { urls } from "~/config/urls";
import { useFeature } from "@ledgerhq/live-common/featureFlags/index";

const SectionHelp = () => {
  const { t } = useTranslation();

  const urlFaq = useLocalizedUrl(urls.faq);
  const chatbotSupportFeature = useFeature("lldChatbotSupport");

  return (
    <>
      <TrackPage category="Settings" name="Help" />
      <Body>
        {chatbotSupportFeature?.enabled ? (
          <RowItem
            title={t("settings.help.chatbot")}
            desc={t("settings.help.faqDesc")}
            url={urls.chatbot}
          />
        ) : (
          <RowItem
            title={t("settings.help.faq")}
            desc={t("settings.help.faqDesc")}
            url={urlFaq}
            dataTestId={"ledgerSupport"}
          />
        )}
        <Row
          title={t("settings.profile.softResetTitle")}
          desc={t("settings.profile.softResetDesc")}
        >
          <CleanButton />
        </Row>
        <Row title={t("settings.exportLogs.title")} desc={t("settings.exportLogs.desc")}>
          <ExportLogsBtn />
        </Row>
        <Row
          title={t("settings.troubleshootNetwork.title")}
          desc={t("settings.troubleshootNetwork.desc")}
        >
          <TroubleshootNetworkBtn />
        </Row>
        <Row
          title={t("settings.profile.launchOnboarding")}
          desc={t("settings.profile.launchOnboardingDesc")}
        >
          <LaunchOnboardingBtn />
        </Row>
        <Row
          title={t("settings.openUserDataDirectory.title")}
          desc={t("settings.openUserDataDirectory.desc")}
        >
          <OpenUserDataDirectoryBtn primary small />
        </Row>
        <Row
          title={t("settings.repairDevice.title")}
          desc={t("settings.repairDevice.descSettings")}
        >
          <RepairDeviceButton
            buttonProps={{
              small: true,
              primary: true,
            }}
          />
        </Row>
        <Row
          title={t("settings.profile.hardResetTitle")}
          desc={t("settings.profile.hardResetDesc")}
        >
          <ResetButton />
        </Row>
      </Body>
    </>
  );
};
export default SectionHelp;
