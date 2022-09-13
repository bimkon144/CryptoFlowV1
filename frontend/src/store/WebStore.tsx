import { ethers } from "ethers";
import { makeAutoObservable } from "mobx";


interface rowArray {
  indexOfToggledArray: number;
  isReadOnly: boolean;
  isChecked: boolean;
}



const addToggledItem = (arrayOfTogledEdit: rowArray[], indexOfArray: number, stateOfEditable: boolean, stateOfChecked: boolean): rowArray[] => [
  ...arrayOfTogledEdit,
  {
    indexOfToggledArray: indexOfArray,
    isReadOnly:stateOfEditable,
    isChecked:stateOfChecked,
  },
];


class WebStore {

  addresses: string[] = [];
  amounts: ethers.BigNumber[] = [];
  textAreaPlaceholder: string = '';
  tokenList = [{ label: '', value: '' }];

  signature: string = ''
  addressesBookData: string[][] = [];
  toggledEditArray: rowArray[] = [];
  cidPhrase: string = ''
  isCidModal:boolean = false;
  isModalShow:boolean = false;
  dataWithCheckboxState: string[][] = []

  constructor() {
    makeAutoObservable(this);
  }
  setInitEditable(isToggled: boolean, isChecked:boolean, indexOfToggledArray: number) {
    this.toggledEditArray = addToggledItem(this.toggledEditArray,indexOfToggledArray, isToggled, isChecked);
  }

  setCheckboxStateFromIpfs (array:string[], index: number) {
    const checkBoxState = array[0].toLowerCase() === 'true'? true : false;
    this.toggledEditArray = addToggledItem(this.toggledEditArray, index, true, checkBoxState)
  }
  
  toggleEdit(isReadOnly: boolean, indexOfToggledArray: number) {
    this.toggledEditArray[indexOfToggledArray].isReadOnly = isReadOnly;
  }

  toggleCheckbox(isToggled: boolean, indexOfToggledArray: number) {
   this.toggledEditArray[indexOfToggledArray].isChecked = isToggled
    
  }

  setCidModal (isOn:boolean) {
    this.isCidModal = isOn;
  }

  setModalShow (isShow:boolean) {
    this.isModalShow = isShow;
  }

  setCidPhrase(cid:string) {
    this.cidPhrase = cid;
  }

  setData(data: string[][]) {
    const addresses: string[] = [];
    const values: ethers.BigNumber[] = [];
    data.forEach((element, index) => {
      addresses.push(element[0]);
    });
    data.forEach((element, index) => {
      values.push(ethers.utils.parseEther(element[1]));
    });
    this.addresses = addresses;
    this.amounts = values;
  }

  setFilteredData () {
    const filteredArray = this.addressesBookData.map((array) => {
      return array.slice(1);
    });
    this.setData(filteredArray);
  }

  setAddressesBookData(data: string[][]) {
    this.addressesBookData = data;
  }

  setDataWithCheckboxState(data: string[][]) {
    this.dataWithCheckboxState = data;
  }


  setTextAreaPlaceholder(data: string[][]) {
    this.textAreaPlaceholder = data.join('\r\n')
  }

  setTokensList(tokens: { label: string, value: string }[]) {
    this.tokenList = tokens;
  }

  setSignature(signature: string) {
    this.signature = signature;
  }

  addRow() {
    this.addressesBookData.push([])
  }

  removeRow(indexOfArray: number) {
    this.addressesBookData.splice(indexOfArray, 1);
  }

  getValueFromAddressesBookData(nameOfInput: string, arrayIndex: number): string {
    let value
    switch (nameOfInput) {
      case 'username':
        value = this.addressesBookData[arrayIndex][0];
        break;
      case 'address':
        value = this.addressesBookData[arrayIndex][1];
        break;
      case 'amount':
        value = this.addressesBookData[arrayIndex][2];
        break;
      default:
        value = '';
        break;
    }
    return value
  }

  setIndexedValueToAddressesBookData(nameOfInput: string, arrayIndex: number, value: any): void {
    switch (nameOfInput) {
      case 'username':
        this.addressesBookData[arrayIndex][0] = value;
        break;
      case 'address':
        this.addressesBookData[arrayIndex][1] = value
        break;
      case 'amount':
        this.addressesBookData[arrayIndex][2] = value
        break;
      default:
        break;
    }
  }
  clearTheTable() {
    this.addressesBookData = [];
  }

  // load(url: string) {
  //   fetch(url)
  //     .then((resp) => resp.json())
  //     .then((tds: Todo[]) => (store.todos = tds));
  // }
}


export default new WebStore();