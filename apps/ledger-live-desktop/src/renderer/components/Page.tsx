import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { DefaultTheme, ThemedStyledProps } from "styled-components";
import AngleUp from "~/renderer/icons/AngleUp";
import TopBar from "~/renderer/components/TopBar";
import ActionContentCards from "~/renderer/screens/dashboard/ActionContentCards";
import { ABTestingVariants } from "@ledgerhq/types-live";

type Props = {
  children: React.ReactNode;
};
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;

export const getPagePaddingLeft = (p: ThemedStyledProps<unknown, DefaultTheme>) => p.theme.space[6];

export const getPagePaddingRight = (p: ThemedStyledProps<unknown, DefaultTheme>) =>
  p.theme.space[6] - p.theme.overflow.trackSize;

const PageScroller = styled.div`
  padding: ${p => p.theme.space[3]}px ${p => getPagePaddingLeft(p)}px;
  padding-right: ${p => getPagePaddingRight(p)}px;
  ${p => p.theme.overflow.y};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PageScrollerContainer = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PageScrollTopSeparator = styled.div.attrs<{
  isAtUpperBound: boolean;
}>(p => ({
  style: {
    opacity: p.isAtUpperBound ? 0 : 1,
  },
}))<{
  isAtUpperBound: boolean;
}>`
  position: absolute;
  pointer-events: none;
  left: 0;
  right: 0;
  height: 12px;
  box-sizing: border-box;
  z-index: 20;
  transition: opacity 250ms ease-in-out;
  background: linear-gradient(${p => p.theme.colors.palette.background.default}, rgba(0, 0, 0, 0));
  &:after {
    content: "";
    width: 100%;
    height: 1px;
    display: block;
    background-color: ${p => p.theme.colors.palette.text.shade10};
  }
`;

const PageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  height: 100%;
`;

const ScrollUpButton = styled.div.attrs<{
  isVisible: boolean;
}>(p => ({
  style: {
    opacity: p.isVisible ? 1 : 0,
    pointerEvents: p.isVisible ? "initial" : "none",
  },
}))<{
  isVisible: boolean;
}>`
  position: absolute;
  z-index: 10;
  bottom: 100px;
  right: 20px;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(102, 102, 102, 0.25);
  cursor: pointer;
  height: 36px;
  width: 36px;
  color: ${p => p.theme.colors.palette.primary.contrastText};
  background-color: ${p => p.theme.colors.palette.primary.main};
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Page = ({ children }: Props) => {
  const pageScrollerRef = useRef<HTMLDivElement>(null);
  const [isScrollUpButtonVisible, setScrollUpButtonVisibility] = useState(false);
  const [isScrollAtUpperBound, setScrollAtUpperBound] = useState(true);
  const { pathname } = useLocation();
  const scrolltoTop = useCallback((smooth = true) => {
    if (pageScrollerRef.current) {
      pageScrollerRef.current.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : undefined,
      });
    }
  }, []);

  const onClickScrollUp = useCallback(() => scrolltoTop(), [scrolltoTop]);

  useLayoutEffect(() => {
    scrolltoTop(false);
  }, [pathname, scrolltoTop]);

  useLayoutEffect(() => {
    const pageContentElement = pageScrollerRef.current;
    const listener = () => {
      if (pageContentElement) {
        setScrollAtUpperBound(pageContentElement.scrollTop === 0);
        setScrollUpButtonVisibility(pageContentElement.scrollTop > 800);
      }
    };
    if (pageContentElement) {
      pageContentElement.addEventListener("scroll", listener, true);
    }
    return () => {
      if (pageContentElement) {
        pageContentElement.removeEventListener("scroll", listener);
      }
    };
  }, []);
  return (
    <PageContainer>
      <TopBar />
      <PageScrollerContainer id="scroll-area">
        <PageScrollTopSeparator isAtUpperBound={isScrollAtUpperBound} />
        <PageScroller id="page-scroller" ref={pageScrollerRef}>
          <PageContentContainer>{children}</PageContentContainer>
        </PageScroller>
      </PageScrollerContainer>
      <ScrollUpButton
        id={"scrollUpButton"}
        isVisible={isScrollUpButtonVisible}
        onClick={onClickScrollUp}
      >
        <AngleUp size={20} />
      </ScrollUpButton>
      {/* Only on dashboard page */}
      {pathname === "/" && <ActionContentCards variant={ABTestingVariants.variantB} />}
    </PageContainer>
  );
};
export default Page;
