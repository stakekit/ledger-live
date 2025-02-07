import { Button, Flex, rgba, Text } from "@ledgerhq/native-ui";
import { Theme } from "@ledgerhq/native-ui/lib/styles/theme";
import React, { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { makeSetEarnMenuModalAction } from "~/actions/earn";
import { track } from "~/analytics";
import QueuedDrawer from "~/components/QueuedDrawer";
import { earnMenuModalSelector } from "~/reducers/earn";

export function EarnMenuDrawer() {
  const dispatch = useDispatch();
  const [modalOpened, setModalOpened] = useState(false);

  const openModal = useCallback(() => setModalOpened(true), []);
  const modal = useSelector(earnMenuModalSelector);

  const closeDrawer = useCallback(async () => {
    setModalOpened(false);
    dispatch(makeSetEarnMenuModalAction(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (!modalOpened) {
      openModal();
    }
  }, [openModal, modalOpened]);

  // const { colors } = useTheme();

  return (
    <QueuedDrawer isRequestingToBeOpened={Boolean(modal)} onClose={closeDrawer}>
      <Flex rowGap={48}>
        {modal?.title ? (
          <Text variant="h4" fontFamily="Inter" textAlign="center" fontWeight="bold">
            {modal?.title}
          </Text>
        ) : null}
        <Flex rowGap={6}>
          {modal?.options.map(({ label, metadata: { link, button, ...tracked } }) =>
            link ? (
              <OptionButton
                key={label}
                onPress={() => {
                  Linking.openURL(link);
                  track(button, tracked);
                  closeDrawer();
                }}
              >
                {label}
              </OptionButton>
            ) : null,
          )}
        </Flex>
      </Flex>
    </QueuedDrawer>
  );
}

const OptionButton = styled(Button)<{
  theme: Theme;
}>`
  color: ${p => p.theme.colors.neutral.c100};
  background-color: ${p => p.theme.colors.neutral.c40};
  border-color: transparent;
  border-radius: 16px;
  display: inline-flex;
  font-weight: 600;
  justify-content: left;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:active {
    box-shadow: 0 0 0 4px ${p => rgba(p.theme.colors.primary.c50, 0.4)};
  }
  &:focus,
  &:hover {
    box-shadow: 0 0 0 2px ${p => rgba(p.theme.colors.primary.c50, 0.4)};
    background-color: ${p => p.theme.colors.neutral.c50};
  }
`;
