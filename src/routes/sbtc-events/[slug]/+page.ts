import { findSbtcEventByBitcoinTxId } from '$lib/events_api';

/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {
    try {
        const net = url.searchParams.get('chain');
        const sbtcEvent = await findSbtcEventByBitcoinTxId(params.slug);
        return sbtcEvent[0];
    } catch (err) {
        console.log('LayoutLoad Error: ', err);
        return {
            error: 'unknown at present',
        };
    }
}