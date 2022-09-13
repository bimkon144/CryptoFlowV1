import CSVReader from '../components/CsvReader/CsvReader';
import {useEffect } from 'react';
import MyVerticallyCenteredModal from '../components/Modal/MyVerticallyCenteredModal'
import { usePapaParse } from 'react-papaparse';
import AES from 'crypto-js/aes';
import ens from 'crypto-js/enc-utf8';
import { observer } from 'mobx-react-lite';
import WebStore from "../store/WebStore";
import { useWeb3React } from '@web3-react/core';
import { Provider } from '../utils/provider';
import TableListItems from '../components/TableList/TableList';

const Book = observer(() => {
  const { readRemoteFile } = usePapaParse();
  const { library } = useWeb3React<Provider>();


  const handleReadRemoteFile = (url: string) => {
    readRemoteFile(url, {
      complete: (results) => {
        try {
          const enscryptedText = results.data.toString()
          const bytes = AES.decrypt(enscryptedText, WebStore.signature);
          const originalText = JSON.parse(bytes.toString(ens));
          console.log('---------------------------');
          const slicedDataToNormalView = originalText.map((array:[]) => {
            return array.slice(1);
          });
          WebStore.setDataWithCheckboxState(originalText);
          WebStore.setAddressesBookData(slicedDataToNormalView);
          originalText.forEach((array:string[], index:number) => {
            WebStore.setCheckboxStateFromIpfs(array, index);
          });

        }
        catch (err) {
          alert(`You cannot decrypt the data `)
          console.log(err);
        }

      },
      download: true
    });
  };

  const onChangeCid = () => {
   WebStore.setModalShow(false)

    const prompted = prompt('Введи свой путь к списку')

    if (prompted != null) {
      const rightUrl = 'https://ipfs.io/ipfs/' + prompted
      handleReadRemoteFile(rightUrl);
    } else {
      alert('Вы ничего не ввели')
    }

  }

  const onCreateClick = () => {
    WebStore.setModalShow(false)

  }

  const signMessage = async () => {
    try {
      const signer = library!.getSigner();
      const signature = await signer.signMessage('sign this to continue');
      WebStore.setSignature(signature);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect((): void => {
    if (!WebStore.signature) {
      signMessage().catch(console.error);
    }

    if (!WebStore.isModalShow && !WebStore.addressesBookData.length) {
      WebStore.setModalShow(true)
    }
    if (WebStore.cidPhrase) {
      WebStore.setCidModal(false)
    }


  }, []);

  return (
    <>
      <div className='book'>
        <MyVerticallyCenteredModal
          show={WebStore.isModalShow}
          onHide={() => WebStore.setModalShow(false)}
          onCidChange={() => onChangeCid()}
          onCreateClick={() => onCreateClick()}
          isAlert={WebStore.isCidModal}
          cid={WebStore.cidPhrase}
        />
        {WebStore.isModalShow  ? '' : <><CSVReader isProfile={true} /></>}
        {WebStore.addressesBookData.length ? (<TableListItems />) : ('')}

      </div>

    </>
  );
});

export default Book;