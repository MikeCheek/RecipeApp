import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

const options: ImageLibraryOptions = {
  mediaType: 'photo',
  includeBase64: true,
  maxHeight: 2000,
  maxWidth: 2000,
};

export const pickImageFromGallery = async (): Promise<{
  image: string | undefined;
  imageType: string | undefined;
}> => {
  let imageUri;
  let imageType;
  await launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('Image picker error: ', response.errorMessage);
    } else {
      imageUri = response.assets?.[0].uri;
      imageType = response.assets?.[0].type;
      //response.assets?.[0].uri ||
    }
  });

  return {image: imageUri, imageType: imageType};
};

export const pickImageFromCamera = async (): Promise<{
  image: string | undefined;
  imageType: string | undefined;
}> => {
  let imageUri;
  let imageType;

  await launchCamera(options, response => {
    if (response.didCancel) {
      console.log('User cancelled camera');
    } else if (response.errorMessage) {
      console.log('Camera Error: ', response.errorMessage);
    } else {
      imageUri = response.assets?.[0].uri;
      imageType = response.assets?.[0].type;
      //response.assets?.[0].uri ||
    }
  });

  return {image: imageUri, imageType: imageType};
};
