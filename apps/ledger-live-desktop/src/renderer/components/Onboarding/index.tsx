import { DeviceModelId } from "@ledgerhq/devices";
import React, { useEffect, useState, createContext } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Flex } from "@ledgerhq/react-ui";

// screens
import { Welcome } from "~/renderer/components/Onboarding/Screens/Welcome";
import { SelectDevice } from "~/renderer/components/Onboarding/Screens/SelectDevice";
import { SelectUseCase } from "~/renderer/components/Onboarding/Screens/SelectUseCase";
import Tutorial from "~/renderer/components/Onboarding/Screens/Tutorial";
import styled from "styled-components";
import { Pedagogy } from "~/renderer/components/Onboarding/Pedagogy";
import RecoveryWarning from "~/renderer/components/Onboarding/Help/RecoveryWarning";
import { preloadAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { SideDrawer } from "../SideDrawer";
import Box from "../Box";
import { withV3StyleProvider } from "~/renderer/styles/StyleProviderV3";
import SyncOnboarding from "../SyncOnboarding";
import { OnboardingUseCase } from "./OnboardingUseCase";

const OnboardingContainer = styled(Flex).attrs({
  width: "100%",
  height: "100%",
  position: "relative",
})``;

const DURATION = 200;

const ScreenContainer = styled(Flex).attrs({
  width: "100%",
  height: "100%",
  position: "relative",
})`
  &.page-switch-appear {
    opacity: 0;
  }

  &.page-switch-appear-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease-in;
  }
`;

type NullableDeviceModelId = DeviceModelId | null;

type OnboardingContextTypes = {
  deviceModelId: NullableDeviceModelId;
  setDeviceModelId: (deviceModelId: NullableDeviceModelId) => void;
};

export const OnboardingContext = createContext<OnboardingContextTypes>({
  deviceModelId: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDeviceModelId: () => {},
});

export function Onboarding() {
  const { path } = useRouteMatch();
  const matchRecover = useRouteMatch(`${path}/${OnboardingUseCase.recover}`);
  const [imgsLoaded, setImgsLoaded] = useState(false);
  const [useCase, setUseCase] = useState<OnboardingUseCase | null>(
    matchRecover ? OnboardingUseCase.recover : null,
  );
  const [deviceModelId, setDeviceModelId] = useState<NullableDeviceModelId>(null);
  const [openedPedagogyModal, setOpenedPedagogyModal] = useState(false);
  const [openedRecoveryPhraseWarningHelp, setOpenedRecoveryPhraseWarningHelp] = useState(false);

  useEffect(() => {
    preloadAssets().then(() => setImgsLoaded(true));
  }, []);

  return (
    <OnboardingContext.Provider value={{ deviceModelId, setDeviceModelId }}>
      <Pedagogy
        isOpen={openedPedagogyModal}
        onClose={() => {
          setOpenedPedagogyModal(false);
        }}
        onDone={() => {
          setOpenedPedagogyModal(false);
        }}
      />
      <SideDrawer
        isOpen={openedRecoveryPhraseWarningHelp}
        onRequestClose={() => {
          setOpenedRecoveryPhraseWarningHelp(false);
        }}
        direction={"left"}
      >
        <Box px={40}>
          <RecoveryWarning />
        </Box>
      </SideDrawer>
      <OnboardingContainer className={imgsLoaded ? "onboarding-imgs-loaded" : ""}>
        <CSSTransition in appear key={path} timeout={DURATION} classNames="page-switch">
          <ScreenContainer>
            <Switch>
              <Route exact path={path} component={Welcome} />
              <Route path={`${path}/welcome`} component={Welcome} />
              <Route path={`${path}/select-device`} component={SelectDevice} />
              <Route path={`${path}/sync`} component={SyncOnboarding} />
              <Route
                path={`${path}/select-use-case`}
                render={props => (
                  <SelectUseCase
                    {...props}
                    setOpenedPedagogyModal={setOpenedPedagogyModal}
                    setUseCase={setUseCase}
                  />
                )}
              />
              <Route
                path={[
                  `${path}/${OnboardingUseCase.setupDevice}`,
                  `${path}/${OnboardingUseCase.connectDevice}`,
                  `${path}/${OnboardingUseCase.recoveryPhrase}`,
                  `${path}/${OnboardingUseCase.recover}`,
                ]}
                render={props =>
                  useCase ? (
                    <Tutorial {...props} useCase={useCase} />
                  ) : (
                    /**
                     * In case we navigate to another screen then do a
                     * history.goBack() we lose the state here so we fallback to
                     * displaying the stateless device selection screen
                     * One case for that is when we navigate to the USB
                     * troubleshoot screen.
                     */
                    <SelectDevice />
                  )
                }
              />
            </Switch>
          </ScreenContainer>
        </CSSTransition>
      </OnboardingContainer>
    </OnboardingContext.Provider>
  );
}

export default withV3StyleProvider(Onboarding);
