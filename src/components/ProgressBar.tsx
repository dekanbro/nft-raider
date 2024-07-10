import { ParLg } from "@daohaus/ui";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

export const ProgressVisualFull = styled.div<{ $backgroundColor: string }>`
  background-color: ${({ theme }) => theme.warning.step8};
  display: flex;
  height: 10rem;
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
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  width: 100%;
  font-size: 7.5rem;

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
    let progressBar = '';
    for (let i = 0; i < totalMoons; i++) {
      if (i < currentMoonIndex) {
        progressBar += stages[4]; // Full moon for completed sections
      } else if (i === currentMoonIndex) {
        progressBar += stages[currentMoonStage]; // Current stage for the current section
      } else {
        progressBar += stages[0]; // New moon for future sections
      }
    }
    return progressBar;
  };


  return (
    <ProgressVisualFull $backgroundColor={backgroundColor}>
      <Moons>{generateMoonProgressBar()}</Moons>
    </ProgressVisualFull>
  );
};