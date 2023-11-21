import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Touchable,
} from 'react-native';
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
import {pickImageFromCamera, pickImageFromGallery} from 'helpers/imagePicker';
import IconButton from 'components/IconButton';
import {
  PhotoIcon,
  CameraIcon,
  ClockIcon,
  UsersIcon,
  FireIcon,
  Square3Stack3DIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from 'react-native-heroicons/outline';
import {createRecipe, getRecipes} from 'helpers/db';
import {showMessage} from 'react-native-flash-message';
import useUserContext from 'helpers/useUserContext';
import useLoaderContext from 'helpers/useLoaderContext';
import useCategoryContext from 'helpers/useCategoryContext';
import {useAppDispatch} from 'redux/hooks';
import {setRecipes, setRecipesLoading} from 'redux/slices/recipes';
import {RecipeInfo} from 'types';
import RecipeBadge from 'components/RecipeBadge';
import Ingredient from 'components/Ingredient';
import CustomButton from 'components/CustomButton';

const AddScreen = () => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [info, setInfo] = useState<RecipeInfo>({});
  const [instructions, setInstructions] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [link, setLink] = useState<string>('');
  const [youtube, setYoutube] = useState<string>('');
  const [image, setImage] = useState<{
    image: string | undefined;
    imageType: string | undefined;
  }>();

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

  const handlePickGallery = async () => {
    const i = await pickImageFromGallery();
    if (i) setImage(i);
  };

  const handlePickCamera = async () => {
    const i = await pickImageFromCamera();
    if (i) setImage(i);
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
          className="space-y-2">
          <Text className={`${colors.heading} text-lg font-bold`}>Image</Text>
          <View className="flex flex-col justify-center items-center mx-4 space-y-4">
            <View
              className="rounded-2xl relative bg-white"
              style={{width: 200, height: 200}}>
              {image ? (
                <Image
                  source={{uri: image.image}}
                  className="rounded-2xl"
                  style={{width: 200, height: 200}}
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
          <View className="flex-row justify-around">
            <RecipeBadge
              title={info.minutes}
              setTitle={(title: string) =>
                setInfo(i => ({...i, minutes: title}))
              }
              description="Minutes"
              icon={
                <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              }
            />
            <RecipeBadge
              title={info.servings}
              setTitle={(title: string) =>
                setInfo(i => ({...i, servings: title}))
              }
              description="Servings"
              icon={
                <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              }
            />
            <RecipeBadge
              title={info.calories}
              setTitle={(title: string) =>
                setInfo(i => ({...i, calories: title}))
              }
              description="Calories"
              icon={<FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />}
            />
            <RecipeBadge
              title={info.difficulty}
              setTitle={(title: string) =>
                setInfo(i => ({...i, difficulty: title}))
              }
              description="Difficulty"
              icon={
                <Square3Stack3DIcon
                  size={hp(4)}
                  strokeWidth={2.5}
                  color="#525252"
                />
              }
            />
          </View>
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
