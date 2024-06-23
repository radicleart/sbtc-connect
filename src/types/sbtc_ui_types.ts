import type { ExchangeRate, KeySet, SbtcContractDataType } from "@mijoco/stx_helpers/dist/index";

export interface FeeEstimateResponse {
	feeInfo: {
		low_fee_per_kb:number;
		medium_fee_per_kb:number;
		high_fee_per_kb:number;
	};
}

export interface BalanceI {
	balance: number;
}

export interface UIObject {
	keys:KeySet;
	sbtcContractData:SbtcContractDataType;
	rates:Array<ExchangeRate>
}
  