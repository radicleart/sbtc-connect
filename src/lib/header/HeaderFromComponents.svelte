<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { addRouterInfo, fmtNumber } from '$lib/utils';
	import { isLoggedIn, logUserOut, loginStacks } from '@mijoco/stx_helpers/dist/account';
	import { sessionStore } from "$stores/stores";
	import { getConfig } from "$stores/store_helpers";
	import type { HeaderLink } from "$types/local_types";
	import type { AddressObject, DepositPayloadUIType, WithdrawPayloadUIType } from "@mijoco/stx_helpers";
	import { disconnect } from "@stacks/connect";
	import { goto } from "$app/navigation";
	import Header from "./Header.svelte";

	const dispatch = createEventDispatcher();

	const keys = ($sessionStore.keySets) ? $sessionStore.keySets[getConfig().VITE_NETWORK] : undefined;
	let loggedIn = isLoggedIn();
	let heights = {
		stacksHeight: fmtNumber($sessionStore.stacksInfo?.stacks_tip_height || 0) || '0', 
		bitcoinHeight: fmtNumber($sessionStore.stacksInfo?.burn_block_height || 0) || '0'
	};
	let account = {
		stxAddress:keys?.stxAddress || 'unknown', 
		cardinal:keys?.cardinal || 'unknown', 
		ordinal:keys?.ordinal || 'unknown' , 
		bnsNameInfo: keys?.bnsNameInfo
	};
	let balances = {
		sbtcBalance: (keys && keys.walletBalances && keys.sBTCBalance) ? fmtNumber(keys.sBTCBalance) : '0.0',
		cardinalBalance: (keys && keys.walletBalances && keys.walletBalances.cardinal) ? fmtNumber(keys.walletBalances.cardinal.amount) : '0.0',
		ordinalBalance: (keys && keys.walletBalances && keys.walletBalances.cardinal) ? fmtNumber(keys.walletBalances.ordinal.amount) : '0.0',
		stacksBalance: (keys && keys.walletBalances && keys.walletBalances.cardinal) ? fmtNumber(keys.walletBalances.stacks.amount) : '0.0',
	}


	let headerLinks:Array<HeaderLink> = []
	addRouterInfo(headerLinks, '/');
	addRouterInfo(headerLinks, '/transactions');
	addRouterInfo(headerLinks, '/how-it-works');
	addRouterInfo(headerLinks, '/faq');
	addRouterInfo(headerLinks, '/proofs');

	const loginEvent = async (e?:any) => {
		console.log('update for login', e.target)
		await loginStacks(function() {
			console.log('update for login')
			loggedIn = isLoggedIn();
		})
	}

	const logoutEvent = async () => {
		logUserOut();
		loggedIn = isLoggedIn();
		$sessionStore.sbtcInfo.payloadDepositData = {} as DepositPayloadUIType
		$sessionStore.sbtcInfo.payloadWithdrawData = {} as WithdrawPayloadUIType
		$sessionStore.keySets[getConfig().VITE_NETWORK] = {} as AddressObject;
		await sessionStore.update(() => $sessionStore)
		dispatch('login_event');
		disconnect()
		setTimeout(function() {
			goto('/')
		}, 100)
	}

	const networkSwitchEvent = async () => {
	}

	const copyEvent = async () => {
	}
	
	onMount(async () => {
		try {
			//heights = {stacksHeight: '' + fmtNumber($sessionStore.stacksInfo?.stacks_tip_height) || '0', bitcoinHeight: '' + fmtNumber($sessionStore.stacksInfo?.burn_block_height) || '0'};
		} catch (err) {
			console.log(err)
		}
	})

</script>

<Header {headerLinks} {loggedIn} {heights} {account} {balances} on:do_login={loginEvent} on:do_logout={logoutEvent} on:do_copy={copyEvent} on:switch_network={networkSwitchEvent}/>
