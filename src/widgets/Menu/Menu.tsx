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
  overflow: hidden;
`;

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
  overflow: overlay;
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


const DLInfoContainer = styled.div`
  display: contents;

  .badges {
    display: contents;
  }
  
  @media (max-width: 420px) {
    .badges {
      display : block;
  }
}
`;

const InfoContainer = styled.div`
  justify-content: space-between;
`;


const InfoBoxes = styled.div`
  .farm-stat{
    background: rgba(0,0,0,0.75);
    color: #fff;
  }

  .navImg{
    max-width: 70%
  }

`;


const MenuWrapper = styled.div`
  position: fixed;
  background: #000000e8;
  padding: 0;
  border-radius: 5px;
  text-align: center;
  backdrop-filter: blur(3px);
  display: grid;
  grid-template-columns: repeat(5,1fr);
  width: 100%;
  bottom: 0;
  z-index: 999;
  align-items: center;
  justify-items: center;
`

const StyledLinkTag = styled.a`
    display: grid;
    text-align: center;
    padding: 1px;
    color: #fff;
    font-size: 20px;
    height: auto;
    margin: 0 9px 0 0;
    width: 100%;
    justify-items: left;
    text-align: center;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
    padding: 10px;
    transition: all 200ms linear;
`

const MenuIconDiv = styled.div`
  text-align: left;
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  width: 50%;

  @media (max-width: 820px) {
    .menu-text {
      display : none;
      margin-left: 10%;
  }

  @media (max-width: 540px) {
    .menu-icons {
      display : contents;
    }
  }
`

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
        <DLInfoContainer>
          <InfoBoxes>
              <Link href="/" target="_blank"><img className="navImg" src='/images/egg/LogoTextNewWhite.png' alt="The Dragon's Lair"/></Link>
          </InfoBoxes>
          
          <div className="badges">
              <InfoBoxes>
                  <Link href="https://rugdoc.io/project/the-dragons-lair/" target="_blank"><img className="navImg" src="/images/badge/rugdoc-kyc.png" alt="rugdoc audit/kyc"/></Link>
              </InfoBoxes>
              <InfoBoxes>
                  <Link href={paladinAuditLink} target="_blank"><img className="navImg" src="https://paladinsec.co/pld/assets/audited-by-paladin-standard.svg" alt="paladin audit"/></Link>
              </InfoBoxes>
          </div>
            
       </DLInfoContainer>
        <InfoContainer>
          <InfoBoxes>
            {cakePriceUsd ? (
              <PriceLink href={priceLink} target="_blank">
                <PancakeRoundIcon width="42px" mr="8px" />
                <Text color="textSubtle" fontSize="21px">{`$${cakePriceUsd.toFixed(3)}`}</Text>
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
      <MenuWrapper>
          <StyledLinkTag href="https://t.me/thedragonslairfarm" target="_blank">
            <MenuIconDiv className="menu-icons">
                <img alt="telegram" src="https://image.flaticon.com/icons/png/512/124/124019.png"/> <span className="menu-text">TELEGRAM</span>
            </MenuIconDiv>
          </StyledLinkTag>
          <StyledLinkTag href="https://twitter.com/DRGNCRYPTOGAMIN" target="_blank">
            <MenuIconDiv className="menu-icons">
                <img alt="twitter" src="https://seeklogo.com/images/T/twitter-icon-square-logo-108D17D373-seeklogo.com.png"/> <span className="menu-text">TWITTER</span>
            </MenuIconDiv>
          </StyledLinkTag>
          <StyledLinkTag href="https://docs.thedragonslair.farm/" target="_blank">
            <MenuIconDiv className="menu-icons">
              <img alt="docs" src="https://cdn2.iconfinder.com/data/icons/metro-ui-dock/512/Doc_-_Google_Docs.png"/> <span className="menu-text">DOCS</span>
            </MenuIconDiv>
          </StyledLinkTag>
          <StyledLinkTag href="https://chartex.pro/?symbol=AVAX_TRADERJOE%3ADREGG%2FUSDTe.0xB52a2b91Bf89BcB9435ad94D23555EaD26954CA9" target="_blank">
            <MenuIconDiv className="menu-icons">
              <img alt="charts" src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/chart_candlestick.png"/><span className="menu-text">CHART</span>
            </MenuIconDiv>
          </StyledLinkTag>
          <StyledLinkTag href="https://www.traderjoexyz.com/#/trade?outputCurrency=0x88c090496125b751B4E3ce4d3FDB8E47DD079c57" target="_blank">
            <MenuIconDiv className="menu-icons">
                <img alt="exchange" src="/images/menu/tjoe.png"/><span className="menu-text">EXCHANGE</span>
            </MenuIconDiv>
          </StyledLinkTag>
      </MenuWrapper>
    </Wrapper>
  );
};

export default Menu;
