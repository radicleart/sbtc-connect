import type { DepositPayloadUIType, SbtcContractDataType, WithdrawPayloadUIType } from "@mijoco/stx_helpers/dist/index";
import type { AddressObject, InFlight, ExchangeRate, PoxInfo, ProposalEvent, SbtcUserSettingI, SoloPoolData, StacksBalance, StacksInfo, ExtensionType } from "@mijoco/stx_helpers/dist/index";

export type SessionStore = {
  name: string;
  balances?: StacksBalance,
  keySets: { [key: string]: AddressObject; };
  userSettings:SbtcUserSettingI;
  poxInfo:PoxInfo,
  exchangeRates: Array<ExchangeRate>
  stacksInfo: StacksInfo;
  sbtcInfo: SbtcInformation;
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

