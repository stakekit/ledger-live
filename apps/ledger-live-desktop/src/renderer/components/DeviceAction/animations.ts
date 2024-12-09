/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
import { DeviceModelId } from "@ledgerhq/types-devices";
import { Theme } from "@ledgerhq/react-ui";

// NANO S
// @ts-ignore
import NANO_S_LIGHT_plugAndPinCode from "~/renderer/animations/nanoS/1PlugAndPinCode/light.json";
// @ts-ignore
import NANO_S_DARK_plugAndPinCode from "~/renderer/animations/nanoS/1PlugAndPinCode/dark.json";
// @ts-ignore
import NANO_S_LIGHT_enterPinCode from "~/renderer/animations/nanoS/3EnterPinCode/light.json";
// @ts-ignore
import NANO_S_DARK_enterPinCode from "~/renderer/animations/nanoS/3EnterPinCode/dark.json";
// @ts-ignore
import NANO_S_LIGHT_quitApp from "~/renderer/animations/nanoS/4QuitApp/light.json";
// @ts-ignore
import NANO_S_DARK_quitApp from "~/renderer/animations/nanoS/4QuitApp/dark.json";
// @ts-ignore
import NANO_S_LIGHT_openApp from "~/renderer/animations/nanoS/6OpenApp/light.json";
// @ts-ignore
import NANO_S_DARK_openApp from "~/renderer/animations/nanoS/6OpenApp/dark.json";
// @ts-ignore
import NANO_S_LIGHT_validate from "~/renderer/animations/nanoS/7Validate/light.json";
// @ts-ignore
import NANO_S_DARK_validate from "~/renderer/animations/nanoS/7Validate/dark.json";
// @ts-ignore
import NANO_S_LIGHT_firmwareUpdating from "~/renderer/animations/nanoS/2FirmwareUpdating/light.json";
// @ts-ignore
import NANO_S_DARK_firmwareUpdating from "~/renderer/animations/nanoS/2FirmwareUpdating/dark.json";
// @ts-ignore
import NANO_S_LIGHT_installLoading from "~/renderer/animations/nanoS/8InstallLoading/light.json";
// @ts-ignore
import NANO_S_DARK_installLoading from "~/renderer/animations/nanoS/8InstallLoading/dark.json";

// NANO X
// @ts-ignore
import NANO_X_LIGHT_plugAndPinCode from "~/renderer/animations/nanoX/1PlugAndPinCode/light.json";
// @ts-ignore
import NANO_X_DARK_plugAndPinCode from "~/renderer/animations/nanoX/1PlugAndPinCode/dark.json";
// @ts-ignore
import NANO_X_LIGHT_enterPinCode from "~/renderer/animations/nanoX/3EnterPinCode/light.json";
// @ts-ignore
import NANO_X_DARK_enterPinCode from "~/renderer/animations/nanoX/3EnterPinCode/dark.json";
// @ts-ignore
import NANO_X_LIGHT_quitApp from "~/renderer/animations/nanoX/4QuitApp/light.json";
// @ts-ignore
import NANO_X_DARK_quitApp from "~/renderer/animations/nanoX/4QuitApp/dark.json";
// @ts-ignore
import NANO_X_LIGHT_openApp from "~/renderer/animations/nanoX/6OpenApp/light.json";
// @ts-ignore
import NANO_X_DARK_openApp from "~/renderer/animations/nanoX/6OpenApp/dark.json";
// @ts-ignore
import NANO_X_LIGHT_validate from "~/renderer/animations/nanoX/7Validate/light.json";
// @ts-ignore
import NANO_X_DARK_validate from "~/renderer/animations/nanoX/7Validate/dark.json";
// @ts-ignore
import NANO_X_LIGHT_firmwareUpdating from "~/renderer/animations/nanoX/2FirmwareUpdating/light.json";
// @ts-ignore
import NANO_X_DARK_firmwareUpdating from "~/renderer/animations/nanoX/2FirmwareUpdating/dark.json";
// @ts-ignore
import NANO_X_LIGHT_installLoading from "~/renderer/animations/nanoX/8InstallLoading/light.json";
// @ts-ignore
import NANO_X_DARK_installLoading from "~/renderer/animations/nanoX/8InstallLoading/dark.json";
// @ts-ignore
import NANO_X_LIGHT_recoverWithProtect from "~/renderer/animations/nanoX/RecoverWithProtect/light.json";
// @ts-ignore
import NANO_X_DARK_recoverWithProtect from "~/renderer/animations/nanoX/RecoverWithProtect/dark.json";
// NANO SP
// @ts-ignore
import NANO_SP_LIGHT_plugAndPinCode from "~/renderer/animations/nanoSP/1PlugAndPinCode/light.json";
// @ts-ignore
import NANO_SP_DARK_plugAndPinCode from "~/renderer/animations/nanoSP/1PlugAndPinCode/dark.json";
// @ts-ignore
import NANO_SP_LIGHT_enterPinCode from "~/renderer/animations/nanoSP/3EnterPinCode/light.json";
// @ts-ignore
import NANO_SP_DARK_enterPinCode from "~/renderer/animations/nanoSP/3EnterPinCode/dark.json";
// @ts-ignore
import NANO_SP_LIGHT_quitApp from "~/renderer/animations/nanoSP/4QuitApp/light.json";
// @ts-ignore
import NANO_SP_DARK_quitApp from "~/renderer/animations/nanoSP/4QuitApp/dark.json";
// @ts-ignore
import NANO_SP_LIGHT_openApp from "~/renderer/animations/nanoSP/6OpenApp/light.json";
// @ts-ignore
import NANO_SP_DARK_openApp from "~/renderer/animations/nanoSP/6OpenApp/dark.json";
// @ts-ignore
import NANO_SP_LIGHT_validate from "~/renderer/animations/nanoSP/7Validate/light.json";
// @ts-ignore
import NANO_SP_DARK_validate from "~/renderer/animations/nanoSP/7Validate/dark.json";
// @ts-ignore
import NANO_SP_LIGHT_firmwareUpdating from "~/renderer/animations/nanoSP/2FirmwareUpdating/light.json";
// @ts-ignore
import NANO_SP_DARK_firmwareUpdating from "~/renderer/animations/nanoSP/2FirmwareUpdating/dark.json";
// @ts-ignore
import NANO_SP_LIGHT_installLoading from "~/renderer/animations/nanoSP/8InstallLoading/light.json";
// @ts-ignore
import NANO_SP_DARK_installLoading from "~/renderer/animations/nanoSP/8InstallLoading/dark.json";

// NANO BLUE

// @ts-ignore
import BLUE_LIGHT_plugAndPinCode from "~/renderer/animations/blue/1PlugAndPinCode/data.json";
// @ts-ignore
import BLUE_LIGHT_enterPinCode from "~/renderer/animations/blue/3EnterPinCode/data.json";
// @ts-ignore
import BLUE_LIGHT_quitApp from "~/renderer/animations/blue/4QuitApp/data.json";
// @ts-ignore
import BLUE_LIGHT_allowManager from "~/renderer/animations/blue/5AllowManager/data.json";
// @ts-ignore
import BLUE_LIGHT_openApp from "~/renderer/animations/blue/6OpenApp/data.json";
// @ts-ignore
import BLUE_LIGHT_validate from "~/renderer/animations/blue/7Validate/data.json";

// @ts-ignore
import STAX_confirmLockscreen from "~/renderer/animations/stax/confirmLockscreen.json";
// @ts-ignore
import STAX_USB_connection_success from "~/renderer/animations/stax/USBConnectionSuccess.json";

// @ts-ignore
import STAX_DARK_PAIRED from "~/renderer/animations/nanoX/dark/paired.json";
// @ts-ignore
import STAX_LIGHT_PAIRED from "~/renderer/animations/nanoX/light/paired.json";
// @ts-ignore
import STAX_DARK_PAIRING from "~/renderer/animations/nanoX/dark/pairing.json";
// @ts-ignore
import STAX_LIGHT_PAIRING from "~/renderer/animations/nanoX/light/pairing.json";

// @ts-ignore
import STAX_DARK_PIN from "~/renderer/animations/nanoSP/dark/pin.json";
// @ts-ignore
import STAX_LIGHT_PIN from "~/renderer/animations/nanoSP/light/pin.json";
// @ts-ignore
import STAX_DARK_CONTINUE from "~/renderer/animations/nanoSP/dark/continue.json";
// @ts-ignore
import STAX_LIGHT_CONTINUE from "~/renderer/animations/nanoSP/light/continue.json";

/** FLEX LOTTIES */
// @ts-ignore
import EUROPA_LIGHT_enterPin from "~/renderer/animations/europa/light/enterPIN.json";
// @ts-ignore
import EUROPA_LIGHT_signTransaction from "~/renderer/animations/europa/light/signTransaction.json";
// @ts-ignore
import EUROPA_LIGHT_allowConnection from "~/renderer/animations/europa/light/allowConnection.json";
// @ts-ignore
import EUROPA_LIGHT_confirmLockscreen from "~/renderer/animations/europa/light/confirmLockscreen.json";
// @ts-ignore
import EUROPA_LIGHT_USB_connection_success from "~/renderer/animations/europa/light/connectionSuccess.json";
// @ts-ignore
import EUROPA_LIGHT_onboarding_success from "~/renderer/animations/europa/light/onboardingSuccess.json";

// @ts-ignore
import EUROPA_DARK_enterPin from "~/renderer/animations/europa/dark/enterPIN.json";
// @ts-ignore
import EUROPA_DARK_signTransaction from "~/renderer/animations/europa/dark/signTransaction.json";
// @ts-ignore
import EUROPA_DARK_allowConnection from "~/renderer/animations/europa/dark/allowConnection.json";
// @ts-ignore
import EUROPA_DARK_confirmLockscreen from "~/renderer/animations/europa/dark/confirmLockscreen.json";
// @ts-ignore
import EUROPA_DARK_USB_connection_success from "~/renderer/animations/europa/dark/connectionSuccess.json";
// @ts-ignore
import EUROPA_DARK_onboarding_success from "~/renderer/animations/europa/dark/onboardingSuccess.json";

/** NEW ASSETS START @13.12.2024 */

// // @ts-ignore
// import STAX_DARK_PIN from "~/renderer/animations/stax/dark/pin.json";
// // @ts-ignore
// import STAX_DARK_PAIRING from "~/renderer/animations/stax/dark/pairing.json";
// // @ts-ignore
// import STAX_DARK_PAIRED from "~/renderer/animations/stax/dark/paired.json";
// // @ts-ignore
// import STAX_DARK_CONTINUE from "~/renderer/animations/stax/dark/continue.json";
// // @ts-ignore
// import STAX_LIGHT_PIN from "~/renderer/animations/stax/light/pin.json";
// // @ts-ignore
// import STAX_LIGHT_PAIRING from "~/renderer/animations/stax/light/pairing.json";
// // @ts-ignore
// import STAX_LIGHT_PAIRED from "~/renderer/animations/stax/light/paired.json";
// // @ts-ignore
// import STAX_LIGHT_CONTINUE from "~/renderer/animations/stax/light/continue.json";

// // @ts-ignore
// import FLEX_DARK_PIN from "~/renderer/animations/flex/dark/pin.json";
// // @ts-ignore
// import FLEX_DARK_PAIRING from "~/renderer/animations/flex/dark/pairing.json";
// // @ts-ignore
// import FLEX_DARK_PAIRED from "~/renderer/animations/flex/dark/paired.json";
// // @ts-ignore
// import FLEX_DARK_CONTINUE from "~/renderer/animations/flex/dark/continue.json";
// // @ts-ignore
// import FLEX_LIGHT_PIN from "~/renderer/animations/flex/light/pin.json";
// // @ts-ignore
// import FLEX_LIGHT_PAIRING from "~/renderer/animations/flex/light/pairing.json";
// // @ts-ignore
// import FLEX_LIGHT_PAIRED from "~/renderer/animations/flex/light/paired.json";
// // @ts-ignore
// import FLEX_LIGHT_CONTINUE from "~/renderer/animations/flex/light/continue.json";

// // @ts-ignore
// import NANOX_DARK_PIN from "~/renderer/animations/nanoX/dark/pin.json";
// // @ts-ignore
// import NANOX_DARK_PAIRING from "~/renderer/animations/nanoX/dark/pairing.json";
// // @ts-ignore
// import NANOX_DARK_PAIRED from "~/renderer/animations/nanoX/dark/paired.json";
// // @ts-ignore
// import NANOX_DARK_CONTINUE from "~/renderer/animations/nanoX/dark/continue.json";
// // @ts-ignore
// import NANOX_LIGHT_PIN from "~/renderer/animations/nanoX/light/pin.json";
// // @ts-ignore
// import NANOX_LIGHT_PAIRING from "~/renderer/animations/nanoX/light/pairing.json";
// // @ts-ignore
// import NANOX_LIGHT_PAIRED from "~/renderer/animations/nanoX/light/paired.json";
// // @ts-ignore
// import NANOX_LIGHT_CONTINUE from "~/renderer/animations/nanoX/light/continue.json";

// // @ts-ignore
// import NANOSP_DARK_PIN from "~/renderer/animations/nanoSP/dark/pin.json";
// // @ts-ignore
// import NANOSP_DARK_CONTINUE from "~/renderer/animations/nanoSP/dark/continue.json";
// // @ts-ignore
// import NANOSP_LIGHT_PIN from "~/renderer/animations/nanoSP/light/pin.json";
// // @ts-ignore
// import NANOSP_LIGHT_CONTINUE from "~/renderer/animations/nanoSP/light/continue.json";

/** NEW ASSETS END @13.12.2024 */

/* eslint-enable camelcase */
type ThemedAnimation = Record<Theme["theme"], Record<string, unknown>>;
export type AnimationKey =
  | "plugAndPinCode"
  | "enterPinCode"
  | "quitApp"
  | "allowManager"
  | "openApp"
  | "verify"
  | "sign"
  | "firmwareUpdating"
  | "installLoading"
  | "confirmLockscreen"
  | "recoverWithProtect"
  | "connectionSuccess";

type DeviceAnimations<Key extends string = string> = { [key in Key]: ThemedAnimation };

const nanoS: DeviceAnimations = {
  plugAndPinCode: {
    light: NANO_S_LIGHT_plugAndPinCode,
    dark: NANO_S_DARK_plugAndPinCode,
  },
  enterPinCode: {
    light: NANO_S_LIGHT_enterPinCode,
    dark: NANO_S_DARK_enterPinCode,
  },
  quitApp: {
    light: NANO_S_LIGHT_quitApp,
    dark: NANO_S_DARK_quitApp,
  },
  allowManager: {
    light: NANO_S_LIGHT_validate,
    dark: NANO_S_DARK_validate,
  },
  openApp: {
    light: NANO_S_LIGHT_openApp,
    dark: NANO_S_DARK_openApp,
  },
  verify: {
    light: NANO_S_LIGHT_validate,
    dark: NANO_S_DARK_validate,
  },
  sign: {
    light: NANO_S_LIGHT_validate,
    dark: NANO_S_DARK_validate,
  },
  firmwareUpdating: {
    light: NANO_S_LIGHT_firmwareUpdating,
    dark: NANO_S_DARK_firmwareUpdating,
  },
  installLoading: {
    light: NANO_S_LIGHT_installLoading,
    dark: NANO_S_DARK_installLoading,
  },
  confirmLockscreen: {
    light: STAX_confirmLockscreen,
    dark: STAX_confirmLockscreen,
  },
  recoverWithProtect: {
    light: NANO_X_LIGHT_recoverWithProtect,
    dark: NANO_X_DARK_recoverWithProtect,
  },
  connectionSuccess: {
    light: STAX_USB_connection_success,
    dark: STAX_USB_connection_success,
  },
};

const nanoX: DeviceAnimations = {
  plugAndPinCode: {
    light: NANO_X_LIGHT_plugAndPinCode,
    dark: NANO_X_DARK_plugAndPinCode,
  },
  enterPinCode: {
    light: NANO_X_LIGHT_enterPinCode,
    dark: NANO_X_DARK_enterPinCode,
  },
  quitApp: {
    light: NANO_X_LIGHT_quitApp,
    dark: NANO_X_DARK_quitApp,
  },
  allowManager: {
    light: NANO_X_LIGHT_validate,
    dark: NANO_X_DARK_validate,
  },
  openApp: {
    light: NANO_X_LIGHT_openApp,
    dark: NANO_X_DARK_openApp,
  },
  verify: {
    light: NANO_X_LIGHT_validate,
    dark: NANO_X_DARK_validate,
  },
  sign: {
    light: NANO_X_LIGHT_validate,
    dark: NANO_X_DARK_validate,
  },
  firmwareUpdating: {
    light: NANO_X_LIGHT_firmwareUpdating,
    dark: NANO_X_DARK_firmwareUpdating,
  },
  installLoading: {
    light: NANO_X_LIGHT_installLoading,
    dark: NANO_X_DARK_installLoading,
  },
  confirmLockscreen: {
    light: STAX_confirmLockscreen,
    dark: STAX_confirmLockscreen,
  },
  recoverWithProtect: {
    light: NANO_X_LIGHT_recoverWithProtect,
    dark: NANO_X_DARK_recoverWithProtect,
  },
  connectionSuccess: {
    light: STAX_USB_connection_success,
    dark: STAX_USB_connection_success,
  },
};

const nanoSP: DeviceAnimations = {
  plugAndPinCode: {
    light: NANO_SP_LIGHT_plugAndPinCode,
    dark: NANO_SP_DARK_plugAndPinCode,
  },
  enterPinCode: {
    light: NANO_SP_LIGHT_enterPinCode,
    dark: NANO_SP_DARK_enterPinCode,
  },
  quitApp: {
    light: NANO_SP_LIGHT_quitApp,
    dark: NANO_SP_DARK_quitApp,
  },
  allowManager: {
    light: NANO_SP_LIGHT_validate,
    dark: NANO_SP_DARK_validate,
  },
  openApp: {
    light: NANO_SP_LIGHT_openApp,
    dark: NANO_SP_DARK_openApp,
  },
  verify: {
    light: NANO_SP_LIGHT_validate,
    dark: NANO_SP_DARK_validate,
  },
  sign: {
    light: NANO_SP_LIGHT_validate,
    dark: NANO_SP_DARK_validate,
  },
  firmwareUpdating: {
    light: NANO_SP_LIGHT_firmwareUpdating,
    dark: NANO_SP_DARK_firmwareUpdating,
  },
  installLoading: {
    light: NANO_SP_LIGHT_installLoading,
    dark: NANO_SP_DARK_installLoading,
  },
  confirmLockscreen: {
    light: STAX_confirmLockscreen,
    dark: STAX_confirmLockscreen,
  },
  recoverWithProtect: {
    light: NANO_X_LIGHT_recoverWithProtect,
    dark: NANO_X_DARK_recoverWithProtect,
  },
  connectionSuccess: {
    light: STAX_USB_connection_success,
    dark: STAX_USB_connection_success,
  },
};

const stax: DeviceAnimations = {
  plugAndPinCode: {
    light: STAX_LIGHT_PIN,
    dark: STAX_DARK_PIN,
  },
  enterPinCode: {
    light: STAX_LIGHT_PIN,
    dark: STAX_DARK_PIN,
  },
  quitApp: {
    light: STAX_LIGHT_CONTINUE,
    dark: STAX_DARK_CONTINUE,
  },
  allowManager: {
    light: STAX_LIGHT_CONTINUE,
    dark: STAX_DARK_CONTINUE,
  },
  openApp: {
    light: STAX_LIGHT_CONTINUE,
    dark: STAX_DARK_CONTINUE,
  },
  // For testing purposes
  verify: {
    light: STAX_LIGHT_PAIRING,
    dark: STAX_DARK_PAIRING,
  },
  // For testing purposes
  sign: {
    light: STAX_LIGHT_PAIRED,
    dark: STAX_DARK_PAIRED,
  },
  firmwareUpdating: {
    light: STAX_LIGHT_CONTINUE,
    dark: STAX_DARK_PIN,
  },
  installLoading: {
    light: STAX_LIGHT_CONTINUE,
    dark: STAX_DARK_CONTINUE,
  },
  confirmLockscreen: {
    light: STAX_LIGHT_CONTINUE,
    dark: STAX_DARK_CONTINUE,
  },
  recoverWithProtect: {
    light: STAX_LIGHT_CONTINUE,
    dark: STAX_DARK_CONTINUE,
  },
  connectionSuccess: {
    light: STAX_LIGHT_PAIRED,
    dark: STAX_DARK_PAIRED,
  },
};

const europa: DeviceAnimations<AnimationKey | "onboardingSuccess"> = {
  plugAndPinCode: {
    light: EUROPA_LIGHT_enterPin,
    dark: EUROPA_DARK_enterPin,
  },
  enterPinCode: {
    light: EUROPA_LIGHT_enterPin,
    dark: EUROPA_DARK_enterPin,
  },
  quitApp: {
    light: EUROPA_LIGHT_allowConnection,
    dark: EUROPA_DARK_allowConnection,
  },
  allowManager: {
    light: EUROPA_LIGHT_allowConnection,
    dark: EUROPA_DARK_allowConnection,
  },
  openApp: {
    light: EUROPA_LIGHT_allowConnection,
    dark: EUROPA_DARK_allowConnection,
  },
  verify: {
    light: EUROPA_LIGHT_allowConnection,
    dark: EUROPA_DARK_allowConnection,
  },
  sign: {
    light: EUROPA_LIGHT_signTransaction,
    dark: EUROPA_DARK_signTransaction,
  },
  firmwareUpdating: {
    light: EUROPA_LIGHT_enterPin,
    dark: EUROPA_DARK_enterPin,
  },
  installLoading: {
    light: EUROPA_LIGHT_allowConnection,
    dark: EUROPA_DARK_allowConnection,
  },
  confirmLockscreen: {
    light: EUROPA_LIGHT_confirmLockscreen,
    dark: EUROPA_DARK_confirmLockscreen,
  },
  recoverWithProtect: {
    light: NANO_X_LIGHT_recoverWithProtect,
    dark: NANO_X_DARK_recoverWithProtect,
  },
  connectionSuccess: {
    light: EUROPA_LIGHT_USB_connection_success,
    dark: EUROPA_DARK_USB_connection_success,
  },
  onboardingSuccess: {
    light: EUROPA_LIGHT_onboarding_success,
    dark: EUROPA_DARK_onboarding_success,
  },
};

const blue: DeviceAnimations = {
  plugAndPinCode: {
    light: BLUE_LIGHT_plugAndPinCode,
    dark: BLUE_LIGHT_plugAndPinCode,
  },
  enterPinCode: {
    light: BLUE_LIGHT_enterPinCode,
    dark: BLUE_LIGHT_enterPinCode,
  },
  quitApp: {
    light: BLUE_LIGHT_quitApp,
    dark: BLUE_LIGHT_quitApp,
  },
  allowManager: {
    light: BLUE_LIGHT_allowManager,
    dark: BLUE_LIGHT_allowManager,
  },
  openApp: {
    light: BLUE_LIGHT_openApp,
    dark: BLUE_LIGHT_openApp,
  },
  verify: {
    light: BLUE_LIGHT_validate,
    dark: BLUE_LIGHT_validate,
  },
  sign: {
    light: BLUE_LIGHT_validate,
    dark: BLUE_LIGHT_validate,
  },
  // Nb We are dropping the assets for blue soon, this is temp
  firmwareUpdating: {
    light: NANO_S_LIGHT_firmwareUpdating,
    dark: NANO_S_DARK_firmwareUpdating,
  },
  installLoading: {
    light: NANO_S_LIGHT_installLoading,
    dark: NANO_S_DARK_installLoading,
  },
  confirmLockscreen: {
    light: STAX_confirmLockscreen,
    dark: STAX_confirmLockscreen,
  },
  recoverWithProtect: {
    light: NANO_X_LIGHT_recoverWithProtect,
    dark: NANO_X_DARK_recoverWithProtect,
  },
  connectionSuccess: {
    light: STAX_USB_connection_success,
    dark: STAX_USB_connection_success,
  },
};

const animations = { nanoX, nanoS, nanoSP, stax, europa, blue };

export const getDeviceAnimation = (
  modelId: DeviceModelId,
  theme: Theme["theme"],
  key: AnimationKey | "onboardingSuccess",
) => {
  const animationModelId = (process.env.OVERRIDE_MODEL_ID as DeviceModelId) || modelId;

  // Handles the case where OVERRIDE_MODEL_ID is incorrect
  const animationModel = animations[animationModelId] || animations.nanoX;
  const animationKey: ThemedAnimation | undefined =
    animationModel[animationModelId === "europa" ? key : (key as AnimationKey)];

  if (!animationKey) {
    return null;
  }

  return animationKey[theme];
};
