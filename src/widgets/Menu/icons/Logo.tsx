import React from "react";
import styled from "styled-components";
import Svg from "../../../components/Svg/Svg";
import { SvgProps } from "../../../components/Svg/types";


const LogoImage = styled.div`
  margin-left: 16px;
`;

interface LogoProps extends SvgProps {
  isDark: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {
  const textColor = isDark ? "#FFFFFF" : "#000000";
  return (
      <LogoImage>
        <img src='/images/egg/LogoTextNewWhite.png' alt='The Dragon&apos;s Lair'/>
      </LogoImage>
  )
};

export default Logo;
