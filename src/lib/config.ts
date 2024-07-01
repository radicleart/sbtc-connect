import type { Configuration } from "$types/local_types";

export const config: { [key: string]: Configuration } = {
    "devnet": {
        VITE_ENVIRONMENT: 'devnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO Devnet',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
        VITE_NETWORK: 'devnet',
        VITE_SBTC_COORDINATOR: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5',
        VITE_SBTC_CONTRACT_ID: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset-3',
        VITE_REVEALER_API: 'http://localhost:4040/revealer-api/v1',
        VITE_STACKS_API: 'http://localhost:3999',
        VITE_STACKS_EXPLORER: 'http://localhost:8000',
        VITE_MEMPOOL_API: 'http://localhost:18443',
        VITE_BSTREAM_EXPLORER: 'http://localhost:8000',
        VITE_MEMPOOL_EXPLORER: 'http://localhost:8000',
        VITE_HEADER_LINKS: [
            {name: '/', href: '/', display: 'Dashboard', target:'_self'},
            {name: '/transactions', href: '/transactions', display: 'History', target:'_self'},
            {name: '/how-it-works', href: '/how-it-works', display: 'How It Works', target:'_self'},
            {name: '/faq', href: '/faq', display: 'FAQ', target:'_self'},
            {name: '/proofs', href: '/proofs', display: 'Tx Check', target:'_self'},
        ]
    },
    "testnet": {
        VITE_ENVIRONMENT: 'testnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO Testnet',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
        VITE_NETWORK: 'testnet',
        VITE_SBTC_COORDINATOR: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5',
        VITE_SBTC_CONTRACT_ID: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset-3',
        VITE_REVEALER_API: 'https://testnet.stx.eco/revealer-api/v1',
        VITE_STACKS_API: 'https://api.testnet.hiro.so',
        VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
        VITE_MEMPOOL_API: 'https://mempool.space/testnet/api',
        VITE_BSTREAM_EXPLORER: 'https://mempool.space/testnet',
        VITE_MEMPOOL_EXPLORER: 'https://mempool.space/testnet/api',
        VITE_HEADER_LINKS: [
            {name: '/', href: '/', display: 'Dashboard', target:'_self'},
            {name: '/transactions', href: '/transactions', display: 'History', target:'_self'},
            {name: '/how-it-works', href: '/how-it-works', display: 'How It Works', target:'_self'},
            {name: '/faq', href: '/faq', display: 'FAQ', target:'_self'},
            {name: '/proofs', href: '/proofs', display: 'Tx Check', target:'_self'},
        ]
    },
    "mainnet": {
        VITE_ENVIRONMENT: 'mainnet',
        VITE_PUBLIC_APP_NAME: 'Stacks Ecosystem DAO',
        VITE_PUBLIC_APP_VERSION: '1.0.0',
        VITE_NETWORK: 'mainnet',
        VITE_SBTC_COORDINATOR: 'ST3SPZXMPYVNHH3KF0RXNXVX1WVJ3QM1ZMD5FKWDN',
        VITE_SBTC_CONTRACT_ID: 'ST3SPZXMPYVNHH3KF0RXNXVX1WVJ3QM1ZMD5FKWDN.asset',
        VITE_REVEALER_API: 'https://api.stx.eco/revealer-api/v1',
        VITE_STACKS_API: 'https://api.hiro.so',
        VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
        VITE_MEMPOOL_API: 'https://mempool.space/api',
        VITE_BSTREAM_EXPLORER: 'https://mempool.space',
        VITE_MEMPOOL_EXPLORER: 'https://mempool.space/api',
        VITE_HEADER_LINKS: [
            {name: '/', href: '/', display: 'Dashboard', target:'_self'},
            {name: '/transactions', href: '/transactions', display: 'History', target:'_self'},
            {name: '/how-it-works', href: '/how-it-works', display: 'How It Works', target:'_self'},
            {name: '/faq', href: '/faq', display: 'FAQ', target:'_self'},
            {name: '/proofs', href: '/proofs', display: 'Tx Check', target:'_self'},
        ]
    }
};

