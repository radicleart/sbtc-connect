<script lang="ts">
  import { onMount } from "svelte";
	import DepositHeader from './shared/DepositHeader.svelte';
	import Timeline from './shared/Timeline.svelte';
  import Banner from '$lib/components/shared/Banner.svelte';
	import { sessionStore } from '$stores/stores';
	import { getConfig } from '$stores/store_helpers';
	import type { SessionStore } from '$types/local_types';
	import DepositForm from './shared/DepositForm.svelte';
	import { goto } from '$app/navigation';
	import StatusCheck from "./dd/StatusCheck.svelte";
	import SignTransaction from "./dr/SignTransaction.svelte";
	import { bitcoinBalanceFromMempool } from "$lib/utils";
	import { MINIMUM_DEPOSIT } from "$lib/revealer_api";
	import { isLoggedIn, loginStacksFromHeader, verifyStacksPricipal } from "@mijoco/stx_helpers/dist/index";
	import { verifyAmount } from "$lib/stacks_connect";

  const cardinal = $sessionStore.keySets[getConfig().VITE_NETWORK].cardinal;
  const bal = bitcoinBalanceFromMempool($sessionStore.keySets[getConfig().VITE_NETWORK].cardinalInfo)
  let bitcoinAddress:string; // provides utxo - most likely current wallet cardinal
  let recipient:string;      //
  let amountSats:number;
  let paymentPublicKey = $sessionStore.keySets[getConfig().VITE_NETWORK].btcPubkeySegwit1!;

  let error:string|undefined;
  let showAddresses = false;
  $: timeLineStatus = 1;
  $: opReturn = !$sessionStore.userSettings.useOpDrop;
  //let peginRequest:BridgeTransactionType;
  let componentKey = 0;
  let amountErrored:string|undefined = undefined;

  const invoice = async () => {
    try {
      verifyAmount($sessionStore.sbtcInfo.payloadDepositData.amountSats, bal);
      verifyStacksPricipal($sessionStore.sbtcInfo.payloadDepositData.principal)
      const conf:SessionStore = $sessionStore;
      sessionStore.update(() => conf);
      bitcoinAddress = ($sessionStore.sbtcInfo.payloadDepositData?.bitcoinAddress) ? $sessionStore.sbtcInfo.payloadDepositData?.bitcoinAddress : cardinal;
      recipient = ($sessionStore.sbtcInfo.payloadDepositData.principal) ? $sessionStore.sbtcInfo.payloadDepositData?.principal : $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress;
      amountSats = $sessionStore.sbtcInfo.payloadDepositData.amountSats;
      timeLineStatus = 2;
      componentKey++;
    } catch(err:any) {
      error = err.message
    }
  }

  const doClicked = async (event:any) => {
    const button = event.detail;
    if (button.target === 'back') {
      timeLineStatus = 1;
    } else if (button.target === 'status-check') {
      timeLineStatus = 3;
    } else if (button.target === 'transaction-history') {
      goto('/transactions')
    }
  }

  const updateTimeline = (evt:any) => {
    if (evt.detail.timeline === 2) {
      invoice()
    } else {
      componentKey++;
      timeLineStatus = evt.detail.timeline;
    }
  }

  const login = async () => {
		const res = await loginStacksFromHeader(document)
    timeLineStatus = 1
	}

  const handleAmountEvent = (e:any) => {
    const event = e.detail
    amountErrored = event.reason;
  }

  onMount(async () => {
    paymentPublicKey = $sessionStore.keySets[getConfig().VITE_NETWORK].btcPubkeySegwit0!
    if (!isLoggedIn()) timeLineStatus = -1
  })

</script>

<DepositHeader />
<div class="bg-white/5 rounded-md p-4 border border-gray-900">
  {#key componentKey}
  {#if timeLineStatus === -1}
    <div class="mt-4">
      <button on:click={() => login()} class="text-center focus:ring-4 focus:outline-none justify-center text-base hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800 inline-flex w-full items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-xl border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">Connect wallet</button>
    </div>
  {:else if opReturn && (bal <= MINIMUM_DEPOSIT)}
    <Banner
      bannerType={'info'}
      message={'You don\'t have any BTC in your wallet.<br/> Don\'t have testnet Bitcoin? <a class="underline" href="https://bitcoinfaucet.uo1.net/" target="_blank">Get some to get started!</a>'}/>
  {:else}
    <Timeline active={timeLineStatus} confirm={false} on:update_timeline={updateTimeline}/>
    {#if timeLineStatus === 1}
    <DepositForm {showAddresses} on:amount_event={handleAmountEvent}/>
    <div class="mt-4">
      <button title={'Click to generate payment code'} on:click={() => invoice()} class="text-center focus:ring-4 focus:outline-none justify-center text-base hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800 inline-flex w-full items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-xl border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
        Continue
      </button>
    </div>
    {:else if timeLineStatus === 2}
    <SignTransaction {bitcoinAddress} {recipient} {amountSats} on:update_timeline={updateTimeline}/>
    {:else if timeLineStatus === 3}
    <StatusCheck status={2} requestType={'deposit'} on:clicked={doClicked}/>
    {/if}
  {/if}
  {/key}
</div>
