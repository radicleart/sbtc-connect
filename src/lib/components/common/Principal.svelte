<script lang="ts">
import { getConfig } from '$stores/store_helpers';
import { createEventDispatcher } from "svelte";
import { sessionStore } from '$stores/stores';

export let principalData:{ label:string, info:string, currentAddress:string|undefined };

const network = getConfig().VITE_NETWORK;
const dispatch = createEventDispatcher();
let stxAddress:string|undefined = principalData.currentAddress;
const mainReason = 'Please enter a valid stacks blockchain ' + network + ' address';
let reason:string|undefined = mainReason;
let errored = false;

const changeStxAddress = async () => {
  errored = false;
  try {
    dispatch('principal_updated', { error: false, currentAddress: stxAddress });
  } catch(err:any) {
    errored = true;
    reason = err||'Error - is the address a valid';
    dispatch('principal_updated', { error: true, reason });
    return;
  }
}
</script>

<div class="row">
  <div class="col">
    <label for="transact-path" class="d-flex justify-content-between">
      <span>{principalData.label}</span>
      <span class="pointer text-info" data-bs-toggle="tooltip-ftux" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Your Stacks address. The equivalent amount of sBTC will be sent to this wallet"></span>
    </label>
    <input type="text" id="from-address" class="form-control form-inline" autocomplete="off" bind:value={stxAddress} on:input={() => changeStxAddress()} />
    <div class="d-flex justify-content-between text-small text-info">
      <div class="text-small text-white">{principalData.info}</div>
      {#if stxAddress !== $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress}
      <div><a href="/" class="" on:click|preventDefault={() => { stxAddress = $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress; changeStxAddress() }}>mine</a></div>
      {/if}
    </div>
    {#if errored && stxAddress && stxAddress.length > 0}<div class="text-warning">{reason}</div>{/if}
  </div>
</div>

<style>
</style>