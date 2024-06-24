<script lang="ts">
	import '../app.postcss';
	import "../sbtc.css";
	import Footer from "$lib/header/Footer.svelte";
	import { beforeNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '$stores/stores'
	import { COMMS_ERROR } from '$lib/utils.js'
	import { loginStacksFromHeader } from '@mijoco/stx_helpers/dist/index';
	import { initApplication, initDefaultConfig, isLegal } from '$lib/stacks_connect';
	import HeaderFromComponents from '$lib/header/HeaderFromComponents.svelte';
	import { configStore, setConfig } from '$stores/stores_config';
	import { getConfig } from '$stores/store_helpers';

	const unsubscribe1 = configStore.subscribe(() => {});
	const unsubscribe2 = sessionStore.subscribe(() => {});
	onDestroy(unsubscribe1);
	onDestroy(unsubscribe2);
	let inited = false;
	let errorReason:string|undefined;
	let componentKey = 0;
	let componentKey1 = 0;
	const chain = $page.url.searchParams.get('chain')
	setConfig(chain);
	if (!isLegal(location.href)) {
		//componentKey++;
		goto('/' + '?chain=' + getConfig().VITE_NETWORK)
	}
	beforeNavigate((nav) => {
		if (!isLegal(nav.to?.route.id || '')) {
			nav.cancel();
			login()
			return;
		}
		const sp = nav.to?.url.searchParams
		if (!sp || !sp.has('chain')) {
			if (nav.to) {
				nav.to?.url.searchParams.append('chain', getConfig().VITE_NETWORK)
				nav.cancel();
				goto(nav.to.url)
			}
		}
		console.debug('beforeNavigate: ' + nav.to?.route.id + ' : ' + getConfig().VITE_NETWORK)
	})


	const login = async () => {
		const res = await loginStacksFromHeader(document)
	}

	const loginEvent = () => {
		componentKey++;
		componentKey1++;
	}

	const initApp = async () => {
		await initApplication($sessionStore.userSettings);
	}

	onMount(async () => {
		try {
			initDefaultConfig();
			inited = true;
			await initApp();
		} catch (err) {
			errorReason = COMMS_ERROR
			console.log(err)
		}
	})
</script>
	<div class="bg-gray-1000 bg-[url('$lib/assets/bg-lines.svg')] bg-cover text-white font-extralight min-h-screen">
		{#if inited}
		<HeaderFromComponents/>
		<div class="min-h-[calc(100vh-160px)] mx-auto px-6">
			{#key componentKey1}
				<slot></slot>
			{/key}
		</div>
		<Footer />
		{/if}
	</div>
