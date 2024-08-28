import { parseEther } from "viem";
import {
  ArbitraryState,
  EthAddress,
  POSTER_TAGS,
  ZERO_ADDRESS,
  encodeFunction,
  encodeValues,
  getNonce,
  isEthAddress,
  isNumberish,
  isString,
} from "@daohaus/utils";
import {
  CONTRACT_KEYCHAINS,
  HAUS_RPC,
  Keychain,
  ValidNetwork,
} from "@daohaus/keychain-utils";
import { LOCAL_ABI } from "@daohaus/abis";
import safeAbi from "../abis/safe.json";
import safeL2Abi from "../abis/safeL2.json";
import basicHOSSummoner from "../abis/basicHOSSummoner.json";
import yeet24HosSummoner from "../abis/yeet24Summoner.json";

import safeFactoryAbi from "../abis/safeFactory.json";

import { handleKeychains } from "@daohaus/contract-utils";

import {
  DEFAULT_SUMMON_VALUES,
  CURATOR_CONTRACTS,
  YEETER_SHAMAN_PERMISSIONS,
  MEME_SHAMAN_PERMISSIONS,
  DEFAULT_YEETER_VALUES,
  DEFAULT_MEME_YEETER_VALUES,
  DEFAULT_NFTESCROW_YEETER_VALUES,
  NFTESCROW_SHAMAN_PERMISSIONS,
  LOOT_SYMBOL
} from "./constants";
import { createEthersContract } from "@daohaus/tx-builder";
import { BigNumber, ethers } from "ethers";
import { SaltNonce } from "../components/customFields/SaltNonce";

export type SummonParams = {
  daoName?: string;
  tokenName?: string;
  tokenSymbol?: string;
  lootTokenName?: string;
  lootTokenSymbol?: string;
  votingTransferable?: boolean;
  nvTransferable?: boolean;
  quorum?: string;
  minRetention?: string;
  sponsorThreshold?: string;
  newOffering?: string;
  votingPeriod?: string;
  votingPeriodInSeconds?: number;
  gracePeriod?: string;
  gracePeriodInSeconds?: number;
  shamans?:
    | ""
    | {
        shamanAddresses: string[];
        shamanPermissions: string[];
      };
  members?:
    | ""
    | {
        memberAddresses: string[];
        memberShares: string[];
        memberLoot: string[];
      };
  calculatedShamanAddress?: string;
  tags?: string[];
};

export const assembleMemeSummonerArgs = (args: ArbitraryState) => {
  console.log(">>>>> args", args);

  const memberAddress = args.appState.memberAddress as EthAddress;
  const formValues = args.appState.formValues as Record<string, unknown>;
  const chainId = args.chainId as ValidNetwork;
  let txArgs: [string, string, string, string[], string];
  console.log(">>>>> start", formValues, memberAddress, chainId);

  if (!isString(formValues["saltNonce"])) {
    throw new Error("Invalid nonce");
  }

  const saltNonce = formValues["saltNonce"].toString() || "8441";

  console.log(">>>>> yo");
  const initializationLootTokenParams = assembleLootTokenParams({
    formValues,
    chainId,
  });

  const initializationShareTokenParams = assembleShareTokenParams({
    formValues,
    chainId,
    memberAddress,
  });

  const initializationShamanParams = assembleShamanParams({
    formValues,
    chainId,
    memberAddress,
  });

  const postInitializationActions = assembleInitActions({
    formValues,
    memberAddress,
    chainId,
    saltNonce,
  });

  console.log(
    ">>>>> summon args",
    initializationLootTokenParams,
    initializationShareTokenParams,
    initializationShamanParams,
    postInitializationActions
  );

  txArgs = [
    initializationLootTokenParams,
    initializationShareTokenParams,
    initializationShamanParams,
    postInitializationActions,
    saltNonce,
  ];

  console.log("txArgs", txArgs);

  return txArgs;
};

const assembleLootTokenParams = ({
  chainId,
  formValues,
}: {
  chainId: ValidNetwork;
  formValues: Record<string, unknown>;
}) => {
  const lootSingleton = CURATOR_CONTRACTS["GOV_LOOT_SINGLETON"][chainId];
  const daoName = formValues["daoName"] as string;
  const tokenSymbol = formValues["tokenSymbol"] as string;

  if (!lootSingleton) {
    console.log("ERROR: passed args");

    throw new Error(
      "assembleLootTokenParams recieved arguments in the wrong shape or type"
    );
  }
  console.log(">>>>> assembleLootTokenParams", daoName, tokenSymbol);

  const lootParams = encodeValues(["string", "string"], [daoName, tokenSymbol + LOOT_SYMBOL]);

  return encodeValues(["address", "bytes"], [lootSingleton, lootParams]);
};

// Needs to be non transferable
const assembleShareTokenParams = ({
  chainId,
  formValues,
  memberAddress,
}: {
  chainId: ValidNetwork;
  formValues: Record<string, unknown>;
  memberAddress: EthAddress;
}) => {
  const shareSingleton = CONTRACT_KEYCHAINS["SHARES_SINGLETON"][chainId];
  const daoName = formValues["daoName"] as string;
  const tokenSymbol = formValues["tokenSymbol"] as string;

  if (!shareSingleton) {
    console.log("ERROR: passed args");

    throw new Error(
      "assembleShareTokenParams recieved arguments in the wrong shape or type"
    );
  }

  const shareParams = encodeValues(
    ["string", "string"],
    [daoName, tokenSymbol]
  );

  return encodeValues(["address", "bytes"], [shareSingleton, shareParams]);
};

export const assembleNftEscrowYeeterShamanParams = ({
  formValues,
  memberAddress,
  chainId,
}: {
  formValues: Record<string, unknown>;
  memberAddress: EthAddress;
  chainId: ValidNetwork;
}) => {
  const nftEscrowYeeterShamanSingleton = CURATOR_CONTRACTS["YEETNFTESCROW_SINGLETON"][chainId];
  const endDate = (formValues["endDate"] || 0) as BigInt;
  const sellerAddress = formValues["sellerAddress"] as string;
  const nftAddress = formValues["nftAddress"] as string;
  const nftTokenId = (formValues["nftTokenId"] || 0) as BigInt;
  const minSalePrice = formValues["minSalePrice"] as BigInt;
  console.log("nftAddress, seller", nftAddress, sellerAddress);
  // console.log(endDate)

  if (
    !nftEscrowYeeterShamanSingleton  || !isEthAddress(sellerAddress) || !isEthAddress(nftAddress)
  ) {
    console.log(
      "assembleNftEscrowYeeterShamanParams ERROR:",
      nftEscrowYeeterShamanSingleton
    );

    throw new Error(
      "assembleNftEscrowYeeterShamanParams: config contracts not found"
    );
  }

  // uint256 _threshold,
  // uint256 _expiration,
  // address _seller,
  // address _nftAddress,
  // uint256 _tokenId

  // console.log("date", endDate);

  const nftEscrowYeeterShamanParams = encodeValues(
    ["uint256", "uint256", "address", "address", "uint256"],
    [
      Number(minSalePrice), // TODO: threshold
      Number(endDate),
      sellerAddress,
      nftAddress,
      Number(nftTokenId)
    ]
  );
  //
  return {
    shamanSingleton: nftEscrowYeeterShamanSingleton,
    shamanPermission: NFTESCROW_SHAMAN_PERMISSIONS,
    shamanInitParams: nftEscrowYeeterShamanParams,
  };
};

const assembleShamanParams = ({
  formValues,
  memberAddress,
  chainId,
}: {
  formValues: Record<string, unknown>;
  memberAddress: EthAddress;
  chainId: ValidNetwork;
}) => {

  const yeeterShamanSingleton = CURATOR_CONTRACTS["YEETER2_SINGLETON"][chainId];
  
  const price = formValues["collectorPrice"] as string;
  const content = formValues["article"] as string;
  const startDate = formValues["startDate"] as string;
  const endDate = formValues["endDate"] as string;
  const minSalePrice = formValues["minSalePrice"] as string;
  const feeCheckbox = formValues["feeCheckbox"] as boolean;

  console.log("feeCheckbox", feeCheckbox);

  console.log(
    "??????????",
    price,
    memberAddress,
    yeeterShamanSingleton,
    content
  );

  const {
    shamanSingleton: nftEscrowYeeterShamanSingleton,
    shamanPermission: nftEscrowYeeterShamanPermission,
    shamanInitParams: nftEscrowYeeterShamanParams,
  } = assembleNftEscrowYeeterShamanParams({ chainId, formValues, memberAddress });

  if (
    !isEthAddress(memberAddress) ||
    !yeeterShamanSingleton||
    !nftEscrowYeeterShamanSingleton
  ) {
    console.log("ERROR: Form Values", formValues);

    throw new Error(
      "assembleShamanParams recieved arguments in the wrong shape or type"
    );
  }

  // uint256 _startTime,
  // uint256 _endTime,
  // bool _isShares,
  // uint256 _minTribute,
  // uint256 _multiplier,
  // uint256 _goal,
  // address[] memory _feeRecipients,
  // uint256[] memory _feeAmounts
  const yeeterShamanParams = encodeValues(
    [
      "uint256",
      "uint256",
      "bool",
      "uint256",
      "uint256",
      "uint256",
      "address[]",
      "uint256[]",
    ],
    [
      startDate,
      endDate,
      DEFAULT_YEETER_VALUES.isShares,
      price,
      DEFAULT_YEETER_VALUES.multiplier,
      minSalePrice, // goal?
      feeCheckbox ? [] : DEFAULT_YEETER_VALUES.feeRecipients,
      feeCheckbox ? [] : DEFAULT_YEETER_VALUES.feeAmounts,
    ]
  );

  const shamanSingletons = [nftEscrowYeeterShamanSingleton, yeeterShamanSingleton];
  const shamanPermissions = [nftEscrowYeeterShamanPermission, YEETER_SHAMAN_PERMISSIONS]
  const shamanInitParams = [nftEscrowYeeterShamanParams, yeeterShamanParams];

  console.log("shaman vals", [
    shamanSingletons,
    shamanPermissions,
    shamanInitParams,
  ]);

  return encodeValues(
    ["address[]", "uint256[]", "bytes[]"],
    [shamanSingletons, shamanPermissions, shamanInitParams]
  );
};


const assembleInitActions = ({
  formValues,
  memberAddress,
  chainId,
  saltNonce,
}: {
  formValues: Record<string, unknown>;
  memberAddress: EthAddress;
  chainId: ValidNetwork;
  saltNonce: string;
}) => {
  const { POSTER } = handleKeychains(chainId);

  let initActions = [];
  console.log("formValues ????????????/", formValues);

  initActions = [
    governanceConfigTX(DEFAULT_SUMMON_VALUES),
    metadataConfigTX(formValues, memberAddress, POSTER.toLowerCase()),
    tokenConfigTX(),
    // tokenDistroTX(formValues, memberAddress),
    shamanModuleConfigTX(formValues, saltNonce, chainId),
    // this will not be indexed as is. move intro post to metadataConfigTX
    // introPostConfigTX(formValues, memberAddress, POSTER.toLowerCase(), chainId),
  ];

  return initActions;
};

const governanceConfigTX = (formValues: SummonParams) => {
  const {
    votingPeriodInSeconds,
    gracePeriodInSeconds,
    newOffering,
    quorum,
    sponsorThreshold,
    minRetention,
  } = formValues;

  if (
    !isNumberish(votingPeriodInSeconds) ||
    !isNumberish(gracePeriodInSeconds) ||
    !isNumberish(newOffering) ||
    !isNumberish(quorum) ||
    !isNumberish(sponsorThreshold) ||
    !isNumberish(minRetention)
  ) {
    throw new Error(
      "governanceConfigTX recieved arguments in the wrong shape or type"
    );
  }

  const encodedValues = encodeValues(
    ["uint32", "uint32", "uint256", "uint256", "uint256", "uint256"],
    [
      votingPeriodInSeconds,
      gracePeriodInSeconds,
      newOffering,
      quorum,
      sponsorThreshold,
      minRetention,
    ]
  );
  const encoded = encodeFunction(LOCAL_ABI.BAAL, "setGovernanceConfig", [
    encodedValues,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("Encoding Error");
};

const tokenConfigTX = () => {
  const pauseVoteToken = true;
  const pauseNvToken = true;

  const encoded = encodeFunction(LOCAL_ABI.BAAL, "setAdminConfig", [
    pauseVoteToken,
    pauseNvToken,
  ]);

  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("Encoding Error");
};

const tokenDistroTX = (formValues: SummonParams, memberAddress: EthAddress) => {
  const shamanAddress = formValues.calculatedShamanAddress;

  const encoded = encodeFunction(LOCAL_ABI.BAAL, "mintShares", [
    [memberAddress],
    ["10000000000000000000"],
  ]);

  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("Encoding Error");
};


const metadataConfigTX = (formValues: Record<string, unknown>, memberAddress: EthAddress, posterAddress: string) => {
  const { daoName, calculatedDAOAddress, body, image, description, paramTag } = formValues;

  if (!isString(daoName)) {
    console.log("ERROR: Form Values", formValues);
    throw new Error("metadataTX recieved arguments in the wrong shape or type");
  }
  console.log("POSTER", posterAddress);


  const content = { 
                name: daoName,
                daoId: calculatedDAOAddress,
                table: 'daoProfile', 
                queryType: 'list',
                description: description || "",
                longDescription: body || "",
                avatarImg: image || "", 
                title: `${daoName} tst`,
                tags: ["NFT Raid", "Incarnation", paramTag || "topic", ],
                authorAddress: memberAddress,
                // parentId: 0
              };


  const METADATA = encodeFunction(LOCAL_ABI.POSTER, "post", [
    JSON.stringify(content),
    POSTER_TAGS.summoner,
  ]);

  const encoded = encodeFunction(LOCAL_ABI.BAAL, "executeAsBaal", [
    posterAddress,
    0,
    METADATA,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("Encoding Error");
};

const shamanModuleConfigTX = (
  formValues: Record<string, unknown>,
  saltNonce: string,
  chainId: ValidNetwork
) => {
  const { calculatedShamanAddress, calculatedTreasuryAddress } = formValues;
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>calculatedShamanAddress", calculatedShamanAddress, calculatedTreasuryAddress);
  console.log("foem values ******", formValues);

  if (
    !isEthAddress(calculatedShamanAddress) ||
    !isEthAddress(calculatedTreasuryAddress)
  ) {
    console.log("ERROR: Form Values", formValues);
    throw new Error(
      "shamanModuleConfigTX recieved arguments in the wrong shape or type"
    );
  }

  // SafeAbi and SafeL2Abi are the same
  // there is a different master copy and proxy factory for L2 though
  const ADD_MODULE = encodeFunction(safeAbi, "enableModule", [
    calculatedShamanAddress,
  ]);

  const EXEC_TX_FROM_MODULE = encodeFunction(
    safeAbi,
    "execTransactionFromModule",
    [
      calculatedTreasuryAddress, // to
      "0", //value
      ADD_MODULE, // data
      "0", // operation
    ]
  );

  // console.log("EXEC_TX_FROM_MODULE", EXEC_TX_FROM_MODULE);

  const encoded = encodeFunction(LOCAL_ABI.BAAL, "executeAsBaal", [
    calculatedTreasuryAddress as EthAddress,
    0,
    EXEC_TX_FROM_MODULE,
  ]);

  if (isString(encoded)) {
    return encoded;
  }
  throw new Error("***********Encoding Error***************");
};

export const calculateDAOAddress = async (
  saltNonce: string,
  chainId: ValidNetwork
) => {
  const yeetNftEscrowSummoner = CURATOR_CONTRACTS["YEETNFTESCROW_SUMMONER"][chainId] || ZERO_ADDRESS;
  // calculateBaalAddress

  console.log("nft escrow Summoner", yeetNftEscrowSummoner, chainId);

  const hos = createEthersContract({
    address: yeetNftEscrowSummoner,
    abi: basicHOSSummoner,
    chainId: chainId,
    rpcs: HAUS_RPC,
  });
  let expectedDAOAddress = await hos.callStatic.calculateBaalAddress(saltNonce);

  console.log(
    ">>>>>>>>>>>>>>>>>>>>>>>>>>>expectedDAOAddress",
    expectedDAOAddress,
    ethers.utils.getAddress(expectedDAOAddress)
  );

  return ethers.utils.getAddress(expectedDAOAddress);
};

export const generateShamanSaltNonce = ({
  baalAddress,
  index,
  initializeParams,
  saltNonce,
  shamanPermissions,
  shamanTemplate,
}: {
  baalAddress: string;
  index: string;
  shamanPermissions: string;
  shamanTemplate: string;
  initializeParams: string;
  saltNonce: string;
}) => {
  // baalAddress,
  // i,
  // shamanTemplates[i],
  // shamanPermissions[i],
  // keccak256(initShamanDeployParams[i]),
  // saltNonce
  console.log("~~~~~generateShamanSaltNonce", {baalAddress, index, shamanTemplate, shamanPermissions, initializeParams, saltNonce});

  console.log("~~~~~~generated salt????????????????????**", ethers.utils.keccak256(initializeParams));  
  return ethers.utils.keccak256(
    encodeValues(
      ["address", "uint256", "address", "uint256", "bytes32", "uint256"],
      [
        baalAddress,
        index,
        shamanTemplate,
        shamanPermissions,
        ethers.utils.keccak256(initializeParams),
        saltNonce,
      ]
    )
  );
}
 
export const calculateNftEscrowShamanAddress = async (
  saltNonce: string,
  chainId: ValidNetwork
) => {
  const yeetNftEscrowSingleton = CURATOR_CONTRACTS["YEETNFTESCROW_SINGLETON"][chainId] || ZERO_ADDRESS;
  const yeetNftEscrowShamanSummoner = CURATOR_CONTRACTS["YEETNFTESCROW_SUMMONER"][chainId] || ZERO_ADDRESS;
  console.log("yeet nft escrow Shaman", yeetNftEscrowSingleton, yeetNftEscrowShamanSummoner, chainId);
  const hos = createEthersContract({
    address: yeetNftEscrowShamanSummoner,
    abi: yeet24HosSummoner,
    chainId: chainId,
    rpcs: HAUS_RPC,
  });
  let expectedShamanAddress = ZERO_ADDRESS;

  console.log("yeet nft escrow Shaman", yeetNftEscrowSingleton, yeetNftEscrowShamanSummoner, chainId);
  console.log("?????????????saltNonce", saltNonce);
  try {
    expectedShamanAddress = await hos.callStatic.predictDeterministicShamanAddress(
      yeetNftEscrowSingleton,
      saltNonce
    );
  } catch (e: any) {
    console.log("expectedShamanAddress error", e);
  }

  return expectedShamanAddress;
};

// util to get the address of a safe before it is deployed
export const calculateCreateProxyWithNonceAddress = async (
  saltNonce: string,
  chainId: ValidNetwork
) => {
  const gnosisSafeProxyFactoryAddress =
    CURATOR_CONTRACTS["GNOSIS_SAFE_PROXY_FACTORY"][chainId] || ZERO_ADDRESS;
  const masterCopyAddress =
    CURATOR_CONTRACTS["GNOSIS_SAFE_MASTER_COPY"][chainId];
  const initializer = "0x";
  console.log(
    "gnosisSafeProxyFactoryAddress",
    gnosisSafeProxyFactoryAddress,
    masterCopyAddress,
    chainId
  );
  console.log("saltNonce calculateCreateProxyWithNonceAddress", saltNonce);
  if (
    !isEthAddress(gnosisSafeProxyFactoryAddress) ||
    !isEthAddress(masterCopyAddress)
  ) {
    throw new Error("Invalid address");
  }
  const gnosisSafeProxyFactory = createEthersContract({
    address: gnosisSafeProxyFactoryAddress,
    abi: safeFactoryAbi,
    chainId: chainId,
    rpcs: HAUS_RPC,
  });
  let expectedSafeAddress = ZERO_ADDRESS;

  try {
    await gnosisSafeProxyFactory.estimateGas.calculateCreateProxyWithNonceAddress(
      masterCopyAddress,
      initializer,
      BigNumber.from(saltNonce),
      { from: gnosisSafeProxyFactoryAddress }
    );
  } catch (e: any) {
    expectedSafeAddress = getSafeAddressFromRevertMessage(e);
  }

  return expectedSafeAddress;
};

const getSafeAddressFromRevertMessage = (e: any): string => {
  let safeAddress;
  if (e.error.error.data) {
    safeAddress = ethers.utils.getAddress(e.error.error.data.slice(138, 178));
  } else {
    let messages: string[] = e.error.split(" ");
    safeAddress =
      messages
        .find((m) => m.match(/^0x[a-fA-F0-9]{40,44}$/))
        ?.replace(",", "") ?? ZERO_ADDRESS;
  }
  return safeAddress;
};

export const getSaltNonce = (length = 32) => {
  let text = "";
  const possible = "0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
