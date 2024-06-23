<script lang="ts">
	import '../app.postcss';
	import "../sbtc.css";
	import Header from "$lib/header/Header.svelte";
	import Footer from "$lib/header/Footer.svelte";
	import { setConfig } from '$lib/config';
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '$stores/stores'
	import { COMMS_ERROR, tsToTime } from '$lib/utils.js'
	import { loginStacksFromHeader } from '@mijoco/stx_helpers/dist/index';
	import { initAddresses, initApplication, isLegal } from '$lib/stacks_connect';

	let componentKey = 0;
	let componentKey1 = 0;
	console.log('process.env: ', import.meta.env);
	setConfig($page.url.search);
	const search = $page.url.search;
	if (!isLegal(location.href)) {
		//componentKey++;
		goto('/' + '?chain=testnet')
	}
	beforeNavigate((nav) => {
		if (!isLegal(nav.to?.route.id || '')) {
			nav.cancel();
			login()
			return;
		}
		const next = (nav.to?.url.pathname || '') + (nav.to?.url.search || '');
		if (nav.to?.url.search.indexOf('testnet') === -1 && search.indexOf('chain=testnet') > -1) {
			nav.cancel();
			goto(next + '?chain=testnet')
		} else if (nav.to?.url.search.indexOf('devnet') === -1 && search.indexOf('chain=devnet') > -1) {
			nav.cancel();
			goto(next + '?chain=devnet')
		}
		console.debug('beforeNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	afterNavigate((nav) => {
		//componentKey++;
		console.debug('afterNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	const unsubscribe = sessionStore.subscribe((conf) => {});
	onDestroy(unsubscribe);
	let inited = false;
	let errorReason:string|undefined;

	const login = async () => {
		const res = await loginStacksFromHeader(document)
	}

	const loginEvent = () => {
		componentKey++;
		componentKey1++;
	}

	const initApp = async () => {
		await initAddresses();
		await initApplication($sessionStore.userSettings);
	}

	onMount(async () => {
		try {
			initApp();
			inited = true;
		} catch (err) {
			errorReason = COMMS_ERROR
			console.log(err)
		}
	})
</script>
	<div class="bg-gray-1000 bg-[url('$lib/assets/bg-lines.svg')] bg-cover text-white font-extralight min-h-screen">
		{#if inited}
		<Header on:login_event={loginEvent} />
		<div class="min-h-[calc(100vh-160px)] mx-auto px-6">
			{#key componentKey1}
				<slot></slot>
			{/key}
		</div>
		<Footer />
		{/if}
	</div>
