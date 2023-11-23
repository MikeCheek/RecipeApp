import {Linking, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RecipeDetailsScreenProps} from 'navigation/types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ChevronLeftIcon,
  ClockIcon,
  FireIcon,
  MinusCircleIcon,
  Square3Stack3DIcon,
  UsersIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import {HeartIcon, PencilIcon} from 'react-native-heroicons/solid';
import {ImagePicker, RecipeDetails, RecipeInfo} from 'types';
import Loader from 'components/Loader';
import RecipeBadge from 'components/RecipeBadge';
import YoutubeIframe from 'react-native-youtube-iframe';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';
import ScreenWrapper from 'components/ScreenWrapper';
import IconButton from 'components/IconButton';
import {
  getRecipeDetails,
  likeRecipe,
  unlikeRecipe,
  updateRecipe,
} from 'helpers/db';
import useUserContext from 'helpers/useUserContext';
import Ingredient from 'components/Ingredient';
import {colors} from 'theme';
import AddImage from 'components/AddImage';
import CustomTextInput from 'components/CustomTextInput';
import AddInfo from 'components/AddInfo';
import CustomButton from 'components/CustomButton';
import {showMessage} from 'react-native-flash-message';
import useLoaderContext from 'helpers/useLoaderContext';

const RecipeDetailsScreen = ({navigation, route}: RecipeDetailsScreenProps) => {
  const {id, image, name} = route.params;

  const [favourite, setFavourite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recipeDetails, setRecipeDetails] = useState<Partial<RecipeDetails>>();
  const [editMode, setEditMode] = useState<boolean>(false);

  const [servings, setServings] = useState<number>(0);
  const [weigthedIngredients, setWeightedIngredients] = useState<string[]>();
  const {user} = useUserContext();

  // const [imageEdit, setImageEdit] = useState<ImagePicker>({
  //   image: image,
  //   imageType: '',
  // });
  const [nameEdit, setNameEdit] = useState<string>(name);
  const [areaEdit, setAreaEdit] = useState<string>();
  const [ingredientsEdit, setIngredientsEdit] = useState<string[]>([]);
  const [infoEdit, setInfoEdit] = useState<RecipeInfo>({});
  const [instructionsEdit, setInstructionsEdit] = useState<string>();
  const [linkEdit, setLinkEdit] = useState<string>();
  const [youtubeEdit, setYoutubeEdit] = useState<string>();

  const {setVisible} = useLoaderContext();

  const imTheAuthor =
    user && recipeDetails ? user.uid === recipeDetails.author : false;

  const handleHeart = () => {
    setFavourite(fav => {
      const newFav = !fav;
      if (newFav) likeRecipe(user!.uid, id);
      if (newFav) unlikeRecipe(user!.uid, id);
      return newFav;
    });
  };

  const handleEdit = () => {
    setEditMode(v => !v);
  };

  const removeIngredient = (index: number) => {
    setIngredientsEdit(i => {
      const array = [...i];
      array.splice(index, 1);
      return array;
    });
  };

  const handleGetRecipeDetails = async () => {
    setLoading(true);
    const data = await getRecipeDetails(id);
    setRecipeDetails(data); // recipeDetailsAPIToData(data));
    setLoading(false);
  };

  const getYoutubeVideoId = (url: string) => {
    const regex =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regex);
    return match && match[7].length == 11 ? match[7] : undefined;
  };

  const fetchData = () => {
    try {
      handleGetRecipeDetails();
    } catch (e) {
      console.log(e);
    }
  };

  const updateWeightedIngredients = () => {
    if (recipeDetails?.ingredients) {
      let tmp = [];
      for (let i = 0; i < recipeDetails.ingredients.length; i++) {
        const [name, others] = recipeDetails.ingredients[i].split(':');
        if (others) {
          const values = others.match(/\d+/);
          const value = values ? Number(values[0]) : null;
          if (value === null || !recipeDetails.info?.servings)
            tmp.push(recipeDetails.ingredients[i]);
          else {
            const newValue =
              (value / Number(recipeDetails.info.servings)) * servings;
            const newIngredient =
              name +
              ':' +
              others.replace(value.toString(), newValue.toString());
            tmp.push(newIngredient);
          }
        } else tmp.push(name);
      }
      setWeightedIngredients(tmp);
    }
  };

  const update = async () => {
    if (
      recipeDetails &&
      nameEdit.trim().length > 0 &&
      areaEdit &&
      areaEdit.trim().length > 0 &&
      instructionsEdit &&
      instructionsEdit.trim().length > 0 &&
      infoEdit &&
      ingredientsEdit.length > 0
    ) {
      setVisible(true);
      const res = await updateRecipe({
        ...recipeDetails,
        area: areaEdit,
        id: id,
        name: nameEdit,
        instructions: instructionsEdit,
        youtube: youtubeEdit,
        dateModified: new Date(Date.now()).getTime(),
        info: infoEdit,
        ingredients: ingredientsEdit,
        image: image,
        category: recipeDetails.category ?? '',
        datetime: recipeDetails.datetime ?? new Date(Date.now()).getTime(),
      });
      fetchData();
      setVisible(false);
      showMessage({message: 'Recipe updated!', type: 'success'});
      setEditMode(false);
    } else
      showMessage({
        message: 'Fill all required fields',
        type: 'warning',
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (recipeDetails) {
      if (recipeDetails.info?.servings)
        setServings(Number(recipeDetails?.info?.servings));
      setAreaEdit(recipeDetails.area);
      setInfoEdit(recipeDetails.info ?? {});
      setIngredientsEdit(recipeDetails.ingredients ?? []);
      setInstructionsEdit(recipeDetails.instructions);
      setLinkEdit(recipeDetails.link);
      setYoutubeEdit(recipeDetails.youtube);
    }
  }, [recipeDetails]);

  useEffect(() => {
    if (
      recipeDetails?.info?.servings &&
      servings != Number(recipeDetails?.info?.servings)
    ) {
      updateWeightedIngredients();
    } else setWeightedIngredients(undefined);
  }, [servings]);

  return (
    <ScreenWrapper
      scrollable
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: hp(20)}}>
      <StatusBar barStyle="light-content" />
      <View className="flex-row justify-center">
        {/* {editMode ? (
          <AddImage image={imageEdit} setImage={setImageEdit} big />
        ) : ( */}
        <Animated.Image
          source={{uri: image}}
          sharedTransitionTag={name}
          style={{
            width: wp(98),
            height: hp(50),
            borderRadius: 53,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
        />
        {/* )} */}
      </View>
      <Animated.View
        entering={FadeIn.delay(200).duration(1000)}
        className="w-full absolute flex-row justify-between items-center top-5 px-5">
        <IconButton
          Icon={ChevronLeftIcon}
          thick
          onPress={() => navigation.goBack()}
        />
        <View className="flex flex-row space-x-2">
          {imTheAuthor ? (
            <TouchableOpacity
              onPress={handleEdit}
              className="p-2 rounded-full bg-white">
              {editMode ? (
                <XMarkIcon
                  size={hp(3.5)}
                  strokeWidth={4.5}
                  color={colors.cta}
                />
              ) : (
                <PencilIcon size={hp(3.5)} strokeWidth={4.5} color={'gray'} />
              )}
            </TouchableOpacity>
          ) : null}
          {editMode ? null : (
            <TouchableOpacity
              onPress={handleHeart}
              className="p-2 rounded-full bg-white">
              <HeartIcon
                size={hp(3.5)}
                strokeWidth={4.5}
                color={favourite ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      {loading ? (
        <Loader />
      ) : recipeDetails ? (
        <View className="px-4 flex justify-between space-y-4 pt-8">
          <Animated.View
            entering={FadeInDown.duration(700).springify().damping(12)}
            className="space-y-2">
            {editMode ? (
              <>
                <CustomTextInput
                  style={{fontSize: hp(3)}}
                  className="font-bold flex-1 text-neutral-700"
                  value={nameEdit}
                  text="Name"
                  onChangeText={setNameEdit}
                />
                <CustomTextInput
                  style={{fontSize: hp(3)}}
                  className="font-bold flex-1 text-neutral-700"
                  value={areaEdit}
                  text="Geografic Area"
                  onChangeText={setAreaEdit}
                />
              </>
            ) : (
              <>
                <Text
                  style={{fontSize: hp(3)}}
                  className="font-bold flex-1 text-neutral-700">
                  {recipeDetails.name ?? name}
                </Text>
                <Text
                  style={{fontSize: hp(2)}}
                  className="font-medium flex-1 text-neutral-500">
                  {recipeDetails.area}
                </Text>
              </>
            )}
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(100)
              .duration(700)
              .springify()
              .damping(12)}
            className="flex-row justify-around">
            <AddInfo
              info={(editMode ? infoEdit : recipeDetails.info) ?? {}}
              setInfo={editMode ? setInfoEdit : undefined}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200)
              .duration(700)
              .springify()
              .damping(12)}
            className="space-y-4">
            <View className="flex flex-row space-x-4">
              <Text
                style={{fontSize: hp(1.7)}}
                className="font-bold flex-1 text-neutral-700">
                Ingredients
              </Text>
              {editMode ? null : (
                <View className="flex flex-row">
                  <TouchableOpacity
                    className="py-2 px-4 rounded-bl-full rounded-tl-full"
                    style={{backgroundColor: colors.cta}}
                    onPress={() => setServings(s => s - 1)}
                    disabled={servings <= 1}>
                    <Text className="font-extrabold text-white">-</Text>
                  </TouchableOpacity>
                  <Text
                    className="py-2 px-4 font-extrabold text-white"
                    style={{backgroundColor: colors.cta}}>
                    {servings}
                  </Text>
                  <TouchableOpacity
                    className="py-2 px-4 rounded-br-full rounded-tr-full"
                    style={{backgroundColor: colors.cta}}
                    onPress={() => setServings(s => s + 1)}>
                    <Text className="font-extrabold text-white">+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View className="space-y-2 ml-3">
              {loading ? (
                <Loader />
              ) : editMode ? (
                <>
                  <>
                    {ingredientsEdit.map((ingredient, key) => (
                      <View
                        key={key}
                        className="flex flex-row justify-between items-center py-1 w-full relative">
                        <Ingredient
                          ingredient={ingredient}
                          setIngredient={t =>
                            setIngredientsEdit(is =>
                              is.map((i, k) => (k === key ? t : i)),
                            )
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
                  </>
                  <View className="flex items-center justify-center w-full">
                    <TouchableOpacity
                      onPress={() => setIngredientsEdit(i => [...i, ''])}>
                      <Text className="text-base" style={{color: colors.cta}}>
                        Add ingredient
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : weigthedIngredients ? (
                weigthedIngredients.map((ingredient, key) => (
                  <Ingredient key={key} ingredient={ingredient} modified />
                ))
              ) : recipeDetails.ingredients &&
                recipeDetails.ingredients.length > 0 ? (
                recipeDetails.ingredients.map((ingredient, key) => (
                  <Ingredient key={key} ingredient={ingredient} />
                ))
              ) : (
                <Text>No ingredients</Text>
              )}
            </View>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(300)
              .duration(700)
              .springify()
              .damping(12)}
            className="space-y-4">
            {editMode ? (
              <CustomTextInput
                textArea
                text="Instructions"
                style={{fontSize: hp(1.8)}}
                className="text-neutral-700"
                value={instructionsEdit}
                onChangeText={setInstructionsEdit}
              />
            ) : (
              <>
                <Text
                  style={{fontSize: hp(1.7)}}
                  className="font-bold flex-1 text-neutral-700">
                  Instructions
                </Text>
                <Text style={{fontSize: hp(1.8)}} className="text-neutral-700">
                  {recipeDetails.instructions ?? 'No instructions'}
                </Text>
              </>
            )}
            {editMode ? (
              <CustomTextInput
                text="Link (Optional)"
                style={{fontSize: hp(1.8)}}
                className="text-neutral-700"
                value={linkEdit}
                onChangeText={setLinkEdit}
              />
            ) : recipeDetails.link ? (
              <View className="flex items-start justify-start">
                <Text
                  style={{fontSize: hp(1.7)}}
                  className="font-bold flex-1 text-neutral-700 mt-4">
                  Link
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(recipeDetails.link ?? '')}>
                  <Text
                    style={{
                      fontSize: hp(1.8),
                      color: colors.secondaryCta,
                      // borderBottomWidth: 2,
                      borderColor: colors.secondaryCta,
                    }}>
                    {recipeDetails.link}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </Animated.View>

          {editMode ? (
            <CustomTextInput
              text="Youtube (Optional)"
              style={{fontSize: hp(1.8)}}
              className="text-neutral-700"
              value={youtubeEdit}
              onChangeText={setYoutubeEdit}
            />
          ) : recipeDetails.youtube ? (
            <Animated.View
              entering={FadeInDown.delay(400)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4">
              <Text
                style={{fontSize: hp(1.7)}}
                className="font-bold flex-1 text-neutral-700">
                Recipe Video
              </Text>
              <View>
                <YoutubeIframe
                  videoId={getYoutubeVideoId(recipeDetails.youtube)}
                  height={hp(30)}
                />
              </View>
            </Animated.View>
          ) : null}

          {editMode ? (
            <CustomButton onPress={update} text="Update recipe" />
          ) : null}
        </View>
      ) : (
        <Text>Error fetching recipe details</Text>
      )}
    </ScreenWrapper>
  );
};

export default RecipeDetailsScreen;
