<script lang="ts">
  import { onMount } from "svelte";
  import Banner from '$lib/components/shared/Banner.svelte';
	import Timeline from './shared/Timeline.svelte';
	import WithdrawHeader from './shared/WithdrawHeader.svelte';
	import { sessionStore } from "$stores/stores";
	import type { SessionStore } from "$types/local_types";
	import WithdrawForm from "./shared/WithdrawForm.svelte";
	import { goto } from "$app/navigation";
	import SignTransaction from "./wr/SignTransaction.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { getDataToSign, isLoggedIn, loginStacksFromHeader } from "@mijoco/stx_helpers/dist/index";
	import { signMessage, verifySBTCAmount } from "$lib/stacks_connect";

  let amountErrored:string|undefined = undefined;
  let withdrawalRecipient:string;
  let withdrawalSignature:string;
  let withdrawalAmountSats:number;

  const updateTimeline = (evt:any) => {
    if (evt.detail.timeline === 2) {
      invoice()
    } else {
      componentKey++;
      timeLineStatus = evt.detail.timeline;
    }
  }

  const invoice = async () => {
    try {
      withdrawalRecipient = $sessionStore.sbtcInfo.payloadWithdrawData.bitcoinAddress;
      withdrawalAmountSats = $sessionStore.sbtcInfo.payloadWithdrawData.amountSats;
      verifySBTCAmount(withdrawalAmountSats, $sessionStore.keySets[getConfig().VITE_NETWORK].sBTCBalance, 0);
      const niceMessage = getDataToSign(getConfig().VITE_NETWORK, withdrawalAmountSats, $sessionStore.keySets[getConfig().VITE_NETWORK].cardinal);
      console.log('getDataToSign: ' + niceMessage)
      await signMessage(async function(sigData:any, message:string) {
        withdrawalSignature = sigData.signature;
        const conf:SessionStore = $sessionStore;
        conf.sbtcInfo.sigData = sigData.signature;
        sessionStore.update(() => conf);
        timeLineStatus = 2;
      }, niceMessage);
    } catch(err:any) {
      amountErrored = 'Please enter an amount - no more than your current sBTC balance.'
      //makeFlash(document.getElementById('amount-btcamount'))
    }
  }

  let sBTCBalance = $sessionStore.keySets[getConfig().VITE_NETWORK].sBTCBalance;
  let showAddresses = false;
  $: timeLineStatus = 1;
  let componentKey = 0;

  const login = async () => {
		const res = loginStacksFromHeader(document)
    timeLineStatus = 1
	}

  const updateTransaction = () => {
    timeLineStatus = 1;
    componentKey++;
  }

  const doClicked = async (event:any) => {
    amountErrored = undefined;
    const button = event.detail;
    if (button.target === 'back') {
      timeLineStatus = 1;
    } else if (button.target === 'status-check') {
      timeLineStatus = 3;
      goto('/transactions/1') // + peginRequest._id);
    } else if (button.target === 'transaction-history') {
      goto('/transactions')
    }
  }

  const handleAmountEvent = (e:any) => {
    const event = e.detail
    amountErrored = event.reason;
  }


  onMount(async () => {
    if (!isLoggedIn()) timeLineStatus = -1
  })

</script>

<WithdrawHeader />

<div class="bg-white/5 rounded-md p-4 border border-gray-900">
  {#key componentKey}
    {#if timeLineStatus === -1}
      <button on:click={() => login()} class="text-center focus:ring-4 focus:outline-none justify-center text-base hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800 inline-flex w-full items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-xl border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">Connect wallet</button>
    {:else if !sBTCBalance}
      <Banner
        bannerType={'info'}
        message={'You don\'t have any sBTC in your wallet.<br/> Don\'t have testnet Bitcoin? <a class="underline" href="https://bitcoinfaucet.uo1.net/" target="_blank">Get some to get started!</a>'}
      />
    {:else}
      <Timeline active={timeLineStatus} confirm={false} on:update_timeline={updateTimeline}/>

      {#if timeLineStatus === 1}
      <WithdrawForm {showAddresses} on:amount_event={handleAmountEvent}/>
      <div class="mt-4">
        <button style={(amountErrored) ? '' : ''} title={(amountErrored) ? amountErrored : 'Click to continue'} on:click={() => invoice()} class="text-center focus:ring-4 focus:outline-none justify-center text-base hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800 inline-flex w-full items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-xl border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">Continue</button>
      </div>
      {#if typeof amountErrored === 'string' && amountErrored !== 'undefined'}
      <div class="mt-4">
        {amountErrored}
      </div>
      {/if}
      {:else}
        <SignTransaction {withdrawalRecipient} {withdrawalAmountSats} {withdrawalSignature} on:update_timeline={updateTransaction}/>
      {/if}
    {/if}
  {/key}
</div>



