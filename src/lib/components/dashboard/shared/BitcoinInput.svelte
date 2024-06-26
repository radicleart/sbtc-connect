<script lang="ts">
  import { onMount } from 'svelte';
  import { Icon, InformationCircle, ArrowsRightLeft } from "svelte-hero-icons";
  import { Tooltip } from 'flowbite-svelte';
  import { sessionStore } from '$stores/stores'
  import { bitcoinBalanceFromMempool, bitcoinToSats, satsToBitcoin } from '$lib/utils'
	import type { SessionStore } from '$types/local_types';
  import { fmtNumber } from '$lib/utils'
	import { getConfig } from '$stores/store_helpers';
  import { createEventDispatcher } from "svelte";
	import type { ExchangeRate } from '@mijoco/stx_helpers/dist/index';

  const dispatch = createEventDispatcher();

  export let depositFlow:boolean;
  let currency: ExchangeRate;
  let denomination = 'satoshi';

  const inputData = {
    field: 'amount',
    label: 'Amount (bitcoin)',
    hint: 'The amount you wish to deposit',
    resetValue: undefined,
    valueBtc: 0.000010000,
    valueSat: 10000
  }

  let value:number = inputData.valueSat;
  let reason:string|undefined;

  const updater = (e:any) => {
    try {
      reason = undefined
      let vstr = value.toString()
      if (vstr.endsWith('.')) return
      const denomination = $sessionStore.userSettings.currency.denomination;
      let baly = 0
      if (depositFlow) {
        baly = bitcoinBalanceFromMempool($sessionStore.keySets[getConfig().VITE_NETWORK].cardinalInfo)
      } else {
        baly = $sessionStore.keySets[getConfig().VITE_NETWORK].sBTCBalance || 0
      }

      if (denomination === 'bitcoin') {
        if (value === 0) return
        if (value > 100) {
          value = 100.0
          reason = '<p>Deposits and withdrawals are currently capped at 100 BTC</p><p>Click BTC/SAT to toggle data entry between bitcoin and satoshis - see also settings for other currency display options.</p>'
          return
        }
        if (bitcoinToSats(value) > baly) {
          reason = '<p>Amount exceeds your balance.</p>'
          dispatch('amount_event', { success: true, reason: 'Amount exceeds your balance' });
          return
        }
        if (vstr.indexOf('.') === -1) vstr += '.0'
        const decimals = vstr.split('.')[1]
        const places = decimals.length
        if (places > 8) {
          value = satsToBitcoin(bitcoinToSats(value))
          return
        }
        inputData.valueSat = bitcoinToSats(value)
        inputData.valueBtc = value;
        if (depositFlow) $sessionStore.sbtcInfo.payloadDepositData.amountSats = bitcoinToSats(value)
        else $sessionStore.sbtcInfo.payloadWithdrawData.amountSats = bitcoinToSats(value)
      } else {
        if (value === 0) return
        if (value > baly) {
          reason = '<p>Amount exceeds your balance.</p>'
          dispatch('amount_event', { success: true, reason: 'Amount exceeds your balance' });
          return
        }
        if (vstr.indexOf('.') > -1) {
          value = Math.trunc(value)
        }

        inputData.valueBtc = satsToBitcoin(value)
        inputData.valueSat = value;
        if (depositFlow) $sessionStore.sbtcInfo.payloadDepositData.amountSats = value
        else $sessionStore.sbtcInfo.payloadWithdrawData.amountSats = value
      }
      sessionStore.set($sessionStore)
      dispatch('amount_event', { success: true, reason: undefined });
    } catch(err:any) {
      reason = 'Amount exceeds your balance';
      dispatch('amount_event', { success: false, reason });
    }
    document.getElementById(inputData.field + '-btcamount')?.focus();
  }

  const setDenomination = (denomination:string) => {
    reason = undefined
		const conf:SessionStore = $sessionStore;
    conf.userSettings.currency.denomination = denomination;
		sessionStore.update(() => conf);
    setDisplayValue()
  }

  $: getBalance = () => {
    if ($sessionStore.userSettings.peggingIn) {
      if ($sessionStore.userSettings.currency.denomination === 'bitcoin') return satsToBitcoin(bitcoinBalanceFromMempool($sessionStore.keySets[getConfig().VITE_NETWORK].cardinalInfo))
      else return bitcoinBalanceFromMempool($sessionStore.keySets[getConfig().VITE_NETWORK].cardinalInfo)
    } else {
      if ($sessionStore.userSettings.currency.denomination === 'bitcoin') return satsToBitcoin($sessionStore.keySets[getConfig().VITE_NETWORK].sBTCBalance)
      else return $sessionStore.keySets[getConfig().VITE_NETWORK].sBTCBalance
    }
  }

  const setDisplayValue = () => {
    denomination = $sessionStore.userSettings.currency.denomination;
    inputData.valueBtc = satsToBitcoin($sessionStore.sbtcInfo.payloadDepositData.amountSats)
    inputData.valueSat = $sessionStore.sbtcInfo.payloadDepositData.amountSats
    if (denomination === 'bitcoin') {
      inputData.label = 'Amount (bitcoin)'
      value = inputData.valueBtc;
    } else {
      inputData.label = 'Amount (satoshis)'
      value = inputData.valueSat;
    }
  }

  onMount(async () => {
    setDisplayValue()
    currency = $sessionStore.userSettings.currency.myFiatCurrency;
    if (depositFlow) {
      if ($sessionStore.sbtcInfo.payloadDepositData.amountSats > 0) {
        if (denomination === 'bitcoin') value = satsToBitcoin($sessionStore.sbtcInfo.payloadDepositData.amountSats)
        else value = $sessionStore.sbtcInfo.payloadDepositData.amountSats
      }
    } else {
      if ($sessionStore.sbtcInfo.payloadWithdrawData.amountSats > 0) {
        if (denomination === 'bitcoin') value = satsToBitcoin($sessionStore.sbtcInfo.payloadWithdrawData.amountSats)
        else value = $sessionStore.sbtcInfo.payloadWithdrawData.amountSats
      }
    }
  })
</script>

<Tooltip class="w-auto !font-extralight !bg-black z-20" triggeredBy="#{inputData.field}-label">
  {#if inputData.hint}
    {inputData.hint}
  {:else}
    Please enter.
  {/if}
</Tooltip>

<div>
  <div class="flex justify-between">
    <div class="flex items-center gap-4 mb-1.5">
      <label class="inline-flex text-base font-medium" for="amount-btcamount">
        Amount {#if denomination === 'satoshi'} (satoshi){:else} (bitcoin){/if}
        {#if inputData.hint}
          <Icon src="{InformationCircle}" mini class="ml-2 shrink-0 h-5 w-5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" aria-hidden="true" id="{inputData.field}-label" />
        {/if}
      </label>
      {#if denomination === 'satoshi'}
        <button
          on:click|preventDefault={() => setDenomination('bitcoin')}
          class="text-sm text-primary-500 inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
        >
          Switch to Bitcoin <Icon src="{ArrowsRightLeft}" mini class="ml-1 shrink-0 h-4 w-4 text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" aria-hidden="true" id="d-sign-label" />
        </button>
      {:else}
        <button
          on:click|preventDefault={() => setDenomination('satoshi')}
          class="text-sm text-primary-500 inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
        >
          Switch to Satoshis <Icon src="{ArrowsRightLeft}" mini class="ml-1 shrink-0 h-4 w-4 text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" aria-hidden="true" id="d-sign-label" />
        </button>
      {/if}
    </div>
    <p class="text-sm text-gray-300">Balance {getBalance()}</p>
  </div>

  <div class="relative mb-0">
    <div class="flex">
      <div class="grow">
        <input
          id={'amount-btcamount'}
          on:keyup={(e) => updater(e)}
          bind:value={value}
          type="number"
          name="amount-btcamount"
          class:border-error-500={reason}
          class="text-black font-extralight border border-transparent text-base rounded-md pl-4 pr-20 py-3 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
        />
        <div class="flex items-center gap-2 absolute right-6 top-1/2 -translate-y-1/2">
          <svg class="w-6 h-6 shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.7001 12.4198C19.3824 13.6937 18.8168 14.8925 18.0358 15.9477C17.2547 17.003 16.2734 17.8941 15.148 18.5702C14.0225 19.2462 12.7749 19.6939 11.4764 19.8877C10.1779 20.0815 8.85393 20.0177 7.5801 19.6998C5.66184 19.2211 3.92859 18.1843 2.59955 16.7206C1.2705 15.2568 0.405334 13.4318 0.113452 11.4764C-0.178429 9.52096 0.116081 7.52289 0.959742 5.73483C1.8034 3.94677 3.15832 2.44903 4.85318 1.431C6.54803 0.412971 8.5067 -0.0796316 10.4815 0.0154847C12.4563 0.110601 14.3586 0.789164 15.9477 1.96537C17.5369 3.14157 18.7416 4.7626 19.4095 6.62346C20.0774 8.48432 20.1786 10.5015 19.7001 12.4198Z" fill="#F7931A"></path><path d="M14.41 8.57486C14.61 7.24486 13.595 6.52986 12.21 6.05153L12.66 4.24986L11.5617 3.97653L11.1234 5.73153C10.835 5.65986 10.54 5.59153 10.245 5.52486L10.685 3.7582L9.58837 3.48486L9.14003 5.28486L6.9267 4.7382L6.63503 5.90986C6.63503 5.90986 7.44837 6.09653 7.4317 6.1082C7.8767 6.21986 7.9567 6.5132 7.94337 6.74653L6.7117 11.6832C6.6567 11.8165 6.52003 12.0199 6.20837 11.9432C6.22003 11.9599 5.4117 11.7432 5.4117 11.7432L4.8667 12.9999L7.0767 13.5582L6.6217 15.3815L7.71837 15.6549L8.16837 13.8515C8.46837 13.9332 8.75837 14.0082 9.04337 14.0782L8.59337 15.8732L9.6917 16.1465L10.1467 14.3265C12.0167 14.6832 13.425 14.5399 14.0167 12.8499C14.4934 11.4882 13.9934 10.7015 13.0084 10.1899C13.725 10.0232 14.265 9.55153 14.4084 8.5782H14.41V8.57486ZM11.9017 12.0915C11.5617 13.4532 9.26837 12.7165 8.52503 12.5315L9.1267 10.1165C9.87003 10.3015 12.255 10.6699 11.9017 12.0915ZM12.2417 8.55653C11.9334 9.79653 10.0234 9.16653 9.40337 9.01153L9.94837 6.81986C10.5684 6.97486 12.565 7.2632 12.2417 8.55653Z" fill="white"></path></svg>
          <span class="text-sm font-bold text-black">
            {#if denomination === 'satoshi'}
              SATS
            {:else}
              BTC
            {/if}
          </span>
        </div>
      </div>
    </div>
  </div>
  {#if currency}
    <p class="mt-1.5 text-xs text-gray-300">
      ~ {#if inputData.valueSat && inputData.valueSat > 0}{currency.symbol + ' ' + fmtNumber(currency.fifteen * inputData.valueBtc) + ' ' + currency.currency}{/if}
    </p>
  {/if}
</div>

{#if reason}
  <div>
    <p class="text-error-500">
      {@html reason}
    </p>
  </div>
{/if}
