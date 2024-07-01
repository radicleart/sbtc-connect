import { writable } from 'svelte/store';
import { config } from '$lib/config';
import type { Config } from '@sveltejs/kit';

const initialConfig = (config) ? config.devnet : {} as Config;

export const configStore = writable(initialConfig);

export function switchConfig(env:string) {
  configStore.set(config[env]);
}
export function setConfigByUrl(search:URLSearchParams) {
  let network = 'mainnet'
  if (search.has('chain')) {
      network = search.get('chain') || 'mainnet'
  }
  switchConfig(network)
}

export function setConfig(network:string|null) {
  if (!network) {
      switchConfig('devnet');
  } else {
      switchConfig(network);
  }

}
