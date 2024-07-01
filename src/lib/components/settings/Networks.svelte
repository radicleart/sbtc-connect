<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon, InformationCircle } from "svelte-hero-icons"
	import { Button } from 'flowbite-svelte'
	import { sessionStore } from '$stores/stores';
	import type { SessionStore } from '$types/local_types';
	import { fetchSbtcBalance } from '$lib/stacks_connect'
	import Banner from '$lib/components/shared/Banner.svelte';
	import { getConfig } from '$stores/store_helpers';
	import { setConfig, switchConfig } from '$stores/stores_config';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let mode = import.meta.env.MODE
	let network = getConfig().VITE_NETWORK
    //if (!mode) mode = 'testnet'

	const switchDevnet = async () => {
		switchConfig('devnet');
		await fetchSbtcBalance($sessionStore, true);
		sessionStore.update((conf:SessionStore) => {
			return conf;
		});
		const url = new URL(location.href);
		if (mode === 'simnet') {
			url.searchParams.set('chain', 'testnet');
		} else {
			url.searchParams.set('chain', 'devnet');
		}
		location.assign(url.search);
	}

	const switchDevenv = async () => {
		switchConfig('devnet');
		await fetchSbtcBalance($sessionStore, true);
		sessionStore.update((conf:SessionStore) => {
			return conf;
		});
		const url = new URL(location.href);
		url.searchParams.set('chain', 'devenv');
		location.assign(url.search);
	}

	const toggleNetwork = async (net:string) => {
		$page.url.searchParams.delete('chain')
		$page.url.searchParams.append('chain', net)
		//goto($page.url)
		location.assign($page.url);
	}

  onMount(async () => {
  })
</script>

<h2 class="text-2xl font-medium mb-2">Network</h2>
<div class="flex gap-2 mb-2 items-center">
  <p class="text-base text-white font-extralight">
    You are currently on:
  </p>
  <p class="text-white font-normal">
		<span class="inline-flex bg-black rounded-xl text-white px-4 py-1 font-normal">
      {getConfig().VITE_NETWORK}
    </span>
  </p>
  <div id="po-network" class="">
		<Icon src="{InformationCircle}" class="text-white w-6 h-6" mini aria-hidden="true" />
  </div>
</div>

{#if getConfig().VITE_NETWORK === "testnet"}
	<Banner
		bannerType={'info'}
		message={'Don\'t have testnet Bitcoin? <a class="underline" href="https://bitcoinfaucet.uo1.net/" target="_blank">Get some to get started!</a>'}
	/>
{/if}

<div class="mt-4">
	<!--
	<Button on:click={() => toggleNetwork()} class="block w-full md:w-auto md:inline-flex items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-lg border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
		Switch network
	</Button>
	-->
	<div class="mt-4">
	{#if network !== 'devnet'}
	<Button on:click={() => toggleNetwork('devnet')} class="text-center font-medium focus:ring-4 focus:outline-none items-center px-5 py-2.5 text-sm text-white focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg !bg-black !border-[0.5px] !border-gray-700">
		Switch to devnet
	</Button>
	{/if}
	{#if network !== 'testnet'}
	<Button on:click={() => toggleNetwork('testnet')} class="text-center font-medium focus:ring-4 focus:outline-none items-center px-5 py-2.5 text-sm text-white focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg !bg-black !border-[0.5px] !border-gray-700">
		Switch to testnet
	</Button>
	{/if}
	{#if network !== 'mainnet'}
	<Button on:click={() => toggleNetwork('mainnet')} class="text-center font-medium focus:ring-4 focus:outline-none items-center px-5 py-2.5 text-sm text-white focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg !bg-black !border-[0.5px] !border-gray-700">
		Switch to mainnet
	</Button>
	{/if}
	</div>
  </div>


