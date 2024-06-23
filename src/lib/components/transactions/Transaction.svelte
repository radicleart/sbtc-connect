<script lang="ts">
	import { explorerBtcTxUrl, explorerTxUrl, getNet, getStatusAsWord } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as btc from '@scure/btc-signer';
	import { hex } from '@scure/base';
	import { getConfig } from '$stores/store_helpers';
	import { RevealerTxTypes, type RevealerTransaction, CommitmentStatus, RevealerTxModes, isLoggedIn } from '@mijoco/stx_helpers/dist/index';
	import Payload from './Payload.svelte';
	import { sessionStore } from '$stores/stores';
	import { isCoordinator } from '$lib/sbtc_admin';
	import TransactionAnalysis from '../admin/TransactionAnalysis.svelte';
	import { getAddressFromOutScript, getPegWalletAddressFromPublicKey } from '@mijoco/stx_helpers/dist/index';
	
	const coordinator = (isLoggedIn() && $sessionStore.keySets[getConfig().VITE_NETWORK]) ? isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) : undefined;

	export let transaction:RevealerTransaction;
	let sbtcWalletPubKey:string;
	let sbtcWalletAddress:string;
	let data:any;
	let inited= false;
	let bitcoinAddress:string;

	const formattedType = () => {
		if (transaction.type === RevealerTxTypes.SBTC_DEPOSIT) return 'sBTC Deposit'
		else return 'sBTC Withdrawal'
	}
	
	onMount(async () => {
		if (transaction.type === RevealerTxTypes.SBTC_DEPOSIT) {
			if (transaction.mode === RevealerTxModes.OP_DROP && transaction.commitment) {
				const walletPubKey = btc.Script.decode(hex.decode(transaction.commitment.leaves[0].script));
				sbtcWalletPubKey = hex.encode(walletPubKey[2] as Uint8Array)
				sbtcWalletAddress = getPegWalletAddressFromPublicKey(getConfig().VITE_NETWORK, sbtcWalletPubKey) || ''
				data = hex.encode(walletPubKey[0] as Uint8Array)
			} else {
				// op return deposit
			}
			bitcoinAddress = transaction.paymentAddress
		} else {
			let btcTx;
			try {
				btcTx = btc.Transaction.fromPSBT(hex.decode(transaction.psbt!), {allowUnknowInput:true, allowUnknowOutput: true, allowUnknownOutputs: true, allowUnknownInputs: true})
			} catch (err:any) {
				btcTx = btc.Transaction.fromRaw(hex.decode(transaction.psbt!), {allowUnknowInput:true, allowUnknowOutput: true, allowUnknownOutputs: true, allowUnknownInputs: true})
			}
			const bitcoinAddressOut = btcTx.getOutput(1)
			//const bitcoinAddressOutScript = btc.OutScript.decode(bitcoinAddressOut.script!);
			bitcoinAddress = getAddressFromOutScript(getConfig().VITE_NETWORK, bitcoinAddressOut.script!)

			const sbtcOutput = btcTx.getOutput(2)
			const outputScript = btc.OutScript.decode(sbtcOutput.script!);
			if (outputScript.type === 'pk' || outputScript.type === 'tr') {
				const net = getNet()
				sbtcWalletPubKey = hex.encode(outputScript.pubkey)
				sbtcWalletAddress = btc.Address(net).encode({
					type: outputScript.type,
					pubkey: outputScript.pubkey,
				});
			}
			data = hex.encode(btcTx.getOutput(0).script!.subarray(3))
		}
		inited = true
	})
	
	</script>
	
	{#if inited}
	<div class="break-words flex flex-col gap-y-3 w-full my-4 font-extralight text-gray-300">
		<div class="flex justify-between">
			<div class="w-5/5 text-2xl">{formattedType()}
				{#if transaction.mode === RevealerTxModes.OP_DROP}
				(two phase commit/reveal)
				{:else}
				(single phase)
				{/if}
			</div>
		</div>
		<!--
		<div class="flex ">
			<div class="w-1/5">sBTC public key:</div>
			<div class="w-4/5"><p class="">{sbtcWalletPubKey}</p></div>
		</div>
		-->
		<div class="flex ">
			<div class="w-1/5">sBTC address:</div>
			<div class="w-4/5"><p class="">{sbtcWalletAddress}</p></div>
		</div>
		<div class="flex">
			<div class="w-1/5">Status:</div>
			<div class="w-4/5 ">{getStatusAsWord(transaction.status)}</div>
		</div>
	  	<div class="flex">
			<div class="w-1/5">Stacks Tx:</div>
			<div class="w-4/5">
			{#if transaction.originator}
			<a class="" href={explorerTxUrl(transaction.originator)} target="_blank" rel="noreferrer">{(transaction.originator)}</a>
			{:else}
			Not yet minted
			{/if}
			</div>
		</div>
		<div class="flex">
			<div class="w-1/5">Payment Tx:</div>
			{#if transaction.status === CommitmentStatus.UNPAID}
			<div class="w-4/5 ">unpaid</div>
			{:else}
			<div class="w-4/5 "><a class="" href={explorerBtcTxUrl(transaction.txId)} target="_blank" rel="noreferrer">{(transaction.txId)}</a></div>
			{/if}
		</div>
		{#if transaction.txId}
		<div class="flex">
			<div class="w-1/5">Revealed in Tx:</div>
			<div class="w-4/5 "><a class="" href={explorerBtcTxUrl(transaction.txId)} target="_blank" rel="noreferrer">{(transaction.txId)}</a></div>
		</div>
		{/if}
		{#if transaction.txId}
		<div class="flex">
			<div class="w-1/5">Reclaimed in Tx:</div>
			<div class="w-4/5 "><a class="" href={explorerBtcTxUrl(transaction.txId)} target="_blank" rel="noreferrer">{(transaction.txId)}</a></div>
		</div>
		{/if}
		<Payload {data} type={transaction.type} {bitcoinAddress} />
	</div>
	{/if}
	{#if coordinator && transaction.status > 0 && transaction.mode === RevealerTxModes.OP_RETURN}
	<div class="mt-8 mx-auto w-full">
		<TransactionAnalysis feature={'merkel-tree'} txId={transaction.txId}/>
	</div>
	{/if}

	
	