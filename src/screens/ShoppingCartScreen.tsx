import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {hp} from 'helpers/responsiveScreen';
import {colors} from 'theme';
import useUserContext from 'helpers/useUserContext';
import {
  addToShoppingList,
  checkShoppingList,
  removeFromShoppingList,
} from 'helpers/db';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import CustomTextInput from 'components/CustomTextInput';
import {ShoppingItem} from 'types';
import IconButton from 'components/IconButton';
import {PlusIcon} from 'react-native-heroicons/outline';
import ShoppingItemElement from 'components/ShoppingItemElement';

const IDKScreen = () => {
  const [newItem, setNewItem] = useState<Partial<ShoppingItem>>({});
  const {user, userData, refreshUserData} = useUserContext();
  const list = userData?.shopping?.list;

  const addToList = async () => {
    await addToShoppingList(user!.uid, [newItem]);
    refreshUserData();
    setNewItem({});
  };

  const checkItem = async (item: ShoppingItem) => {
    await checkShoppingList(user!.uid, item, !item.checked);
    refreshUserData();
  };

  const removeItem = async (item: ShoppingItem) => {
    await removeFromShoppingList(user!.uid, item);
    refreshUserData();
  };

  return (
    <ScreenWrapper>
      <View className="mx-4 my-4">
        <Text
          style={{fontSize: hp(3.8)}}
          className="font-semibold text-neutral-600 text-right">
          Don't forget <Text style={{color: colors.yellow}}>anything</Text> next
          time
        </Text>
        <Text
          style={{fontSize: hp(2.3), color: colors.cta}}
          className="font-bold text-neutral-600 mb-2">
          Shopping list:
        </Text>
        <ScrollView className="-mx-4">
          {list
            ? list.map((item, key) => (
                <ShoppingItemElement
                  item={item}
                  key={list.length % 2 == 0 ? key : key + list.length}
                  check={checkItem}
                  deleteItem={removeItem}
                />
              ))
            : null}
          <View className="w-full mt-4 flex flex-row items-start justify-evenly">
            <CustomTextInput
              value={newItem.item}
              onChangeText={t => setNewItem(i => ({...i, item: t}))}
              fullWitdth={false}
            />
            <IconButton onPress={addToList} Icon={PlusIcon} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default IDKScreen;
