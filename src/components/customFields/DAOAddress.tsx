import { useEffect} from "react";
import { useFormContext } from "react-hook-form";

import { Buildable, Field } from "@daohaus/ui";


import { ValidNetwork } from "@daohaus/keychain-utils";
import { useDHConnect } from "@daohaus/connect";
import { calculateDAOAddress } from "../../utils/summonTx";
import { DEFAULT_CHAIN_ID } from "../../utils/constants";


export const DAOAddress = (props: Buildable<Field>) => {
  const { watch, setValue } = useFormContext();
  const { chainId } = useDHConnect();

  const saltNonce = watch("saltNonce");
  console.log("saltNonce >>>>>>", props.id, saltNonce);
  

  useEffect(() => {

    const getDAOAddress = async () => {
      if (!saltNonce || !chainId) return;
      const daoAddress = await calculateDAOAddress(saltNonce, DEFAULT_CHAIN_ID as ValidNetwork);
      console.log("daoAddress >>>>>>", props.id, daoAddress);
      setValue(props.id, daoAddress.toLowerCase());
    };


    if (saltNonce && chainId) {
      getDAOAddress();
    }
  }, [saltNonce, chainId]);

  

  return null;
};
