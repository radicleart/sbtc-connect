import { get } from 'svelte/store';
import { configStore } from '$stores/stores_config';
import type { Configuration, SessionStore } from '$types/local_types';
import { sessionStore } from './stores';

export function getConfig(): Configuration {
  return get(configStore);
}

export function getSession(): SessionStore {
  return get(sessionStore);
}