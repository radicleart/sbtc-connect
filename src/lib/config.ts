import { getConfig } from "$stores/store_helpers";
import { switchConfig } from "$stores/stores_config";
import type { HeaderLink } from "$types/local_types";

export interface Config {
    VITE_ENVIRONMENT:string;
    VITE_PUBLIC_APP_NAME: string;
    VITE_PUBLIC_APP_VERSION: string;
    VITE_NETWORK: string;
    VITE_SBTC_COORDINATOR: string;
    VITE_SBTC_CONTRACT_ID: string;
    VITE_BRIDGE_API: string;
    VITE_REVEALER_API: string;
    VITE_STACKS_API: string;
    VITE_STACKS_EXPLORER: string;
    VITE_BSTREAM_EXPLORER: string;
    VITE_MEMPOOL_EXPLORER: string;
}
  
export const config: { [key: string]: Config } = {
    "devnet": {
        VITE_ENVIRONMENT: 'devnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO Devnet',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
        VITE_NETWORK: 'devnet',
        VITE_SBTC_COORDINATOR: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5',
        VITE_SBTC_CONTRACT_ID: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset-3',
        VITE_REVEALER_API: 'http://localhost:4040/bridge-api/v1',
        VITE_BRIDGE_API: 'http://localhost3040/bridge-api/v1',
        VITE_STACKS_API: 'http://api.testnet.hiro.so',
        VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
        VITE_BSTREAM_EXPLORER: 'https://mempool.space/testnet',
        VITE_MEMPOOL_EXPLORER: 'https://mempool.space/testnet/api',
    },
    "testnet": {
        VITE_ENVIRONMENT: 'testnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO Testnet',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
        VITE_NETWORK: 'testnet',
        VITE_SBTC_COORDINATOR: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5',
        VITE_SBTC_CONTRACT_ID: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset-3',
        VITE_REVEALER_API: 'https://testnet.stx.eco/revealer-api/v1',
        VITE_BRIDGE_API: 'https://testnet.stx.eco/bridge-api/v1',
        VITE_STACKS_API: 'https://api.testnet.hiro.so',
        VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
        VITE_BSTREAM_EXPLORER: 'https://mempool.space/testnet',
        VITE_MEMPOOL_EXPLORER: 'https://mempool.space/testnet/api',
    },
    "mainnet": {
        VITE_ENVIRONMENT: 'mainnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
        VITE_NETWORK: 'mainnet',
        VITE_SBTC_COORDINATOR: 'ST3SPZXMPYVNHH3KF0RXNXVX1WVJ3QM1ZMD5FKWDN',
        VITE_SBTC_CONTRACT_ID: 'ST3SPZXMPYVNHH3KF0RXNXVX1WVJ3QM1ZMD5FKWDN.asset',
        VITE_REVEALER_API: 'https://stx.eco/revealer-api/v1',
        VITE_BRIDGE_API: 'https://stx.eco/bridge-api/v1',
        VITE_STACKS_API: 'https://api.hiro.so',
        VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
        VITE_BSTREAM_EXPLORER: 'https://mempool.space',
        VITE_MEMPOOL_EXPLORER: 'https://mempool.space/api',
    }
};


export function setConfig(network:string) {
    if (network === 'devnet') {
        switchConfig('devnet');
    } else if (network === 'testnet') {
        switchConfig('testnet');
    } else {
        switchConfig('mainnet');
    }

}
