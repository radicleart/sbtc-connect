<script lang="ts">
	import { onMount } from 'svelte';
	import BitcoinInput from '$lib/components/dashboard/shared/BitcoinInput.svelte';
	import StacksAddressField from '$lib/components/dashboard/shared/StacksAddressField.svelte';
	import BitcoinAddressField from '$lib/components/dashboard/shared/BitcoinAddressField.svelte';
	import { sessionStore } from '$stores/stores';
	import { getConfig } from '$stores/store_helpers';
	import { fmtNumber, satsToBitcoin } from '$lib/utils';

  export let showAddresses = false;

  onMount(async () => {
  })

</script>

  <div class="mt-6 space-y-5">
    <div>
      <p class="text-sm my-5 font-extralight text-gray-400">
        Please input the amount of BTC you wish to withdraw - up to
        {fmtNumber(satsToBitcoin($sessionStore.keySets[getConfig().VITE_NETWORK].sBTCBalance))} <span class="">sBTC</span>.
        The withdrawal will go to your bitcoin address in your web wallet - or specify <span class="cursor-pointer underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 focus:ring-4 focus:outline-none" role="button" tabindex="0" on:keyup on:click={() => showAddresses = !showAddresses}>a different address if preferred</span>.
        </p>
    </div>
    {#if showAddresses}
    <BitcoinAddressField depositFlow={false} readonly={false}/>
    <!--
    <StacksAddressField depositFlow={false} readonly={true}/>
    -->
    {/if}
    <BitcoinInput depositFlow={false} on:amount_event/>
  </div>
