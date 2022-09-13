import { observer } from 'mobx-react-lite';
import getEncryptedText from '../../utils/getEncryptedText';
import WebStore from "../../store/WebStore";
import TableItem from '../TableItem/TableItem';
import deployToIpfs from '../../utils/deployToIpfs';
import { useNavigate } from "react-router-dom";

const TableList = observer(() => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const cloneOfBookData = JSON.parse(JSON.stringify(WebStore.addressesBookData))
    cloneOfBookData.forEach((array, index) => {
      array.unshift((WebStore.toggledEditArray[index].isChecked).toString());
    })
    const filteredAddressesToSend = cloneOfBookData.filter(array => array.includes('true'));
    const slicedData = filteredAddressesToSend.map((array) => {
      return array.slice(2);
    });

    WebStore.setData(slicedData);
    WebStore.setTextAreaPlaceholder(slicedData)
    navigate("/");
  }

  const saveTheTable = async () => { 
    //тут нужно запушить состояния чекбоксов в адрес бук
    const cloneOfBookData = JSON.parse(JSON.stringify(WebStore.addressesBookData))
    cloneOfBookData.forEach((array, index) => {
      array.unshift((WebStore.toggledEditArray[index].isChecked).toString());
    })
    const encryotedText = getEncryptedText(cloneOfBookData, WebStore.signature);
    const cidPhrase = await deployToIpfs(encryotedText)
    WebStore.setCidPhrase(cidPhrase);
    WebStore.setCidModal(true);
    WebStore.setModalShow(true)

  }


  return (
    <>
      <form className='book__form' onSubmit={handleSubmit}>
        <button type="button" onClick={() => (WebStore.addRow())}>Add row</button>
        <button type="button" onClick={() => (WebStore.clearTheTable())}>Clear the table</button>
        <button type="button" onClick={saveTheTable}>Save this table </button>
        {WebStore.addressesBookData.map((item, index) => (
          <li className="book__list-items">
            <input
              type="checkbox"
              name="isActive"
              checked={WebStore.toggledEditArray[index]? WebStore.toggledEditArray[index].isChecked : true}
              onChange={() => {WebStore.toggleCheckbox(!WebStore.toggledEditArray[index].isChecked, index)}}
            />
            <TableItem data={{ type: 'text', name: 'username',   isLastItem: false, index}} />
            <TableItem data={{ type: 'text', name: 'address',   isLastItem: false, index }} />
            <TableItem data={{ type: 'text', name: 'amount',   isLastItem: true, index }} />
          </li>
        ))}
        <input type="submit" />
      </form>
    </>
  );
})


export default TableList;