import AES from 'crypto-js/aes';


export default function getEncryptedText(array, signature) {

    const encryptedText = AES.encrypt(JSON.stringify(array), signature).toString()

    return encryptedText;
}