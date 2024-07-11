import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Buildable, Field } from "@daohaus/ui";

import { ValidNetwork } from "@daohaus/keychain-utils";
import { useDHConnect } from "@daohaus/connect";
import { calculateCreateProxyWithNonceAddress } from "../../utils/summonTx";
import { SafeInfo } from "../../utils/safes";
import { IFindQueryResult } from "@daohaus/data-fetch-utils";
import { DEFAULT_CHAIN_ID } from "../../utils/constants";

export const ManagerAddress = (props: Buildable<Field>) => {
  const { watch, setValue } = useFormContext();
  const { chainId } = useDHConnect();
  const [safeData, setSafeData] = useState<IFindQueryResult<SafeInfo>>();
  
  const saltNonce = watch("saltNonce");

  useEffect(() => {
    const getTreasuryAddress = async () => {
      
      setValue("calculatedTreasuryAddress", await calculateCreateProxyWithNonceAddress(saltNonce, DEFAULT_CHAIN_ID as ValidNetwork));
    };


    if (saltNonce && DEFAULT_CHAIN_ID) {
      getTreasuryAddress();

    }
  }, [saltNonce, chainId]);

  

  return null;
};
