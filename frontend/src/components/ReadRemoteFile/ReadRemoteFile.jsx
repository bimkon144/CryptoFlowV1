// import React from 'react';

// import { usePapaParse } from 'react-papaparse';

// export default function ReadRemoteFile() {
//   const { readRemoteFile } = usePapaParse();

//   const handleReadRemoteFile = () => {
//     readRemoteFile('https://ipfs.io/ipfs/bafybeibe4izoh22dyekc7xgmbgfo2qzktdhe42ipx4qmtjfiyn7ixp5yfm/README1.csv', {
//       complete: (results) => {
//         const newArray = results.data.filter(n => n != '');
//         console.log('---------------------------');
//         console.log('Results:', results);
//         console.log('---------------------------');
//       },
//     });
//   };

//   return <button onClick={() => handleReadRemoteFile()}>readRemoteFile</button>;
// }