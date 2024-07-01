<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon, InformationCircle } from "svelte-hero-icons";
	import { Button } from 'flowbite-svelte'
	import Banner from '$lib/components/shared/Banner.svelte';
	import { getConfig } from '$stores/store_helpers';
	import { config } from '$lib/config';
	import { configStore } from '$stores/stores_config';
	import { sessionStore } from '$stores/stores';

	const toggleApis = async (net:string) => {
		sessionStore.update((conf) => {
			conf.apis.revealerApi = config[net].VITE_REVEALER_API;
			conf.apis.stacksApi = config[net].VITE_STACKS_API;
			return conf
		})
	}

  onMount(async () => {
  })
</script>

<h2 class="text-2xl font-medium mb-2">Network: {$configStore.VITE_NETWORK}</h2>
<div class="flex gap-2 mb-2 items-center">
	<p class="text-base text-white font-extralight">
	  Stacks API:
	</p>
	<p class="text-white font-normal">
		  <span class="inline-flex bg-black rounded-xl text-white px-4 py-1 font-normal">
		{$sessionStore.apis.stacksApi}
	  </span>
	</p>
  </div>
  <div class="flex gap-2 mb-2 items-center">
	<p class="text-base text-white font-extralight">
	  Application API:
	</p>
	<p class="text-white font-normal">
		  <span class="inline-flex bg-black rounded-xl text-white px-4 py-1 font-normal">
		{$sessionStore.apis.revealerApi}
	  </span>
	</p>
  </div>
	  
{#if getConfig().VITE_NETWORK === "testnet"}
	<Banner
		bannerType={'info'}
		message={'Don\'t have testnet Bitcoin? <a class="underline" href="https://bitcoinfaucet.uo1.net/" target="_blank">Get some to get started!</a>'}
	/>
{/if}

<div class="mt-4">

	<div class="mt-4">
	<Button on:click={() => toggleApis('devnet')} class="text-center font-medium focus:ring-4 focus:outline-none items-center px-5 py-2.5 text-sm text-white focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg !bg-black !border-[0.5px] !border-gray-700">
		Switch to localhost
	</Button>
	<Button on:click={() => toggleApis('testnet')} class="text-center font-medium focus:ring-4 focus:outline-none items-center px-5 py-2.5 text-sm text-white focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg !bg-black !border-[0.5px] !border-gray-700">
		Switch to testnet
	</Button>
	<Button on:click={() => toggleApis('mainnet')} class="text-center font-medium focus:ring-4 focus:outline-none items-center px-5 py-2.5 text-sm text-white focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg !bg-black !border-[0.5px] !border-gray-700">
		Switch to mainnet
	</Button>
	</div>

  </div>


