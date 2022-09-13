const contract = {
    address: "0xe776C27ebFe7D0Eb741aD3Ab113Bbcb5659396f5",
    busdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    abi: [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "_sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_totalAmount",
              "type": "uint256"
            }
          ],
          "name": "Sent",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "_sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256[]",
              "name": "_tokenIds",
              "type": "uint256[]"
            }
          ],
          "name": "SentNFT",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_totalAmount",
              "type": "uint256"
            }
          ],
          "name": "SentNative",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "contract IERC1155",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "_to",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "_id",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256[]",
              "name": "_amount",
              "type": "uint256[]"
            }
          ],
          "name": "multiSendERC1155",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "contract IERC721",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "_to",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "_id",
              "type": "uint256[]"
            }
          ],
          "name": "multiSendERC721",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address[]",
              "name": "_accounts",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "_amounts",
              "type": "uint256[]"
            }
          ],
          "name": "multiSendNativeToken",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "_accounts",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "_amounts",
              "type": "uint256[]"
            }
          ],
          "name": "multiSendToken",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
}

export default contract