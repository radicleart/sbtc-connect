const REMOTE_DEVNET_CONFIG = {
    VITE_ENVIRONMENT: 'devenv',
    VITE_PUBLIC_APP_NAME: 'sBTC Bridge Devenv',
    VITE_PUBLIC_APP_VERSION: '1.0.0',
    VITE_NETWORK: 'devnet',
    VITE_SBTC_COORDINATOR: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    VITE_BRIDGE_WS: 'ws://45.79.130.153:3999',
    VITE_REVEALER_API: 'http://45.79.130.153:4010/revealer-api/v1',
    VITE_STACKS_API: 'http://45.79.130.153:3999',
    VITE_STACKS_EXPLORER: 'http://45.79.130.153:3020',
    VITE_BSTREAM_EXPLORER: 'http://45.79.130.153:8083',
    VITE_MEMPOOL_EXPLORER: 'http://45.79.130.153:8083',
}

const LOCAL_DEVNET_CONFIG = {
    VITE_ENVIRONMENT: 'devnet',
    VITE_PUBLIC_APP_NAME: 'sBTC Bridge Devnet',
    VITE_PUBLIC_APP_VERSION: '1.0.0',
    VITE_NETWORK: 'devnet',
    VITE_SBTC_COORDINATOR: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    VITE_BRIDGE_WS: 'ws://localhost:3010',
    VITE_REVEALER_API: 'http://localhost:4010/revealer-api/v1',
    VITE_STACKS_API: 'http://stacks-api:3999',
    VITE_STACKS_EXPLORER: 'http://stacks-explorer:3020',
    VITE_BSTREAM_EXPLORER: 'http://mempool-web/testnet/api',
    VITE_MEMPOOL_EXPLORER: 'http://mempool-web/testnet/api',
}

const TESTNET_CONFIG = {
    VITE_ENVIRONMENT: 'testnet',
    VITE_PUBLIC_APP_NAME: 'sBTC Bridge Testnet',
    VITE_PUBLIC_APP_VERSION: '1.0.0',
    VITE_BRIDGE_WS: 'wss://testnet.bridge.sbtc.tech',
    VITE_NETWORK: 'testnet',
    VITE_SBTC_COORDINATOR: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5',
    VITE_REVEALER_API: 'https://testnet.bridge.sbtc.tech/revealer-api/v1',
    VITE_STACKS_API: 'https://api.testnet.hiro.so',
    VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
    VITE_BSTREAM_EXPLORER: 'https://mempool.space/testnet',
    VITE_MEMPOOL_EXPLORER: 'https://mempool.space/testnet/api',
}

const MAINNET_CONFIG = {
    VITE_ENVIRONMENT: 'mainnet',
    VITE_PUBLIC_APP_NAME: 'sBTC Bridge',
    VITE_PUBLIC_APP_VERSION: '1.0.0',
    VITE_BRIDGE_WS: 'wss://mainnet.bridge.sbtc.tech',
    VITE_NETWORK: 'mainnet',
    VITE_SBTC_COORDINATOR: 'ST3SPZXMPYVNHH3KF0RXNXVX1WVJ3QM1ZMD5FKWDN',
    VITE_REVEALER_API: 'https://mainnet.bridge.sbtc.tech/revealer-api/v1',
    VITE_STACKS_API: 'https://api.hiro.so',
    VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
    VITE_BSTREAM_EXPLORER: 'https://mempool.space',
    VITE_MEMPOOL_EXPLORER: 'https://mempool.space/api',
}

export let CONFIG = MAINNET_CONFIG;

export function setConfig(network:string) {
    const mode = import.meta.env.MODE
    console.log('mode: ' + mode)
    if (mode === 'remote-devnet') {
        CONFIG = REMOTE_DEVNET_CONFIG;
        return;
    } else if (mode === 'local-devnet') {
        CONFIG = LOCAL_DEVNET_CONFIG;
        return;
    } else if (mode === 'local-testnet') {
        CONFIG = TESTNET_CONFIG;
        CONFIG.VITE_REVEALER_API = 'http://localhost:4010/revealer-api/v1';
        return;
    } else if (mode === 'local-mainnet') {
        CONFIG = MAINNET_CONFIG;
        CONFIG.VITE_REVEALER_API = 'http://localhost:4010/revealer-api/v1';
        return;
    } else {
        if (!network || network.length === 0 || network.indexOf('chain=') === -1) {
            network = 'testnet'
            CONFIG = TESTNET_CONFIG;
        } else if (network.indexOf('mainnet') > -1) {
            network = 'mainnet'
            CONFIG = MAINNET_CONFIG;
        } else {
            network = 'testnet'
            CONFIG = TESTNET_CONFIG;
        }
    }

}
