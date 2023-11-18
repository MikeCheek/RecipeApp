export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.toString());
    reader.readAsDataURL(blob);
  });
};

export const base64toBlob = async (base64Data: string, contentType = '') => {
  const bytes = atob(base64Data);
  const byteNumbers = new Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    byteNumbers[i] = bytes.charCodeAt(i);
  }
  const blob = new Blob(byteNumbers, {type: contentType} as BlobOptions);

  return blob;
  // contentType = contentType || '';
  // const sliceSize = 1024;
  // const byteCharacters = atob(base64Data.replace(/\s/g, ''));
  // const bytesLength = byteCharacters.length;
  // const slicesCount = Math.ceil(bytesLength / sliceSize);
  // const byteArrays = new Array(slicesCount);

  // for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
  //   const begin = sliceIndex * sliceSize;
  //   const end = Math.min(begin + sliceSize, bytesLength);

  //   const bytes = new Array(end - begin);
  //   for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
  //     bytes[i] = byteCharacters[offset].charCodeAt(0);
  //   }
  //   byteArrays[sliceIndex] = new Uint8Array(bytes);
  // }
  // return new Blob(byteArrays, {type: contentType} as BlobOptions);
};
