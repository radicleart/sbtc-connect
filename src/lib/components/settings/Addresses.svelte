<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon, ArrowUpRight } from "svelte-hero-icons"
	import { sessionStore } from '$stores/stores';
	import { truncate, explorerAddressUrl, explorerBtcAddressUrl } from '$lib/utils'
	import { getConfig } from '$stores/store_helpers';

  let connected = false;

	const getContractAddress = () => {
		const contract = $sessionStore.sbtcInfo.sbtcContractData.contractId
		return truncate(contract.split('.')[0], 8) + '.' + contract.split('.')[1]
	}
	const getCoordinator = (full:boolean) => {
		if ($sessionStore?.sbtcContractData?.coordinator) {
			if (full) return $sessionStore.sbtcInfo.sbtcContractData.coordinator?.addr.value
			return truncate($sessionStore?.sbtcContractData?.coordinator?.addr.value, 8)
		}
		return 'not known'
	}
	const getOwner = (full:boolean) => {
		if ($sessionStore?.sbtcContractData?.contractOwner) {
			if (full) return $sessionStore.sbtcInfo.sbtcContractData.contractOwner
			return truncate($sessionStore.sbtcInfo.sbtcContractData.contractOwner, 8)
		}
		return 'not known'
	}
	const getAddress = (full:boolean) => {
		if ($sessionStore?.sbtcContractData?.sbtcWalletAddress) {
			if (full) return $sessionStore.sbtcInfo.sbtcContractData.sbtcWalletAddress
			return truncate($sessionStore.sbtcInfo.sbtcContractData.sbtcWalletAddress, 8).toUpperCase()
		}
		return 'not connected'
	}


  onMount(async () => {
    connected = typeof $sessionStore.sbtcInfo.sbtcContractData.contractId === 'string'
  })
</script>

<h2 class="text-2xl font-medium mb-2">Addresses and contracts</h2>
{#if connected}
<div class="text-base py-1 flex gap-6 items-center">
  <p class="text-white w-1/5">
    sBTC wallet:
  </p>
  <div class="flex bg-black rounded-xl text-white px-4 py-1 font-normal">{getAddress(false)}</div>
  <div class="text-base ml-auto flex items-center">
    <a title="Show in Explorer" href={explorerBtcAddressUrl(getAddress(true))} target="_blank" class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
      <Icon src="{ArrowUpRight}" mini class="h-5 w-5 text-white" aria-hidden="true" />
    </a>
  </div>
</div>
<div class="text-base py-1 flex gap-6 items-center">
  <p class="text-white w-1/5">
    sBTC contract:
  </p>
  <div class="flex bg-black rounded-xl text-white px-4 py-1 font-normal">{getContractAddress()}</div>
  <div class="ml-auto flex items-start">
    <a title="Show in Explorer" href={explorerAddressUrl($sessionStore.sbtcInfo.sbtcContractData.contractId)} target="_blank" class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
      <Icon src="{ArrowUpRight}" mini class="h-5 w-5 text-white" aria-hidden="true" />
    </a>
  </div>
</div>
<div class="text-base py-1 flex gap-6 items-center">
  <p class="text-white w-1/5">
    Contract owner:
  </p>
  <div class="flex bg-black rounded-xl text-white px-4 py-1 font-normal">{getOwner(false)}</div>
  <div class="ml-auto flex items-start">
    <a title="Show in Explorer" href={explorerAddressUrl(getOwner(true))} target="_blank" class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
      <Icon src="{ArrowUpRight}" mini class="h-5 w-5 text-white" aria-hidden="true" />
    </a>
  </div>
</div>
<div class="py-1 flex gap-6 items-center">
  <p class="text-white w-1/5">
    Coordinator:
  </p>
  <div class="flex bg-black rounded-xl text-white px-4 py-1 font-normal">{getCoordinator(false)}</div>
  <div class="ml-auto flex items-start">
    <a title="Show in Explorer" href={explorerAddressUrl(getOwner(true))} target="_blank" class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
      <Icon src="{ArrowUpRight}" mini class="h-5 w-5 text-white" aria-hidden="true" />
    </a>
  </div>
</div>
{:else}
  <div class="text-base py-1 flex gap-6 items-center">
    <p class="text-white w-1/5">
      sBTC wallet:
    </p>
    <div class="flex bg-black rounded-xl text-white px-4 py-1 font-normal">Not connected</div>
  </div>
{/if}