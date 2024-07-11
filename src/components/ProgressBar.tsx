import { ParLg } from "@daohaus/ui";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

export const ProgressVisualFull2 = styled.div<{ $backgroundColor: string }>`
  background-color: ${({ theme }) => theme.warning.step8};
  display: flex;
  height: 10rem;
  border-radius: 20px;
  box-shadow: 3px 3px ${({ theme }) => theme.warning.step1};
`;
const ProgressVisualFull = styled.div<{ $backgroundColor: string }>`
  display: flex; 
  flex-wrap: nowrap; 
  align-items: center; 
  justify-content: center; 
  background-color: ${({ theme }) => theme.warning.step8};
  width: 100%; 
  overflow: hidden; 
   border-radius: 20px;
  box-shadow: 3px 3px ${({ theme }) => theme.warning.step1};
`;

export const ProgressVisualPart = styled.div<{
  width: string;
  $backgroundColor: string;
}>`
  width: ${(props) => props.width};
  background-color: ${({ theme }) => theme.warning.step5};
  /* Number of the seconds for complete animation */
  transition: width 2s;
  border-radius: 19px;
`;

const Moons = styled.div`
  display: flex; // Makes Moons a flex container
  flex-wrap: nowrap; // Prevents wrapping of its children
  flex-shrink: 1; // Allows Moons itself to shrink
  min-width: 0; // Allows shrinking below its content's default size
  width: 100%; // Takes the full width of its parent
  

`;

const Moon = styled.span`
  flex: 1; 
  text-align: center; 

  font-size: calc(5vw);
  margin: 0 -5px;

`;

type ProgressProps = {
  backgroundColor: string;
  progressSection: {
    percentage: number;
    color: string;
  };
};

export const ProgressBar = ({
  backgroundColor,
  progressSection =  {
      percentage: 0,
      color: "transparent",
    },
  
}: ProgressProps) => {

  const stages = ['🌑', '🌘', '🌗', '🌖', '🌕'];
  const totalMoons = 10;
  const currentMoonIndex = Math.floor(progressSection.percentage / 10);
  const currentMoonStage = Math.floor(progressSection.percentage) % 5;

  const generateMoonProgressBar = () => {
    let progressBar = [];
    for (let i = 0; i < totalMoons; i++) {
      let moonStage = '';
      if (i < currentMoonIndex) {
        moonStage += stages[4]; // Full moon for completed sections
      } else if (i === currentMoonIndex) {
        moonStage += stages[currentMoonStage]; // Current stage for the current section
      } else {
        moonStage += stages[0]; // New moon for future sections
      }
      progressBar.push(<Moon key={i}>{moonStage}</Moon>);
    }
    return progressBar;
  };


  return (
    <ProgressVisualFull $backgroundColor={backgroundColor}>
      <Moons>{generateMoonProgressBar()}</Moons>
    </ProgressVisualFull>
  );
};