import { styled, useTheme } from "styled-components";
import { ParSm, ParXs } from "@daohaus/ui";
import Marquee from "react-fast-marquee";
import { YeeterItem, YeetsItem } from "../utils/types";
import { useEffect, useState } from "react";
import { formatMarqueeData } from "../utils/yeetDataHelpers";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 20px;
  margin-top: 1rem;

`;

// todo: add token symbol here
export type MarqueeItem = {
  amount?: string;
  description?: string;
  symbol: string;
  verb: string;
  createdAt: string;
};

export const YeetMarquee = ({
  yeets,
  yeeters,
  chainId,
}: {
  yeets: YeetsItem[];
  yeeters: YeeterItem[];
  chainId: string;
}) => {
  const theme = useTheme();
  const [data, setData] = useState<MarqueeItem[]>([]);

  useEffect(() => {
    const normalizedYeets = yeets.map((yeet) => {
      return {
        amount: yeet.amount,
        description: yeet.message,
        symbol: yeet.dao.shareTokenSymbol,
        verb: "yeeted into",
        createdAt: yeet.createdAt,
      };
    });

    const normalizedYeeters = yeeters.map((yeeter) => {
      return {
        symbol: yeeter.dao.shareTokenSymbol,
        verb: "token launched: ",
        createdAt: yeeter.createdAt,
      };
    });

    const normalizedExits = [
      {
        amount: "1000000000000000000",
        verb: "exited from",
        symbol: "SPAM",
        createdAt: "1717182516",
      },
    ];

    setData(
      [...normalizedYeets, ...normalizedYeeters, ...normalizedExits].sort(
        (a, b) => {
          return Number(a.createdAt) - Number(b.createdAt);
        }
      )
    );
  }, [yeets, yeeters]);

  return (
    <Marquee speed={30} autoFill={true} style={{ maxWidth: "150rem" }}>
      {data.map((dataItem, i) => {
        return (
          <Container key={i}>
            <ParSm color={theme.secondary.step10}>
              {formatMarqueeData(dataItem)}
            </ParSm>
          </Container>
        );
      })}
    </Marquee>
  );
};
