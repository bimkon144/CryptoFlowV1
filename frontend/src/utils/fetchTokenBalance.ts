import { useWeb3React } from '@web3-react/core';
import { Provider } from './provider';
import { useMoralisWeb3Api } from "react-moralis";
import { BigNumber, ethers } from 'ethers';
import WebStore from "../store/WebStore";
import Web3Api from 'moralis/types/generated/web3Api';



export default async function fetchTokenBalances(library:any, active:any, account:any, chainId:any, Web3Api:any) {

    let netIdName, nativeAssets, nativeAssetsAddress: any, balance: any;
    if (library !== undefined && typeof account == 'string') {
        balance = await library.getBalance(account);
    }
    switch (chainId) {
        case 56:
            netIdName = 'binance smart chain'
            nativeAssets = 'BNB'
            nativeAssetsAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
            console.log('This is binance mainnet', chainId)
            break;
        case 97:
            netIdName = 'binance testnet'
            nativeAssets = 'BNB'
            nativeAssetsAddress = '0x62b35Eb73edcb96227F666A878201b2cF915c2B5'
            console.log('This is binance test smart chain', chainId)
            break;
        default:
            netIdName = 'Unknown'
            console.log('This is an unknown network.', chainId)
    }
    const options: any = {
        chain: netIdName,
        address: account,
    };

    const balances = await Web3Api.account.getTokenBalances(options);
    let tokens = balances.map((contract:any) => {
        const { token_address, symbol, balance } = contract;
        return { label: `${symbol} - ${(+ethers.utils.formatUnits(balance)).toFixed(4)} - ${token_address}`, value: token_address }
    })
    console.log('balanced', balances, 'tokens', tokens);
    tokens.unshift({
        value: nativeAssetsAddress,
        label: `${nativeAssets} - ${(+ethers.utils.formatUnits(balance)).toFixed(4)}`
    })
    WebStore.setTokensList(tokens);
};