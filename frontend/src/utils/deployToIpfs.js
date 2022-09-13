import { NFTStorage, File } from 'nft.storage/dist/bundle.esm.min.js'

export default async function deployToIpfs(data) {
  const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk0ZUQxRGY0NmMxMzc4RjQ4QTc2MkQxQjkwNmM2QTUxMkFlNzdFQkYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTQyMzM1ODA3NSwibmFtZSI6ImNyeXB0b0Zsb3cifQ.MZs_cjKfV-Mm4oJD77O_PaZF1c2BbTe_GWZ_1YrCtII' })
  const someData = new File([data], 'Addresses.csv', { type: 'text/csv' });
  const cid = await client.storeBlob(someData)
  return cid
}

