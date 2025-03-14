import React from "react";
import styled, { DefaultTheme, StyledComponent } from "styled-components";
import Box from "~/renderer/components/Box";
import { Flex } from "@ledgerhq/react-ui";
import Text from "~/renderer/components/Text";
import ExternalLinkIcon from "~/renderer/icons/ExternalLink";
import { FlexBoxProps } from "@ledgerhq/react-ui/components/layout/Flex/index";

export const Wrapper = styled(Box).attrs({
  alignItems: "center",
})`
  padding: 20px;
  grid-gap: 12px;
`;
export const DeviceSelectorWrapper: StyledComponent<"div", DefaultTheme, FlexBoxProps> = styled(
  Flex,
).attrs({
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
})``;
export const Number = styled(Text).attrs({
  color: "palette.primary.main",
  ff: "Inter|Medium",
  fontSize: 3,
})`
  text-transform: uppercase;
  letter-spacing: 0.2em;
`;
export const Title = styled(Text).attrs({
  color: "palette.text.shade100",
  ff: "Inter|SemiBold",
  fontSize: 22,
})``;
export const Subtitle = styled(Text).attrs({
  color: "palette.text.shade80",
  ff: "Inter|Regular",
  fontSize: 14,
  textAlign: "center",
})``;
export const Content = styled(Box).attrs({
  horizontal: true,
})`
  align-items: flex-start;
  margin-top: 20px;
  grid-gap: 20px;
  width: 100%;
`;
export const Illustration = styled.div<{ image: string; height?: string | number }>`
  // prettier-ignore
  background-image: url('${p => p.image}');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  height: ${p => (p.height ? `${p.height}px` : "138px")};
  align-self: flex-start;
  grid-gap: 12px;
  flex: 1;
`;
export const BulletRowIcon = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 10,
  textAlign: "center",
  color: "wallet",
  pl: 2,
}))`
  background-color: rgba(138, 128, 219, 0.2);
  border-radius: 12px;
  display: inline-flex;
  height: 18px;
  width: 18px;
  padding: 0px;
  padding-top: 2px;
`;
const Container = styled(Box).attrs(() => ({
  cursor: "pointer",
  horizontal: true,
}))`
  align-items: center;
  color: ${p => p.theme.colors.palette.primary.main};
  display: inline-flex;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 1;
  }
`;
const ExternalLinkIconContainer = styled.span`
  display: inline-flex;
  margin-left: 4px;
`;
export const TranslatedLink = ({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick: () => void;
}) => (
  <Container onClick={onClick}>
    {children}
    <ExternalLinkIconContainer>
      <ExternalLinkIcon size={13} />
    </ExternalLinkIconContainer>
  </Container>
);
