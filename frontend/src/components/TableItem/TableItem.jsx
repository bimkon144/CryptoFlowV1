import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import WebStore from "../../store/WebStore";

const TableItem = observer(({ data }) => {


    const handleChangeInput = (event, index, name) => {
        const value = event.target.value;
        WebStore.setIndexedValueToAddressesBookData(name, index, value);
    }
    useEffect(() => {

        if (WebStore.dataWithCheckboxState[0] === undefined) {
            WebStore.setInitEditable(true, true, data.index)
        }


    }, []);

    return (
        <>

            <input
                className='book__input-item'
                type={data.typeOfInput}
                name={data.name}
                placeholder={data.placeholder}
                value={WebStore.getValueFromAddressesBookData(data.name, data.index)}
                readOnly={WebStore.toggledEditArray[data.index] ? WebStore.toggledEditArray[data.index].isReadOnly : true}
                onChange={(evt) => handleChangeInput(evt, data.index, data.name)}
                disabled={WebStore.toggledEditArray[data.index]? !WebStore.toggledEditArray[data.index].isChecked : false}
            />

            {data.isLastItem ? (
                <>
                    <label>
                        <button type="button" disabled={WebStore.toggledEditArray[data.index]? !WebStore.toggledEditArray[data.index].isChecked : false} onClick={() => WebStore.toggleEdit(!WebStore.toggledEditArray[data.index].isReadOnly, data.index)}>edit</button>
                    </label>
                    <label>
                        <button type="button" disabled={WebStore.toggledEditArray[data.index]? !WebStore.toggledEditArray[data.index].isChecked : false} onClick={() => WebStore.removeRow(data.index)}>delete</button>
                    </label>
                </>
            ) : ('')}

        </>
    );
})

export default TableItem;