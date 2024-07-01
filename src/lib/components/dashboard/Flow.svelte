<script lang="ts">
	import { sessionStore } from '$stores/stores';
  import { Skeleton, Tabs, TabItem } from 'flowbite-svelte';
  import { page } from "$app/stores";
	import DepositReturn from './DepositReturn.svelte';
	import Withdraw from './Withdraw.svelte';
	import DepositDrop from './DepositDrop.svelte';
	import { onMount } from 'svelte';
	import { getConfig } from '$stores/store_helpers';
  import Banner from '$lib/components/shared/Banner.svelte';
  import { isLoggedIn } from '@mijoco/stx_helpers/dist/index';

  let errorMessage:string|undefined;
  let inited = false;
  let connected = false;

  $: opDrop = $sessionStore.userSettings.useOpDrop;
  let useDeposit = $sessionStore.userSettings.peggingIn;
  if ($page.route.id === '/withdrawals') useDeposit = false

  const toggle = () => {
    $sessionStore.userSettings.peggingIn = !$sessionStore.userSettings.peggingIn;
    sessionStore.update(() => $sessionStore)
  }

  const getMainMessage = () => {
    if (isLoggedIn()) {
      if (getConfig().VITE_NETWORK !== 'devnet') {
        return 'sBTC is not yet deployed on <strong>' + getConfig().VITE_NETWORK+ '</strong> switch to devnet (in settings) to continue'
      } else {
        return 'sBTC on <strong>' + getConfig().VITE_NETWORK+ '</strong>'
      }
    } else {
      return 'Connect wallet to continue'
    }
  }

  const initData = () => {
    if (!$sessionStore.sbtcInfo.payloadDepositData.amountSats) {
      $sessionStore.sbtcInfo.payloadDepositData.amountSats = 10000
    }
    if (!$sessionStore.sbtcInfo.payloadDepositData.principal) {
      $sessionStore.sbtcInfo.payloadDepositData.principal = $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress
    }
    if (!$sessionStore.sbtcInfo.payloadDepositData.bitcoinAddress) {
      $sessionStore.sbtcInfo.payloadDepositData.bitcoinAddress = $sessionStore.keySets[getConfig().VITE_NETWORK].cardinal
    }
    if (!$sessionStore.sbtcInfo.payloadWithdrawData.amountSats) {
      $sessionStore.sbtcInfo.payloadWithdrawData.amountSats = 10000
    }
    if (!$sessionStore.sbtcInfo.payloadWithdrawData.principal) {
      $sessionStore.sbtcInfo.payloadWithdrawData.principal = $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress
    }
    if (!$sessionStore.sbtcInfo.payloadWithdrawData.bitcoinAddress) {
      $sessionStore.sbtcInfo.payloadWithdrawData.bitcoinAddress = $sessionStore.keySets[getConfig().VITE_NETWORK].cardinal
    }
    sessionStore.update(() => $sessionStore)
  }

  onMount(async () => {
    try {
      connected = typeof $sessionStore.sbtcInfo.sbtcContractData.contractId === 'string'
      initData()
      inited = true;
    } catch(err:any) {
      errorMessage = err.message
    }
  })

</script>

<div class="sm:col-span-3 order-1 lg:order-2">
  <div class="flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 overflow-hidden bg-gray-1000">
    {#if !connected || !isLoggedIn()}
	    <Banner
		    bannerType={'info'}
		    message={getMainMessage()}
      />
    {:else}
      {#if errorMessage}
        <div>{@html errorMessage}</div>
      {:else}
        {#if inited}
          <Tabs style="underline" contentClass="py-4">
            <TabItem open={useDeposit} on:click={() => toggle()} title="Deposit" class="grow [&>button]:w-full [&>button]:text-lg">
              {#if opDrop}
                <DepositDrop />
              {:else}
                <DepositReturn />
              {/if}
            </TabItem>
            <TabItem open={!useDeposit} on:click={() => toggle()} title="Withdraw" class="grow [&>button]:w-full [&>button]:text-lg">
              <Withdraw />
            </TabItem>
          </Tabs>
        {:else}
          <Tabs style="underline" contentClass="mt-8">
            <TabItem open={true} title="Deposit" class="grow [&>button]:w-full [&>button]:text-lg">
              <Skeleton size="md" />
            </TabItem>
            <TabItem title="Withdraw" class="grow [&>button]:w-full [&>button]:text-lg">
              <Skeleton size="md" />
            </TabItem>
          </Tabs>
        {/if}
      {/if}
    {/if}
  </div>
</div>



