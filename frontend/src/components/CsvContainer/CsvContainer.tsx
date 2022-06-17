import { SetStateAction, useEffect, useState } from 'react';
import CSVReader from '../CsvReader/CsvReader';
import { usePapaParse } from 'react-papaparse';
import { useMoralisWeb3Api } from "react-moralis";
import React from 'react';
import Select from 'react-select';
import { useWeb3React } from '@web3-react/core';
import { Provider } from '../../utils/provider';
import { BigNumber, ethers } from 'ethers';
import multisenderV1 from './MultiSenderV1.json'
import ERC20 from './ERC20.json'

const CsvContainer: React.FC = () => {
    const { readString } = usePapaParse();
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState(['']);
    const [amounts, setAmounts] = useState<ethers.BigNumber[]>([]);
    const [tokensList, setTokensList] = useState<{ label: string, value: string }[]>([{ label: '', value: '' }]);
    const [selectedOption, setSelectedOption] = useState('');
    const handleChange = (event: any) => setValue(event.target.value);
    const multiSendContractAddress = "0x840B92E2DE70F2fdf340F6700cC5E4aCef89278D";
    const Web3Api = useMoralisWeb3Api();
    const context = useWeb3React<Provider>();
    const { library, active, account, chainId } = context;

    const splitToArrays = (data: string[][]) => {

        const addresses: string[] = [];
        const values: ethers.BigNumber[] = [];
        data.forEach((element, index) => {
            addresses.push(element[0]);
        });
        data.forEach((element, index) => {
            values.push(ethers.utils.parseEther(element[1]));
        });
        return { addresses, values }
    }


    const fetchTokenBalances = async () => {
        let netIdName, explorerUrl, nativeAssets, nativeAssetsAddress: any;
        const balance = await library!.getBalance(account!);
        switch (chainId) {
            case 1:
                netIdName = 'mainnet'
                explorerUrl = 'https://etherscan.io'
                nativeAssets = 'ETH'
                console.log('This is Foundation', chainId)
                break;
            case 3:
                netIdName = 'ropsten'
                explorerUrl = 'https://ropsten.etherscan.io'
                nativeAssets = 'ETH'
                console.log('This is Ropsten', chainId)
                break;
            case 4:
                netIdName = 'rinkeby'
                explorerUrl = 'https://rinkeby.etherscan.io'
                console.log('This is Rinkeby', chainId)
                break;
            case 5:
                netIdName = 'goerli'
                explorerUrl = 'https://goerli.etherscan.io/'
                console.log('This is goerli', chainId)
                break;
            case 42:
                netIdName = 'Kovan'
                explorerUrl = 'https://kovan.etherscan.io'
                console.log('This is Kovan', chainId)
                break;
            case 56:
                netIdName = 'binance smart chain'
                explorerUrl = 'https://testnet.bscscan.com/'
                nativeAssets = 'BNB'
                console.log('This is binance mainnet', chainId)
                break;
            case 97:
                netIdName = 'binance testnet'
                explorerUrl = 'http://bscscan.com/'
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
        let tokens = balances.map((contract) => {
            const { token_address, symbol, balance } = contract;
            return { label: `${symbol} - ${ethers.utils.formatUnits(balance)} - ${token_address}`, value: token_address }
        })
        const options2: any = {
            chain: "binance testnet",
            address: account,
        };
        const bscBalance = await Web3Api.account.getNativeBalance(options2);
        console.log((+ethers.utils.formatUnits(bscBalance.balance)).toFixed(4));

        tokens.unshift({
            value: nativeAssetsAddress,
            label: `${nativeAssets} - ${(+ethers.utils.formatUnits(balance)).toFixed(4)}`
        })
        setTokensList(tokens)
    };


    const handleReadString = () => {
        readString(value, {
            worker: true,
            complete: (results: { data: any[]; }) => {
                const { addresses, values } = splitToArrays(results.data);
                setAddresses(addresses);
                setAmounts(values);
                console.log('---------------------------');
                console.log(results.data);
                console.log('---------------------------');
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
                let result = amounts.reduce(function (sum: ethers.BigNumber, elem) {
                    return sum.add(elem);
                }, BigNumber.from(0));
                // console.log(result.toString());
                // console.log('data', selectedOption, addresses, amounts);
                if (selectedOption === tokensList[0].value) {
                    await multisSendContract.multiSendNativeToken(addresses, amounts, {value: result});
                } else {
                    const approved = await tokenContract.approve(multiSendContractAddress, result)
                    await approved.wait();

                    const setMultisSendTxn = await multisSendContract.multiSendToken(selectedOption, addresses, amounts);
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
        return selectedOption ? tokensList.find(c => c.value === selectedOption) : ''
    }

    const onChange = (newValue: any) => {
        setSelectedOption(newValue.value)
        console.log(newValue.value)
    }

    useEffect((): void => {
        if (active) {
            setSelectedOption('');
            fetchTokenBalances();
            setLoading(false);
        } else {
            setTokensList([{ label: '', value: '' }]);
            setValue('');
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
                    options={tokensList}
                    isDisabled={tokensList[0].label == '' ? true : false}
                    placeholder={tokensList[0].label == '' ? "Loading your token addresses..." : "Your tokens are loaded"}
                />
            </div>
            <div className='csv-container__item'>
                <label className='csv-container__title' htmlFor='text-area'>Список адресов в формате csv </label>
                <textarea className='csv-container__text-area' onBlur={() => handleReadString()} id="text-area" name="csv-data" value={value} onChange={handleChange} />
            </div>
            <div className='csv-container__item'>
                <CSVReader setValue={setValue} setAddresses={setAddresses} setAmounts={setAmounts} />
            </div>
            <button className='csv-container__button' onClick={multiSend} type='button'>Далее</button>
        </div>
    );
}

export default CsvContainer;