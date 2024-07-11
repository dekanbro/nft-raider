import styled from "styled-components";
import { useYeeter } from "../hooks/useYeeter";
import { DEFAULT_CHAIN_ID } from "../utils/constants";
import { ValidNetwork } from "@daohaus/keychain-utils";
import Countdown from "react-countdown";

import {
  Avatar,
  Card,
  H2,
  H3,
  Label,
  ParLg,
  ParMd,
  ParSm,
  widthQuery,
} from "@daohaus/ui";
import {
  formatLootForMin,
  formatMinContribution,
  formatTimeRemainingShort,
  formatTimeUntilPresale,
  getCampaignStatus,
} from "../utils/yeetDataHelpers";
import { YeetGoalProgress } from "./YeetGoalProgress";
import { formatValueTo, fromWei } from "@daohaus/utils";


import BuyButton from "./BuyButton";

import { useDHConnect } from "@daohaus/connect";
import { useDaoData, useDaoMember } from "@daohaus/moloch-v3-hooks";
import ExitButton from "./ExitButton";
import { useEscrow } from "../hooks/useEscrow";
// import { useDaoData } from "../hooks/useDaoData";
import CommentButton from "./CommentButton";
import ExecuteEscrowButton from "./ExecuteEscrowButton";

const DetailItemWarning = styled.div`
  padding: 1rem 2rem;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.warning.step10};
`;

export const BigH2 = styled(H2)`
  font-size: 18rem;
  line-height: 12rem;
  word-break: break-all;
  @media ${widthQuery.sm} {
    font-size: 10rem;
    line-height: 6rem;
  }
`;
export const BigH3 = styled(H3)`
  font-size: 10rem;
  line-height: 10rem;
  word-break: break-all;
  @media ${widthQuery.sm} {
    font-size: 5rem;
    line-height: 5rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

export const PresalePhase = ({
  yeeterId,
  daoId,
  daoChain,
}: {
  yeeterId: string;
  daoId: string;
  daoChain: ValidNetwork;
}) => {
  const { dao } = useDaoData({ daoId, daoChain });
  const { metadata, yeeter } = useYeeter({
    daoId,
    shamanAddress: yeeterId,
    chainId: daoChain,
  });

  const {
    nftEscrowShaman,
    canExecute,
    executed,
    goalAchieved,

  } = useEscrow({
    daoId,
    yeeterShamanAddress: yeeterId,
    chainId: daoChain,
    daoShamans: dao?.shamen?.map((s) => s.shamanAddress),
  });

  const { address } = useDHConnect();
  const { member } = useDaoMember({ daoId, daoChain, memberAddress: address });

  console.log("yeeter >>>>>>>>>>>>>>>>>>>.", dao, yeeter, nftEscrowShaman, metadata);
  if (!metadata || !yeeter || !dao || !nftEscrowShaman) {
    return;
  }

  const campaignStatus = getCampaignStatus(
    yeeter,
    executed || false,
    canExecute || false,
    goalAchieved || false
  );

  const success =
    campaignStatus === "CAN EXECUTE" || campaignStatus === "SUCCESS";

  return (
    <div>
      <BigH2>RAIDING</BigH2>
      {yeeter.isComingSoon && (
        <>
          <BigH3>INTO TO THE MOON RISE</BigH3>
          <DetailItemWarning>
            <BigH2>
              <Countdown date={new Date(Number(yeeter.startTime) * 1000)} />
            </BigH2>
          </DetailItemWarning>
          <ParLg>
            Get ready to BUY. Minimum of {formatMinContribution(yeeter)} ETH for{" "}
            {formatLootForMin(yeeter)} {yeeter.dao.shareTokenSymbol}{" "}
          </ParLg>
          <YeetGoalProgress yeeter={yeeter} dao={dao} chainId={daoChain} />
        </>
      )}
      {yeeter.isActive && (
        <>
          <BigH3>INTO THE MOON</BigH3>
          <DetailItemWarning>
            <BigH2>
              <Countdown date={new Date(Number(yeeter.endTime) * 1000)} />
            </BigH2>
          </DetailItemWarning>
          <ParLg>
            TIME IS RUNNING OUT! You can spend a minimum of{" "}
            {formatMinContribution(yeeter)} ETH for {formatLootForMin(yeeter)}
            {yeeter.dao.shareTokenSymbol}{" "}
          </ParLg>
          <ButtonRow>
            <BuyButton
              daoChain={daoChain}
              daoId={daoId}
              yeeterId={yeeterId}
              context="details"
              tokenSymbol={yeeter.dao.shareTokenSymbol}
            />
            {Number(member?.shares) > 0 && (
              <ExitButton
                daoChain={daoChain}
                yeeterId={yeeterId}
                daoId={daoId}
              />
            )}
          </ButtonRow>
          <YeetGoalProgress yeeter={yeeter} dao={dao} chainId={daoChain} />
        </>
      )}
      {success && (
        <>
          <BigH3>INTO FULL MOONESCROW</BigH3>
          {executed && (
            <>
              <ParSm>
                The Raid was a success and the escorw.
              </ParSm>
            </>
          )}
          {!executed && (
            <>
              <ParSm>
                The Raid was a success. The Uniswap Pool can be created.
              </ParSm>

              <ExecuteEscrowButton
                daoChain={daoChain}
                yeeterId={yeeterId}
                daoId={daoId}
              />
            </>
          )}

        </>
      )}
      {campaignStatus === "FAIL" && (
        <>
          <BigH3>TO NOWHERE</BigH3>
          <ParLg>
            {`${formatValueTo({
              value: fromWei(yeeter.safeBalance.toString()),
              decimals: 5,
              format: "number",
            })} ETH Raised, but it wasn't enough`}
          </ParLg>
          {Number(member?.shares) > 0 && (
            <ExitButton daoChain={daoChain} yeeterId={yeeterId} daoId={daoId} />
          )}
        </>
      )}
      {member && Number(member?.shares) > 0 && (
        <CommentButton
          daoChain={daoChain}
          daoId={yeeter.dao.id}
          yeeterId={yeeter.id}
          icon
        />
      )}
    </div>
  );
};