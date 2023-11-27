import {View, Image} from 'react-native';
import React from 'react';
import {ImagePicker} from 'types';
import {pickImageFromCamera, pickImageFromGallery} from 'helpers/imagePicker';
import IconButton from './IconButton';
import {PhotoIcon, CameraIcon} from 'react-native-heroicons/outline';
import {hp, wp} from 'helpers/responsiveScreen';
interface AddImageProps {
  image?: ImagePicker;
  setImage: (image: ImagePicker) => void;
  big?: boolean;
}

const AddImage = ({image, setImage, big}: AddImageProps) => {
  const handlePickGallery = async () => {
    const i = await pickImageFromGallery();
    if (i && i.image) setImage(i);
  };

  const handlePickCamera = async () => {
    const i = await pickImageFromCamera();
    if (i && i.image) setImage(i);
  };

  return (
    <View
      style={big ? {} : {width: 200, height: 200}}
      className="rounded-2xl relative bg-white">
      {image ? (
        <Image
          source={{uri: image.image}}
          className="rounded-2xl"
          style={
            big
              ? {
                  width: wp(98),
                  height: hp(50),
                  borderRadius: 40,
                  marginTop: 4,
                }
              : {width: 200, height: 200}
          }
        />
      ) : (
        <></>
      )}
      <View className="flex flex-row items-center justify-around space-x-2 w-full absolute bottom-2 mx-auto">
        <IconButton
          big
          thickABit
          Icon={CameraIcon}
          onPress={handlePickCamera}
        />
        <IconButton
          big
          thickABit
          Icon={PhotoIcon}
          onPress={handlePickGallery}
        />
      </View>
    </View>
  );
};

export default AddImage;
