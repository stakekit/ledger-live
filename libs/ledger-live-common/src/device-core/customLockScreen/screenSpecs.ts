import { DeviceModelId } from "@ledgerhq/devices";
import { CLSSupportedDeviceModelId } from "../capabilities/isCustomLockScreenSupported";

type ScreenSpecs = {
  /* width of the screen in pixels */
  width: number;
  /* height of the screen in pixels */
  height: number;
  /* number of pixels at the top of the screen which are not visible */
  paddingTop: number;
  /* number of pixels at the bottom of the screen which are not visible */
  paddingBottom: number;
  /* number of pixels at the left of the screen which are not visible */
  paddingLeft: number;
  /* number of pixels at the right of the screen which are not visible */
  paddingRight: number;
};

const NO_PADDING = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
} as const;

export const SCREEN_SPECS: Record<CLSSupportedDeviceModelId, ScreenSpecs> = {
  [DeviceModelId.stax]: {
    width: 400,
    height: 672,
    ...NO_PADDING,
    paddingBottom: 2,
  },
  [DeviceModelId.europa]: {
    width: 350, // TODO: TBD
    height: 550, // TODO: TBD
    ...NO_PADDING,
  },
};

export function getScreenSpecs(deviceModelId: CLSSupportedDeviceModelId) {
  return SCREEN_SPECS[deviceModelId];
}

export function getScreenDataDimensions(deviceModelId: CLSSupportedDeviceModelId) {
  const { width, height } = SCREEN_SPECS[deviceModelId];
  return { width, height };
}

/**
 *
 * @param deviceModelId
 * @returns the dimensions of the visible area of the screen (without padding)
 */
export function getScreenVisibleAreaDimensions(deviceModelId: CLSSupportedDeviceModelId) {
  const { width, height, paddingTop, paddingBottom, paddingLeft, paddingRight } =
    SCREEN_SPECS[deviceModelId];
  return {
    width: width - paddingLeft - paddingRight,
    height: height - paddingTop - paddingBottom,
  };
}
