import { useEffect, useState } from 'react';
import CSVReader from '../CsvReader/CsvReader';
import { usePapaParse } from 'react-papaparse';
import React from 'react';
import Select from 'react-select';
import { useWeb3React } from '@web3-react/core';
import { Provider } from '../../utils/provider';
import { BigNumber, ethers } from 'ethers';
import multisenderV1 from './MultiSenderV1.json'
import ERC20 from './ERC20.json'
import { observer } from 'mobx-react-lite';
import WebStore from "../../store/WebStore";


const CsvContainer: React.FC = observer(() => {
    const { readString } = usePapaParse();
    const context = useWeb3React<Provider>();
    const { library, active, account, chainId } = context;
    const multiSendContractAddress = "0xe776C27ebFe7D0Eb741aD3Ab113Bbcb5659396f5";
    const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"

    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');


    const fetchTokenBalances = async () => {
        let nativeAssets, nativeAssetsAddress: any;
        const nativeAssetBalance = await library!.getBalance(account!);

        switch (chainId) {
            case 56:
                nativeAssets = 'BNB'
                nativeAssetsAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
                console.log('This is binance mainnet', chainId)
                break;
            case 97:
                nativeAssets = 'BNB'
                nativeAssetsAddress = '0x62b35Eb73edcb96227F666A878201b2cF915c2B5'
                console.log('This is binance test smart chain', chainId)
                break;
            default:
                console.log('This is an unknown network.', chainId)
        }
        const signer = library!.getSigner();

        const busdContract = new ethers.Contract(busdAddress, ERC20, signer)
        const balanceOfBusd = await busdContract.balanceOf(account);
        const symbolOfBusd = await busdContract.symbol();

        let newTokens = [{ label: `${symbolOfBusd} - ${(+ethers.utils.formatUnits(balanceOfBusd)).toFixed(4)} - ${busdAddress}`, value: busdAddress }];
        newTokens.unshift({
            label: `${nativeAssets} - ${(+ethers.utils.formatUnits(nativeAssetBalance)).toFixed(4)} - ${nativeAssetsAddress}`,
            value: nativeAssetsAddress
        })
        WebStore.setTokensList(newTokens);
    };


    const handleReadString = () => {
        readString(WebStore.textAreaPlaceholder, {
            worker: true,
            complete: (results: { data: any[]; }) => {
                const newArray = results.data.filter(n => n != '');
                WebStore.setData(newArray);

            },
        });
    };

    const multiSend = (event: { preventDefault: () => void; }): void => {
        event.preventDefault();


        if (!multiSendContractAddress) {
            window.alert('Undefined MultiSender contract');
            return;
        }
        async function handleMultiSend(multiSendContractAddress: string): Promise<void> {

            try {
                const signer = library!.getSigner();
                const multisSendContract = new ethers.Contract(multiSendContractAddress, multisenderV1.abi, signer);
                const tokenContract = new ethers.Contract(selectedOption, ERC20, signer);


                let result = WebStore.amounts.reduce(function (sum: ethers.BigNumber, elem) {
                    return sum.add(elem);
                }, BigNumber.from(0));
                if (selectedOption === WebStore.tokenList[0].value) {
                    await multisSendContract.multiSendNativeToken(WebStore.addresses, WebStore.amounts, { value: result });
                } else {
                    const approved = await tokenContract.approve(multiSendContractAddress, result)
                    await approved.wait();
                    const txdone = await multisSendContract.multiSendToken(selectedOption, WebStore.addresses, WebStore.amounts);
                    await txdone.wait();
                    fetchTokenBalances();
                }

            } catch (error: any) {
                window.alert(
                    'Error!' + (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }
        handleMultiSend(multiSendContractAddress);
    }


    const getValue = () => {
        return selectedOption ? WebStore.tokenList.find(c => c.value === selectedOption) : ''
    }

    const onChange = (newValue: any) => {
        setSelectedOption(newValue.value)
        console.log(newValue.value)
    }

    const handleChange = (event: any) => WebStore.textAreaPlaceholder = (event.target.value);

    useEffect((): void => {
        if (active) {
            setSelectedOption('');
            fetchTokenBalances();
            setLoading(false);
        } else {
            WebStore.setTokensList([{ label: '', value: '' }]);
            WebStore.textAreaPlaceholder = ('');
            setSelectedOption('');
            setLoading(true);
        }

    }, [active, chainId, account]);

    return (
        <div className='csv-container'>
            <div className='csv-container__item'>
                <Select
                    className='csv-container__select'
                    value={getValue()}
                    onChange={onChange}
                    isLoading={loading}
                    options={WebStore.tokenList}
                    isDisabled={WebStore.tokenList[0].label === '' ? true : false}
                    placeholder={WebStore.tokenList[0].label === '' ? "Loading your token addresses..." : "Your tokens are loaded"}
                />
            </div>
            <div className='csv-container__item'>
                <label className='csv-container__title' htmlFor='text-area'>Список адресов в формате csv </label>
                <textarea className='csv-container__text-area' onBlur={() => handleReadString()} id="text-area" name="csv-data" value={WebStore.textAreaPlaceholder} onChange={handleChange} />
            </div>
            <div className='csv-container__item'>
                <CSVReader />
            </div>
            <button className='csv-container__button' onClick={multiSend} type='button'>Далее</button>
        </div>
    );
})

export default CsvContainer;