import { Chain, sepolia, arbitrum } from "viem/chains";

import {
  HAUS_NETWORK_DATA,
  HAUS_RPC,
  Keychain,
  KeychainList,
  NetworkConfig,
  ValidNetwork,
} from "@daohaus/keychain-utils";

export const MEME_YEETER_SUMMONER_REFERRER = "DHYeet24ShamanSummoner.6";
export const NFT_ESCROW_SUMMONER_REFERRER = "DHYeet24ShamanSummoner.6"; // "NFTEscrowShamanSummoner.5";
export const NFT_ESCROW_NAME = "YeetNftEscrowShamanModule";

export const YEET24_REFERRER = "DHYeet24ShamanSummoner.6";
export const YEET24_NAME = "Yeet24ShamanModule";

export const CURATOR_CONTRACTS: KeychainList = {
  SHARES_SINGLETON_2: {
    "0xa4b1": "0xad9ae3ca04d670d6103516b2bf1f637ff1af240d",
  },
  LOOT_SINGLETON_2: {
    "0xa4b1": "0xad9ae3ca04d670d6103516b2bf1f637ff1af240d",
  },
  YEET24_SUMMONER: {
    "0xa4b1": "",
  },
  YEETNFTESCROW_SUMMONER: {
    "0xa4b1": "0x24c2ca1152abe7f34b4ecd82a3d1d18876533620", //
  },
  YEETER_SINGLETON: {
    "0xa4b1": "",
  },
  YEETER2_SINGLETON: {
    "0xa4b1": "0xd55ce418a17418fe36254ad71c25f87aa97afc85",
  },
  YEETNFTESCROW_SINGLETON: {
    "0xa4b1": "0xec0d1f8baed05ed6516fe0f9304566115f2dbbde",
  },
  YEET24_SINGLETON: {
    "0xa4b1": "",
  },
  FIXED_LOOT_SINGLETON: {
    // "0x1": "0x9d42696a9c3c54952b8918dcbcb82dd710347c77",
    // "0x5": "0x9d42696a9c3c54952b8918dcbcb82dd710347c77",
    // "0xa": "0x8dd2ca9f0ae4f464bf5a0c2283fc5c84f16f2f8e",
  },
  GOV_LOOT_SINGLETON: {
    // "0x1": "0xbdf2bd70d5dc78dce008b337d889b50c217c6eb7",
    // "0x5": "0xbdf2bd70d5dc78dce008b337d889b50c217c6eb7",
    // "0xa": "0x1597e36560a4935e8ba40520d2f3037fd111054c",
    "0xa4b1": "0x0444ae984b9563c8480244693ed65f25b3c64a4e",
  },

  GNOSIS_SAFE_PROXY_FACTORY: {
    // "0x1": "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2",
    // "0x5": "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2",
    // "0xa": "0xc22834581ebc8527d974f8a1c97e1bea4ef910bc",
    "0xa4b1": "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2", // "0xc22834581ebc8527d974f8a1c97e1bea4ef910bc", // module factory 0x00000000000DC7F163742Eb4aBEf650037b1f588
  },
  GNOSIS_SAFE_MASTER_COPY: {
    // "0x1": "0xd9db270c1b5e3bd161e8c8503c55ceabee709552",
    // "0x5": "0xd9db270c1b5e3bd161e8c8503c55ceabee709552",
    // "0xa": "0xfb1bffc9d739b8d520daf37df666da4c687191ea", // "0xd9db270c1b5e3bd161e8c8503c55ceabee709552",
    "0xa4b1": "0x3E5c63644E683549055b9Be8653de26E0B4CD36E", // 0x3E5c63644E683549055b9Be8653de26E0B4CD36E
  },
  UNISWAP_V3_NF_POSITION_MANAGER: {
    "0xa4b1": "",
  },
  WETH: {
    "0xa4b1": "",
  },
  POSTER: {
    "0xaa36a7": "0x000000000000cd17345801aa8147b8d3950260ff",
    "0x2105": "0x000000000000cd17345801aa8147b8d3950260ff",
    "0xa4b1": "0x000000000000cd17345801aa8147b8d3950260ff",
  },
};

/// https://docs.tokenbound.org/contracts/deployments

type KEYCHAIN = {
  [key: string]: string;
};

export const YEETER_GRAPH_URL: KEYCHAIN = {
  // "0xaa36a7": `https://gateway-arbitrum.network.thegraph.com/api/${
  //   import.meta.env.VITE_YEETER_GRAPH_API_KEY
  // }/subgraphs/id/8Syem3ZN88cut1wL8AqPHNo658Px7M2CkRuHAGuxvf6j`,
  "0xaa36a7": `https://api.studio.thegraph.com/query/73494/yeeter-sepolia/v0.0.3`,
  "0x64": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/EGG5xEkiKKtGa9frTfBSmL2w7ZmzPDke5ZuvxDRwQcGe`,
  "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/55wEbRchfvjtWsy5NqLc4hp9C7xbX9yk8bAr3UQA8F7x`,
  "0xa4b1": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/BeGugH1TsMspZ7Nov1Uq2PQ98X78sqjuEy1JFGLyNgt5`,
  "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/6vyAqRpCyrhLsfd6TfYAssvKywKhxJykkDbPxJZ4ZcEr`,
};

export const DH_GRAPH_URL: KEYCHAIN = {
  "0xaa36a7": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/3k93SNY5Y1r4YYWEuPY9mpCm2wnGoYDKRtk82QZJ3Kvw`,
  "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW`,
};

export const targetNetworks: Keychain<NetworkConfig> = {
  "0xaa36a7": HAUS_NETWORK_DATA["0xaa36a7"],
  "0x64": HAUS_NETWORK_DATA["0x64"],
  "0xa": HAUS_NETWORK_DATA["0xa"],
  "0xa4b1": HAUS_NETWORK_DATA["0xa4b1"],
  "0x2105": HAUS_NETWORK_DATA["0x2105"],
};
export const DEFAULT_CHAIN_ID = "0xa4b1";

export const CHAIN_OBJ: {
  [key: string]: Chain;
} = {
  "0xa4b1": arbitrum,
};

export const RPC_URLS: KEYCHAIN = {
  "0xa4b1": HAUS_RPC["0xa4b1"],
};

export const getValidChainId = (chainId?: string) => {
  return targetNetworks[chainId as ValidNetwork]?.chainId || DEFAULT_CHAIN_ID;
};

export const SPONSOR_THRESHOLD = "1000000000000000000";
export const YEETER_SHAMAN_PERMISSIONS = "2"; // manager only
export const MEME_SHAMAN_PERMISSIONS = "3"; // admin + manager
export const NFTESCROW_SHAMAN_PERMISSIONS = "1"; // admin only

export const SHARE_NAME = "";
export const SHARE_SYMBOL = "";
export const LOOT_NAME = "Community Power";
export const LOOT_SYMBOL = "-LOOT";
export const DEFAULT_SUMMON_VALUES = {
  votingPeriodInSeconds: 259200,
  // votingPeriodInSeconds: 200,
  gracePeriodInSeconds: 172800,
  // gracePeriodInSeconds: 6,
  newOffering: "1000000000000000",
  //   quorum: "20",
  quorum: "20",
  sponsorThreshold: SPONSOR_THRESHOLD,
  minRetention: "66",
  votingTransferable: false,
  nvTransferable: true,
};

export const ADMIN_URL = "";

export const DEFAULT_YEETER_VALUES = {
  isShares: true,
  feeRecipients: [
    "0xd0f8720846890a7961945261fe5012e4ca39918e",
    "0x4a9a27d614a74ee5524909ca27bdbcbb7ed3b315",
  ], // yeeter team, daohaus eco fund
  feeAmounts: ["5000", "5000"], // .5% fees
  lootPerYeet: "100",
  multiplier: "10000",
  minThresholdGoal: "100000000000000000",
};

export const DEFAULT_MEME_YEETER_VALUES = {
  poolFee: "10000", // 1%
};

export const DEFAULT_NFTESCROW_YEETER_VALUES = {
  seller: "0xCED608Aa29bB92185D9b6340Adcbfa263DAe075b",
  nftAddress: "0x9f4d7aac478bda478ff17c4344934e0f87cde9ec",
  nftTokenId: "1",
};
