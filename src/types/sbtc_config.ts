import type { AddressObject, AuthorisationDataType, BridgeTransactionType, DepositPayloadUIType, ExchangeRate, SbtcContractDataType, WithdrawPayloadUIType } from "@mijoco/stx_helpers/dist/index";

export const defaultSbtcConfig:SessionStore = {
  sigData: undefined,
  sbtcContractData: {} as SbtcContractDataType,
  userSettings: {
    useOpDrop: false,
    debugMode: false,
    currency: {
      cryptoFirst: false,
      myFiatCurrency: {
        _id: "nan",
        currency: "USD",
        fifteen: 0,
        last: 0,
        buy: 0,
        sell: 0,
        symbol: "$",
        name: "USD"
      },
      denomination: 'bitcoin'
    },
    peggingIn: false
  },
  keySets: {},
  payloadDepositData: {
    principal: '',
    bitcoinAddress: '',
    amountSats: 0,
    sbtcWalletPublicKey: '',
    reclaimPublicKey: '',
    paymentPublicKey: ''
  },
  payloadWithdrawData: {
    principal: '',
    bitcoinAddress: '',
    signature: undefined,
    amountSats: 0,
    sbtcWalletPublicKey: '',
    reclaimPublicKey: '',
    paymentPublicKey: ''
  }
}
