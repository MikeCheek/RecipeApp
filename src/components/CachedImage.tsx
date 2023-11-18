import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {ImageProps} from 'react-native';

import Animated, {AnimatedProps} from 'react-native-reanimated';

interface CachedImageProps extends Omit<AnimatedProps<ImageProps>, 'source'> {
  uri: string;
}

export const CachedImage = (props: CachedImageProps) => {
  const [cachedSource, setCachedSource] = useState<{uri?: string}>({});
  const {uri} = props;

  useEffect(() => {
    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);
        if (cachedImageData) {
          setCachedSource({uri: cachedImageData});
        } else {
          const response = await fetch(uri);
          const imageBlob = await response.blob();
          const base64Data: string = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
          });
          await AsyncStorage.setItem(uri, base64Data);
          setCachedSource({uri: base64Data});
        }
      } catch (error) {
        console.info('Error caching image:', error);
        setCachedSource({uri});
      }
    };

    getCachedImage();
  }, []);

  return (
    <Animated.Image
      {...props}
      source={{
        uri:
          cachedSource.uri && cachedSource.uri != ''
            ? cachedSource.uri.startsWith('data:image/png;base64,')
              ? cachedSource.uri
              : 'data:image/png;base64,' + cachedSource.uri
            : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVAAAAFQAQAAAADBkxt0AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAB3YoTpAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+cLAw0FDjDnVXQAAABFSURBVGje7coxDQAADAOg+jfdWti9wE16FlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf9YBePrsC/+cZwYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMTEtMDNUMTM6MDU6MDcrMDA6MDCt4rwsAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTExLTAzVDEzOjA1OjA3KzAwOjAw3L8EkAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0xMS0wM1QxMzowNToxNCswMDowMHboP0wAAAAASUVORK5CYII=',
      }}
    />
  );
};
