import type { DepositPayloadUIType, SbtcContractDataType, WithdrawPayloadUIType } from "@mijoco/stx_helpers/dist/index";
import type { AddressObject, InFlight, ExchangeRate, PoxInfo, ProposalEvent, SbtcUserSettingI, SoloPoolData, StacksBalance, StacksInfo, ExtensionType } from "@mijoco/stx_helpers/dist/index";

export type Configuration = {
  VITE_ENVIRONMENT:string;
  VITE_PUBLIC_APP_NAME: string;
  VITE_PUBLIC_APP_VERSION: string;
  VITE_NETWORK: string;
  VITE_SBTC_COORDINATOR: string;
  VITE_SBTC_CONTRACT_ID: string;
  VITE_REVEALER_API: string;
  VITE_STACKS_API: string;
  VITE_STACKS_EXPLORER: string;
  VITE_MEMPOOL_API: string;
  VITE_BSTREAM_EXPLORER: string;
  VITE_MEMPOOL_EXPLORER: string;
  VITE_HEADER_LINKS: Array<HeaderLink>;
}

export type ApiLink = {
  name: string; 
  href: string; 
}

export type SessionStore = {
  name: string;
  balances?: StacksBalance,
  keySets: { [key: string]: AddressObject; };
  userSettings:SbtcUserSettingI;
  poxInfo:PoxInfo,
  exchangeRates: Array<ExchangeRate>
  stacksInfo: StacksInfo;
  sbtcInfo: SbtcInformation;
  apis: {
    revealerApi: string;
    stacksApi: string;
  }
};

export type SbtcInformation = {
  sigData:any;
  sbtcContractData: SbtcContractDataType;
  payloadDepositData: DepositPayloadUIType;
  payloadWithdrawData: WithdrawPayloadUIType;
};


export type DaoStore = {
  proposals: Array<ProposalEvent>;
  extensions?: Array<ExtensionType>;
  soloPoolData: SoloPoolData,
  daoData?:InFlight;
  currentProposal?: {configId:string, contractId:string}
};

export type HeaderItem = {
  name: string; 
  href: string; 
  display: string; 
  target: string;
}

export type HeaderLink = {
  name: string; 
  href: string; 
  display: string; 
  target: string;
  items?: Array<HeaderItem>;
}

