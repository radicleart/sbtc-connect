
import { getConfig, getSession } from '$stores/store_helpers';
import { sessionStore } from '$stores/stores'
import type { SbtcInformation, SessionStore } from '$types/local_types';
import { openSignatureRequestPopup, type SignatureData, type StacksProvider } from '@stacks/connect';import { AppConfig, UserSession, showConnect, getStacksProvider } from '@stacks/connect';
import { hashMessage, verifyMessageSignature } from '@stacks/encryption';
import { hex } from '@scure/base';
import { AddressPurpose, BitcoinNetworkType, getAddress } from 'sats-connect'
import type { GetAddressOptions } from 'sats-connect'
import { StacksMessageType, publicKeyFromSignatureVrs } from '@stacks/transactions';
import { fetchUserBalances } from './revealer_api';
import { fetchExchangeRates, fetchStacksInfo, getPoxInfo, getStacksAddressFromPubkey, getStacksNetwork, getTokenBalances, getWalletBalances, isLoggedIn, type AddressObject, type DepositPayloadUIType, type ExchangeRate, type PoxInfo, type SbtcContractDataType, type SbtcUserSettingI, type StacksInfo, type WithdrawPayloadUIType } from '@mijoco/stx_helpers/dist/index';
import { tsToDate } from './utils';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig }); // we will use this export from other files
const authMessage = 'Please sign authentication'
let userMessage:string;
let walletAddresses:any;

export const webWalletNeeded = false;
export const minimumDeposit = 10000
export const revealPayment = 10001

export function isWalletAccountConnected(stxAddress:string) {
	if (!walletAddresses) return true
	const connected = walletAddresses?.result?.addresses?.findIndex((o:any) => o.address === stxAddress) || -1
	return connected > -1
}
const allowed = [
	{ btc: '2N8fMsws2pTGfNzkFTLWdUYM5RTWEAphieb', stx: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R'}, // devnet testing
	{ btc: '2N8fMsws2pTGfNzkFTLWdUYM5RTWEAphieb', stx: 'SP1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28GBQA1W0F'}, // mike 1
	{ btc: 'bc1qfdxax8gr9lufdf4j5wzkhelczr804n89ze2rfa', stx: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6'}, // mike 2
	{ btc: '1EJboSZVgPNrKCVmhmkV2rjLW4KN2Urti', stx: 'SP1ACWJC0TMD9F3Q3FJQFDWV9GSSTXN8RY31HR10B'}, // igor
	{ btc: '1FFaqXGJPNvU28QhsCz9gsRatc1C55V33e', stx: 'SP2E57N3DDG0CSF6XYWABZ1E7QBF8CTKJ4J1PHP0V'}, // jude
	{ btc: 'bc1q8j0gh8754jd9jerlxvpvxx4kc82e4u7f8ynnvp', stx: 'SP1R3S5RB1FSKCGQGW16ZHHPK6FAN57EAQ3RD7HP9'}, // marten
]
	
export function isAllowed(address:string) {
	return allowed.find((o) => o.stx === address);
}

export async function fetchSbtcBalance (conf:SessionStore, fromLogin:boolean|undefined) {
	const localKs = conf.keySets[getConfig().VITE_NETWORK];
	if (!fromLogin && localKs	&& localKs.stxAddress && localKs.cardinal) { // && sessionStacks === localKs.stxAddress) {
		conf.keySets[getConfig().VITE_NETWORK] = await getBalances(conf.sbtcInfo.sbtcContractData.contractId, localKs)
		sessionStore.update(() => conf);
		return conf;
	} else {
		await addresses(async function(addr:AddressObject) {
			if (addr) {
				conf.keySets[getConfig().VITE_NETWORK] = await getBalances(conf.sbtcInfo.sbtcContractData.contractId, addr)
				sessionStore.update(() => conf);
			}
			return conf;
		});
	}
}
async function getBalances(contractId:string, addressObject:AddressObject):Promise<AddressObject> {
	let result:AddressObject;
	const tempSegwit0 = addressObject.btcPubkeySegwit0
	const tempSegwit1 = addressObject.btcPubkeySegwit1
	try {
		result = await fetchUserBalances(addressObject);
		try {
			result.sBTCBalance = Number(result.sBTCBalance)
		} catch (err) {
			result.sBTCBalance = 0
		}
	} catch(err) {
		result = addressObject;
		console.log('Network down...');
	}
	if (!result.sBTCBalance) result.sBTCBalance = 0
	result.btcPubkeySegwit0 = tempSegwit0
	result.btcPubkeySegwit1 = tempSegwit1
	return result;
}
function getStacksAddress() {
	if (isLoggedIn()) {
		const userData = userSession.loadUserData();
		const stxAddress = (getConfig().VITE_NETWORK === 'testnet' || getConfig().VITE_NETWORK === 'devnet') ? userData.profile.stxAddress.testnet : userData.profile.stxAddress.mainnet;
		return stxAddress
	}
	return
}

function getProvider() {
	const provider:StacksProvider = getStacksProvider()
	const prod = (provider.getProductInfo) ? provider.getProductInfo() : undefined;
	if (!prod) throw new Error('Provider not found')
	return prod
}

export function isHiro() {
	return Object.prototype.hasOwnProperty.call(window, 'LeatherProvider') //getProvider().name.toLowerCase().indexOf('hiro') > -1
}

export function isLeather() {
	return Object.prototype.hasOwnProperty.call(window, 'LeatherProvider') // getProvider().name.toLowerCase().indexOf('leather') > -1
}

async function addresses(callback:any):Promise<AddressObject|undefined> {
	if (!isLoggedIn()) return {} as AddressObject;
	const userData = userSession.loadUserData();
	const network = getConfig().VITE_NETWORK;
	//let something = hashP2WPKH(payload.public_keys[0])
	const stxAddress = getStacksAddress();

	if (isHiro() || isLeather()) {
		let ordinal = userData.profile.btcAddress.p2tr.testnet
		let cardinal = userData.profile.btcAddress.p2wpkh.testnet
		if (network === 'mainnet') {
			ordinal = userData.profile.btcAddress.p2tr.mainnet
			cardinal = userData.profile.btcAddress.p2wpkh.mainnet
		} else if (network === 'devnet') {
			ordinal = userData.profile.btcAddress.p2tr.regtest
			cardinal = userData.profile.btcAddress.p2wpkh.regtest
		} else if (network === 'signet') {
			ordinal = userData.profile.btcAddress.p2tr.signet
			cardinal = userData.profile.btcAddress.p2wpkh.signet
		}
		if (userData.profile.btcAddress) {
			callback({
				network,
				stxAddress,
				cardinal,
				ordinal,
				btcPubkeySegwit0: userData.profile.btcPublicKey.p2wpkh,
				btcPubkeySegwit1: userData.profile.btcPublicKey.p2tr,
				sBTCBalance: 0,
				stxBalance: 0
			});
		} else {
			callback({
				network,
				stxAddress,
				cardinal: undefined,
				ordinal: undefined,
				btcPubkeySegwit0: undefined,
				btcPubkeySegwit1: undefined,
				sBTCBalance: 0,
				stxBalance: 0
			});
		}
	} else {
		let myType = BitcoinNetworkType.Testnet
		if (getStacksNetwork(getConfig().VITE_NETWORK).isMainnet()) myType = BitcoinNetworkType.Mainnet
		const getAddressOptions:GetAddressOptions = {
			payload: {
				purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
				message: 'Address for receiving Ordinals and payments',
				  network: {
					type: myType
				},
			},
			onFinish: (response:any) => {
				console.log(response)
				const obj = response.addresses;
				callback({
					network,
					stxAddress,
					cardinal: obj.find((o:any) => o.purpose === 'payment').address,
					ordinal: obj.find((o:any) => o.purpose === 'ordinals').address,
					btcPubkeySegwit0: obj.find((o:any) => o.purpose === 'payment').publicKey,
					btcPubkeySegwit1: obj.find((o:any) => o.purpose === 'ordinals').publicKey,
					sBTCBalance: 0,
					stxBalance: 0
				});
			},
			onCancel: () => {
				throw new Error('cancelled');
			}
		}
		await getAddress(getAddressOptions);
	}
}

export function appDetails() {
	return {
		name: 'sBTC Bridge',
		icon: (window) ? window.location.origin + '/img/icon_sbtc.png' : '/img/icon_sbtc.png',
	}
}

export function makeFlash(el1:HTMLElement|null) {
	let count = 0;
	if (!el1) return;
	el1.classList.add("flasherize-button");
    const ticker = setInterval(function () {
		count++;
		if ((count % 2) === 0) {
			el1.classList.add("flasherize-button");
		}
		else {
			el1.classList.remove("flasherize-button");
		}
		if (count === 2) {
			el1.classList.remove("flasherize-button");
			clearInterval(ticker)
		}
	  }, 2000)
}

export function isLegal(routeId:string):boolean {
	try {
		if (userSession.isUserSignedIn()) return true;
		if (routeId.startsWith('http')) {
			if (routeId.indexOf('/deposit') > -1 || routeId.indexOf('/withdraw') > -1 || routeId.indexOf('/admin') > -1 || routeId.indexOf('/transactions') > -1) {
				return false;
			}
		} else if (['/deposit', '/withdraw', '/admin'].includes(routeId)) {
			return false;
		}
		return true;
	} catch (err) {
		return false
	}
}

export async function authenticate($sessionStore:SessionStore):Promise<SignatureData|undefined> {
	userMessage = authMessage + ' ' + Math.floor( Math.random() * 1000000);
	userMessage = userMessage + ' on ' + tsToDate(new Date().getTime());
	await signMessage(async function(sigData:SignatureData, message:string) {
		const verified = verifyMessageSignature({ message, publicKey: sigData.publicKey, signature: sigData.signature });
		if (verified) {
		  console.log('sig verififed')
		}
	    const msgHash = hashMessage(message);
    	//const stxAddresses = await getStacksAddressFromSignature(msgHash, sigData.signature );
		const pubkey = publicKeyFromSignatureVrs(hex.encode(msgHash), { data: sigData.signature, type: StacksMessageType.MessageSignature })
		console.log('pubkey:', pubkey)
		//console.log('stxAddresses:', stxAddresses)
		console.log('stxAddresses:', getStacksAddressFromPubkey(hex.decode(sigData.publicKey)))
		sessionStore.update(() => $sessionStore)
		return sigData
	}, userMessage)
	return
}

/**
export async function loginStacks(callback:any) {
	try {
		const provider = getStacksProvider()
		console.log('provider: ', provider)
		if (!userSession.isUserSignedIn()) {
			showConnect({
				userSession,
				appDetails: appDetails(),
				onFinish: async () => {
					callback(true);
				},
				onCancel: () => {
					callback(false);
				},
			});
		} else {
			callback(true);
		}
	} catch (e) {
		if (window) window.location.href = "https://wallet.hiro.so/wallet/install-web";
		callback(false);
	}
} */

export async function signMessage(callback:any, message:string) {
	await openSignatureRequestPopup({
		message,
		network: getStacksNetwork(getConfig().VITE_NETWORK), // for mainnet, `new StacksMainnet()`
		appDetails: appDetails(),
		onFinish({ publicKey, signature }) {
			let newSig = signature.substring(0, signature.length - 2);
			const recByte = signature.substring(signature.length - 2);
			newSig = recByte + newSig
			const verified1 = verifyMessageSignature({ signature: newSig, message, publicKey });
			if (!verified1) throw new Error('verifyMessageSignature - signature is not valid')
			callback({ publicKey, signature: newSig }, message);
		}
	});
}
export async function signMessageForWithdraw(callback:any, message:string) {
	await openSignatureRequestPopup({
		message,
		network: getStacksNetwork(getConfig().VITE_NETWORK), // for mainnet, `new StacksMainnet()`
		appDetails: appDetails(),
		onFinish({ publicKey, signature }) {
			//let newSig = signature.substring(0, signature.length - 2);
			//const recByte = signature.substring(signature.length - 2);
			//newSig = recByte + newSig
			//const verified1 = verifyMessageSignature({ signature: newSig, message, publicKey });
			//if (!verified1) throw new Error('verifyMessageSignature - signature is not valid')
			callback({ publicKey, signature }, message);
		}
	});
}

export function verifyAmount(amount:number, balance:number) {
	if (!amount || amount === 0) {
		throw new Error('No amount entered');
	}
	if (amount >= balance) {
		throw new Error('Amount is greater than your balance');
	}
  	//if (amount < minimumDeposit) {
	//	throw new Error('Amount must be at least 0.0001 or 10,000 satoshis');
	//  }
}
export function verifySBTCAmount(amount:number, balance:number, fee:number) {
	if (!amount || amount === 0) {
		throw new Error('No amount entered');
	}
	if (amount > (balance - fee)) {
		throw new Error('No more then balance (less fee of ' + fee + ')');
	}
}

export function initDefaultConfig() {
	const network = getConfig().VITE_NETWORK
	const settings = getSession().userSettings || defaultSettings()
	settings.currency = {
		myFiatCurrency: defaultExchangeRate(),
		cryptoFirst: true,
		denomination: 'USD'
	}
	sessionStore.update((conf:SessionStore) => {
		if (!conf.keySets || !conf.keySets[network]) {
			if (network === 'testnet') {
				conf.keySets = { 'testnet': {} as AddressObject };
			} else if (network === 'devnet') {
				conf.keySets = { 'devnet': {} as AddressObject };
			} else {
				conf.keySets = { 'mainnet': {} as AddressObject };
			}
			conf.keySets[network] = {} as AddressObject;
		}
		conf.stacksInfo = {} as StacksInfo
		conf.poxInfo = {} as PoxInfo
		if (!conf.keySets || !conf.keySets[network]) {
			if (network === 'testnet'|| network === 'regtest') {
				conf.keySets = { 'testnet': {} as AddressObject };
			} else {
				conf.keySets = { 'mainnet': {} as AddressObject };
			}
		}
		conf.exchangeRates = [] as Array<ExchangeRate>;
		conf.userSettings = settings
		conf.sbtcInfo = defaultSbtcInformation()
		return conf;
	});
}

export async function initApplication(userSettings?:SbtcUserSettingI) {
	const network = getConfig().VITE_NETWORK
	const stacksApi = getSession().apis?.stacksApi || getConfig().VITE_STACKS_API
	const ecoApi = getSession().apis?.revealerApi || getConfig().VITE_REVEALER_API
	const settings = userSettings || defaultSettings()
	settings.currency = {
		myFiatCurrency: defaultExchangeRate(),
		cryptoFirst: true,
		denomination: 'USD'
	}
	try {
		if (!userSettings) userSettings = {} as SbtcUserSettingI;
		if (!getSession().apis) {
			sessionStore.update((conf:SessionStore) => {
				conf.apis = {
					revealerApi: getSession().apis.revealerApi,
					stacksApi: getConfig().VITE_STACKS_API
				}
				return conf;
			});
		}
		const stacksInfo = await fetchStacksInfo(stacksApi) || {} as StacksInfo;
		const poxInfo = await getPoxInfo(stacksApi)
		const exchangeRates = await fetchExchangeRates(ecoApi);
		const rateNow = exchangeRates?.find((o:any) => o.currency === 'USD') || defaultExchangeRate();
		settings.currency.myFiatCurrency = rateNow
		sessionStore.update((conf:SessionStore) => {
			conf.stacksInfo = stacksInfo
			conf.poxInfo = poxInfo
			conf.exchangeRates = exchangeRates || [] as Array<ExchangeRate>;
			conf.userSettings = settings
			conf.sbtcInfo = defaultSbtcInformation()
			return conf;
		});


		if (isLoggedIn() ) {
			await addresses(async function(obj:AddressObject) {
				console.log('in callback')
				settings.executiveTeamMember = false
				
				const contractId = getConfig().VITE_SBTC_CONTRACT_ID;
				obj.tokenBalances = await getTokenBalances(stacksApi, obj.stxAddress)
				obj.sBTCBalance = Number(obj.tokenBalances?.fungible_tokens[contractId + '::sbtc']?.balance || 0)
				obj.walletBalances = await getWalletBalances(ecoApi, obj.stxAddress, obj.cardinal, obj.ordinal)

				sessionStore.update((conf:SessionStore) => {
					conf.keySets[getConfig().VITE_NETWORK] = obj
					conf.exchangeRates = exchangeRates || [] as Array<ExchangeRate>;
					conf.userSettings = settings
					return conf;
				});
				updateSbtcInformation()
			})
		}
	
	} catch (err:any) {
		sessionStore.update((conf:SessionStore) => {
			conf.stacksInfo = {} as StacksInfo
			conf.poxInfo = {} as PoxInfo
			if (!conf.keySets || !conf.keySets[network]) {
				if (network === 'testnet'|| network === 'regtest') {
					conf.keySets = { 'testnet': {} as AddressObject };
				} else {
					conf.keySets = { 'mainnet': {} as AddressObject };
				}
			}
			conf.exchangeRates = [] as Array<ExchangeRate>;
			conf.userSettings = settings
			conf.sbtcInfo = defaultSbtcInformation()
			return conf;
		});
	}
}

function defaultSettings():SbtcUserSettingI {
	return {
		useOpDrop: true,
		peggingIn: true,
		debugMode: false,
		executiveTeamMember: false,
		currency: {
		  cryptoFirst: true,
		  myFiatCurrency: defaultExchangeRate(),
		  denomination: 'USD',
		}
	}
}

function defaultSbtcInformation():SbtcInformation {
	return {
		sigData: {},
		sbtcContractData: {
			totalSupply: 0
		} as SbtcContractDataType,
		payloadDepositData: {} as DepositPayloadUIType,
		payloadWithdrawData: {} as WithdrawPayloadUIType
	}
}

function defaultExchangeRate():ExchangeRate {
	return {
		_id: '',
		currency: 'USD',
		fifteen: 0,
		last: 0,
		buy: 0,
		sell: 0,
		symbol: 'USD',
		name: 'BTCUSD'			  
	}
  }

function updateSbtcInformation() {
	const sessStore = getSession()
	if (!sessStore.keySets[getConfig().VITE_NETWORK].btcPubkeySegwit0) throw new Error('Public Key missing from logged in user')
	let prn = sessStore.keySets[getConfig().VITE_NETWORK].stxAddress
	let amountSats = 0
	if (sessStore.sbtcInfo.payloadDepositData && sessStore.sbtcInfo.payloadDepositData.amountSats > 0) {
		amountSats = sessStore.sbtcInfo.payloadDepositData.amountSats
	}
	if (sessStore.sbtcInfo.payloadDepositData && sessStore.sbtcInfo.payloadDepositData.principal) {
		prn = sessStore.sbtcInfo.payloadDepositData.principal
	}
	const payloadDepositData:DepositPayloadUIType = {
			sbtcWalletPublicKey: sessStore.sbtcInfo.sbtcContractData.sbtcWalletPublicKey,
			reclaimPublicKey: sessStore.keySets[getConfig().VITE_NETWORK].btcPubkeySegwit1 || '',
			bitcoinAddress: sessStore.keySets[getConfig().VITE_NETWORK].cardinal,
			paymentPublicKey: sessStore.keySets[getConfig().VITE_NETWORK].btcPubkeySegwit0 || '',
			principal: prn,
			amountSats
	}
	sessStore.sbtcInfo.payloadDepositData = payloadDepositData;

	prn = sessStore.keySets[getConfig().VITE_NETWORK].stxAddress
	amountSats = 0
	if (sessStore.sbtcInfo.payloadWithdrawData && sessStore.sbtcInfo.payloadWithdrawData.principal) {
		prn = sessStore.sbtcInfo.payloadWithdrawData.principal
	}
	if (sessStore.sbtcInfo.payloadWithdrawData && sessStore.sbtcInfo.payloadWithdrawData.amountSats > 0) {
		amountSats = sessStore.sbtcInfo.payloadWithdrawData.amountSats
	}
	const payloadWithdrawData:WithdrawPayloadUIType = {
			sbtcWalletPublicKey: sessStore.sbtcInfo.sbtcContractData.sbtcWalletPublicKey,
			reclaimPublicKey: sessStore.keySets[getConfig().VITE_NETWORK].btcPubkeySegwit1 || '',
			bitcoinAddress: sessStore.keySets[getConfig().VITE_NETWORK].cardinal,
			paymentPublicKey: sessStore.keySets[getConfig().VITE_NETWORK].btcPubkeySegwit0 || '',
			principal: prn,
			amountSats
	}
	sessStore.sbtcInfo.payloadWithdrawData = payloadWithdrawData;
	sessionStore.update((conf:SessionStore) => {
		conf.sbtcInfo = sessStore.sbtcInfo
		return conf;
	});
}
