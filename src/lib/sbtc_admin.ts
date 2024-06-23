/**
 * sbtc - interact with Stacks Blockchain to read sbtc contract info
 */
import { getConfig } from '$stores/store_helpers';
import { PostConditionMode, uintCV, stringAsciiCV, bufferCVFromString, bufferCV, cvToJSON, deserializeCV, type ListCV, contractPrincipalCV, principalCV, tupleCV } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { hex } from '@scure/base';
import { getStacksNetwork } from "@mijoco/stx_helpers/dist/index";

export const coordinators = [
  { stxAddress: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5', btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0' }, // devnet + electrum bob
  { stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // devnet + electrum bob
  { stxAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco staging + electrum bob
  { stxAddress: 'ST3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSPNET8TN', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco production + electrum bob
  { stxAddress: 'ST2BJA4JYFJ7SDMNFJZ9TJ3GB80P9Z80ADNF2R2AG', btcAddress: '' }, // coordinator
  { stxAddress: 'ST306HDPY54T81RZ7A9NGA2F03B8NRGW6Y59ZRZSD', btcAddress: '' }, // coordinator
  { stxAddress: 'ST3RBZ4TZ3EK22SZRKGFZYBCKD7WQ5B8FFRS57TT6', btcAddress: '' }, // coordinator
]

export function getCoordinator(address:string) {
	return coordinators.find((o) => o.stxAddress === address);
}

export function isCoordinator(address:string) {
	return coordinators.find((o) => o.stxAddress === address);
}

export async function romeoMintTo(contractId:string, amount:number, stxAddress: string, btcTxid: string, height: number, merkleProofs: ListCV, txIndex:number, headerHex: string) {
  let stxAddressCV = principalCV(stxAddress);
  if (stxAddress.indexOf('.') > -1) {
    stxAddressCV = contractPrincipalCV(stxAddress.split('.')[0], stxAddress.split('.')[1]);
  }
  const functionArgs = [uintCV(amount), stxAddressCV, bufferCV(hex.decode(btcTxid)), uintCV(height), merkleProofs, uintCV(txIndex), bufferCV(hex.decode(headerHex))]
  await openContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'mint',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
      return false
    }
  });
}

export async function romeoWithdrawTo(contractId:string, amount:number, stxAddress: string, btcTxid: string, height: number, merkleProofs: ListCV, txIndex:number, headerHex: string) {
  let stxAddressCV = principalCV(stxAddress);
  if (stxAddress.indexOf('.') > -1) {
    stxAddressCV = contractPrincipalCV(stxAddress.split('.')[0], stxAddress.split('.')[1]);
  }
  const functionArgs = [uintCV(amount), stxAddressCV, bufferCV(hex.decode(btcTxid)), uintCV(height), merkleProofs, uintCV(txIndex), bufferCV(hex.decode(headerHex))]
  await openContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'burn',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
      return false
    }
  });
}

export async function mintTo(contractId:string, amount:number, stxAddress: string, btcTxid: string) {
  const btcAddressCV = stringAsciiCV(btcTxid);
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcAddressCV]
  await openContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'mint',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function mintToMerkle(amount:number, stxAddress: string, btcTxid: string) {
  const contractId = getConfig().VITE_SBTC_COORDINATOR + '.asset'
  
  const btcTxidCV = bufferCV(hex.decode(btcTxid))
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcTxidCV]

  await openContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'mint',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function burnFrom(contractId:string, amount:number, stxAddress: string, btcTxid: string) {
  const btcAddressCV = stringAsciiCV(btcTxid);
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcAddressCV]
  await openContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
    postConditions: [],
    postConditionMode: PostConditionMode.Allow,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'burn',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function callContractReadOnly(data:any) {
  const url = getConfig().VITE_STACKS_API + '/v2/contracts/call-read/' + data.contractAddress + '/' + data.contractName + '/' + data.functionName;
  let val;
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              arguments: data.functionArgs,
              sender: data.contractAddress,
          })
      });
      val = await response.json();
  }
  catch (err) {
      console.log('callContractReadOnly4: ', err);
  }
  const result = cvToJSON(deserializeCV(val.result));
  return result;
}

export async function setCoordinator(contractId:string, address:string) {
  const datum = tupleCV({
    addr: principalCV(address),
    key: bufferCVFromString('33 max byte buffer')
  });

  const functionArgs = [datum]
  await openContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'set-coordinator-data',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function setsBTCPublicKey(contractId:string, publicKey:string) {
  const datum = bufferCV(hex.decode(publicKey))
  const functionArgs = [datum]
  await openContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'set-bitcoin-wallet-public-key',
    functionArgs: functionArgs,
    onFinish: async (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

