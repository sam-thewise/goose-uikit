import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { PancakeRoundIcon } from "../../components/Svg";
import throttle from "lodash/throttle";
import Overlay from "../../components/Overlay/Overlay";
import { Flex } from "../../components/Flex";
import { useMatchBreakpoints } from "../../hooks";
import Logo from "./Logo";
import Panel from "./Panel";
import UserBlock from "./UserBlock";
import Skeleton from "../../components/Skeleton/Skeleton";
import { NavProps } from "./types";
import Avatar from "./Avatar";
import Text from "../../components/Text/Text";
import { Link } from "../../components/Link";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background: #050e15 url('/images/dragon-background.jpg') no-repeat center center;
  background-attachment: fixed;
  background-size:cover;
`;

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  height:112px;
  background-color: rgba(97,105,182,0.45);
  backdrop-filter: blur(8px);
  z-index: 20;
  border-bottom: 2px solid #efcd52;
  transform: translate3d(0, 0, 0);
`;

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  margin-top: 112px;
  transition: margin-top 0.2s;
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;

const PriceLink = styled.a`
  margin-top: 4px;
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const InfoContainer = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  width: 20%;
`;

const InfoBoxes = styled.div`
  width: 48%;
  margin-bottom: 2%;

  .farm-stat{
    background: rgba(0,0,0,0.75);
    color: #fff;
  }

  .paladin img{
    max-width: 200px;
  }

  :nth-child(4n){
    width: 100%;
  }
`;

const Menu: React.FC<NavProps> = ({
  account,
  login,
  logout,
  isDark,
  toggleTheme,
  langs,
  setLang,
  currentLang,
  cakePriceUsd,
  links,
  priceLink,
  profile,
  paladinAuditLink,
  rugDocLink,
  totalTVL,
  circSupply,
  marketCap,
  eggPerBlock,
  children,
}) => {
  const { isXl } = useMatchBreakpoints();
  const isMobile = isXl === false;
  const [isPushed, setIsPushed] = useState(!isMobile);
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  return (
    <Wrapper>
      <StyledNav showMenu={showMenu}>
        <Logo
          isPushed={isPushed}
          togglePush={() => setIsPushed((prevState: boolean) => !prevState)}
          isDark={isDark}
          href={homeLink?.href ?? "/"}
        />
       
       <InfoContainer>
         <InfoBoxes>
          <div className="paladin">
            <Link href={paladinAuditLink} target="_blank"><img src="https://paladinsec.co/pld/assets/audited-by-paladin-standard.svg" width="200"/></Link>
          </div>
         </InfoBoxes>
       </InfoContainer>
        <InfoContainer>
          <InfoBoxes>
            {cakePriceUsd ? (
              <PriceLink href={priceLink} target="_blank">
                <PancakeRoundIcon width="24px" mr="8px" />
                <Text color="textSubtle" bold>{`$${cakePriceUsd.toFixed(3)}`}</Text>
              </PriceLink>
            ) : (
              <Skeleton width={80} height={24} />
            )}
          </InfoBoxes>
          <InfoBoxes>
            <UserBlock account={account} login={login} logout={logout} />
            {profile && <Avatar profile={profile} />}
          </InfoBoxes>
        </InfoContainer>
      </StyledNav>
      <BodyWrapper>
        <Panel
          isPushed={isPushed}
          isMobile={isMobile}
          showMenu={showMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          langs={langs}
          setLang={setLang}
          currentLang={currentLang}
          cakePriceUsd={cakePriceUsd}
          pushNav={setIsPushed}
          links={links}
          priceLink={priceLink}
        />
        <Inner isPushed={isPushed} showMenu={showMenu}>
          {children}
        </Inner>
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" />
      </BodyWrapper>
    </Wrapper>
  );
};

export default Menu;
