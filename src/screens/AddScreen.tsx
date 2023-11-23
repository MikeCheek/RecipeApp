import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTextInput from 'components/CustomTextInput';
import {colors} from 'theme';
import Categories from 'components/Categories';
import IconButton from 'components/IconButton';
import {MinusCircleIcon} from 'react-native-heroicons/outline';
import {createRecipe, getRecipes} from 'helpers/db';
import {showMessage} from 'react-native-flash-message';
import useUserContext from 'helpers/useUserContext';
import useLoaderContext from 'helpers/useLoaderContext';
import useCategoryContext from 'helpers/useCategoryContext';
import {useAppDispatch} from 'redux/hooks';
import {setRecipes, setRecipesLoading} from 'redux/slices/recipes';
import {ImagePicker, RecipeInfo} from 'types';
import RecipeBadge from 'components/RecipeBadge';
import Ingredient from 'components/Ingredient';
import CustomButton from 'components/CustomButton';
import AddImage from 'components/AddImage';
import AddInfo from 'components/AddInfo';

const AddScreen = () => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [info, setInfo] = useState<RecipeInfo>({});
  const [instructions, setInstructions] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [link, setLink] = useState<string>('');
  const [youtube, setYoutube] = useState<string>('');
  const [image, setImage] = useState<ImagePicker>();

  const dispatch = useAppDispatch();

  const {user} = useUserContext();
  const {setVisible} = useLoaderContext();
  const {active} = useCategoryContext();

  const refreshData = () => {
    dispatch(setRecipesLoading(true));
    getRecipes(active).then(data => dispatch(setRecipes(data)));
    dispatch(setRecipesLoading(false));
  };

  const removeIngredient = (index: number) => {
    setIngredients(i => {
      const array = [...i];
      array.splice(index, 1);
      return array;
    });
  };

  const add = async () => {
    if (
      name.trim().length > 0 &&
      category.trim().length > 0 &&
      location.trim().length > 0 &&
      instructions.trim().length > 0 &&
      info &&
      ingredients.length > 0 &&
      image
    ) {
      setVisible(true);
      const res = await createRecipe(
        {
          area: location,
          author: user?.uid,
          authorName: user?.displayName ?? 'unknown',
          category: category,
          image: '',
          name: name,
          youtube: youtube,
          instructions: instructions,
          info: info,
          ingredients: ingredients,
          datetime: new Date(Date.now()).getTime(),
          link: link,
        },
        image,
      );
      setVisible(false);
      showMessage({message: name + ' added', type: 'success'});
      if (active.toLowerCase() === 'all' || category == active) refreshData();
    } else
      showMessage({
        message: 'Fill all required fields',
        type: 'warning',
      });
  };

  if (user?.isAnonymous)
    return (
      <ScreenWrapper className="flex items-center justify-center w-full h-full">
        <Text
          style={{color: colors.cta}}
          className="mx-10 font-extrabold text-2xl text-center">
          You need to create an account to add recipes
        </Text>
      </ScreenWrapper>
    );
  return (
    <ScreenWrapper
      scrollable
      inputs
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 60}}>
      <StatusBar barStyle="light-content" />
      <View className="flex-row justify-center">
        <Text
          style={{fontSize: hp(3.8)}}
          className="font-semibold text-neutral-600 mt-4">
          Add a <Text style={{color: colors.yellow}}>tasty</Text> recipe
        </Text>
      </View>
      <View className="px-4 flex justify-between space-y-4 pt-8">
        <Animated.View
          entering={FadeInDown.duration(700).springify().damping(12)}
          className="flex flex-col space-y-2">
          <Text className={`${colors.heading} text-lg font-bold`}>Image</Text>
          <View className="flex flex-col justify-center items-center mx-4 space-y-4">
            <AddImage image={image} setImage={setImage} />
          </View>
          <Text className={`${colors.heading} text-lg font-bold`}>
            Category
          </Text>
          <Categories noAll active={category} setActive={setCategory} />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(100)
            .duration(700)
            .springify()
            .damping(12)}>
          <CustomTextInput text="Name" value={name} onChangeText={setName} />
          <CustomTextInput
            text="Geographic Area"
            value={location}
            onChangeText={setLocation}
            autoComplete="country"
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(700).springify().damping(12)}
          className="flex-col justify-around">
          <Text className={`${colors.heading} text-lg font-bold`}>Info</Text>
          <AddInfo info={info} setInfo={setInfo} />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(300).duration(700).springify().damping(12)}
          className="flex flex-col gap-y-4 items-start">
          <Text className={`${colors.heading} text-lg font-bold`}>
            Ingredients
          </Text>
          <View className="flex flex-col gap-y-2 ml-3">
            {ingredients.map((ingredient, key) => (
              <View
                key={key}
                className="flex flex-row justify-between items-center py-1 w-full relative">
                <Ingredient
                  ingredient={ingredient}
                  setIngredient={t =>
                    setIngredients(is => is.map((i, k) => (k === key ? t : i)))
                  }
                />
                <View className="absolute top-0 right-[5%]">
                  <IconButton
                    big
                    Icon={MinusCircleIcon}
                    onPress={() => removeIngredient(key)}
                  />
                </View>
              </View>
            ))}
          </View>
          <View className="flex items-center justify-center w-full">
            <TouchableOpacity onPress={() => setIngredients(i => [...i, ''])}>
              <Text className="text-base" style={{color: colors.cta}}>
                Add ingredient
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400)
            .duration(700)
            .springify()
            .damping(12)}>
          <CustomTextInput
            textArea
            text="Instructions"
            value={instructions}
            onChangeText={setInstructions}
          />
        </Animated.View>
        <View>
          <CustomTextInput
            text="Link (Optional)"
            value={link}
            onChangeText={setLink}
            keyboardType="url"
            autoComplete="url"
          />
        </View>
        <View>
          <CustomTextInput
            text="Youtube video (Optional)"
            value={youtube}
            onChangeText={setYoutube}
            keyboardType="url"
            autoComplete="url"
          />
        </View>
      </View>
      <CustomButton onPress={add} text="Add Recipe" />
    </ScreenWrapper>
  );
};

export default AddScreen;
