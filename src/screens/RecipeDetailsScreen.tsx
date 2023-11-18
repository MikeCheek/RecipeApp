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
  Square3Stack3DIcon,
  UsersIcon,
} from 'react-native-heroicons/outline';
import {HeartIcon} from 'react-native-heroicons/solid';
import {RecipeDetails} from 'types';
import Loader from 'components/Loader';
import RecipeBadge from 'components/RecipeBadge';
import YoutubeIframe from 'react-native-youtube-iframe';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';
import ScreenWrapper from 'components/ScreenWrapper';
import IconButton from 'components/IconButton';
import {getRecipeDetails, likeRecipe, unlikeRecipe} from 'helpers/db';
import useUserContext from 'helpers/useUserContext';
import Ingredient from 'components/Ingredient';
import {colors} from 'theme';

const RecipeDetailsScreen = ({navigation, route}: RecipeDetailsScreenProps) => {
  const {id, image, name} = route.params;

  const [favourite, setFavourite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recipeDetails, setRecipeDetails] = useState<Partial<RecipeDetails>>();

  const {user} = useUserContext();

  const handleHeart = () => {
    setFavourite(fav => {
      const newFav = !fav;
      if (newFav) likeRecipe(user!.uid, id);
      if (newFav) unlikeRecipe(user!.uid, id);
      return newFav;
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScreenWrapper
      scrollable
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: hp(20)}}>
      <StatusBar barStyle="light-content" />
      <View className="flex-row justify-center">
        <Animated.Image
          source={{uri: image}}
          sharedTransitionTag={id}
          style={{
            width: wp(98),
            height: hp(50),
            borderRadius: 53,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
        />
      </View>
      <Animated.View
        entering={FadeIn.delay(200).duration(1000)}
        className="w-full absolute flex-row justify-between items-center top-5 px-5">
        <IconButton
          Icon={ChevronLeftIcon}
          thick
          onPress={() => navigation.goBack()}
        />
        <TouchableOpacity
          onPress={handleHeart}
          className="p-2 rounded-full bg-white">
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={favourite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </Animated.View>
      {loading ? (
        <Loader />
      ) : recipeDetails ? (
        <View className="px-4 flex justify-between space-y-4 pt-8">
          <Animated.View
            entering={FadeInDown.duration(700).springify().damping(12)}
            className="space-y-2">
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
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(100)
              .duration(700)
              .springify()
              .damping(12)}
            className="flex-row justify-around">
            <RecipeBadge
              title={recipeDetails.info?.minutes}
              description="Minutes"
              icon={
                <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              }
            />
            <RecipeBadge
              title={recipeDetails.info?.servings}
              description="Servings"
              icon={
                <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              }
            />
            <RecipeBadge
              title={recipeDetails.info?.calories}
              description="Calories"
              icon={<FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />}
            />
            <RecipeBadge
              title={recipeDetails.info?.difficulty}
              description="Difficulty"
              icon={
                <Square3Stack3DIcon
                  size={hp(4)}
                  strokeWidth={2.5}
                  color="#525252"
                />
              }
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200)
              .duration(700)
              .springify()
              .damping(12)}
            className="space-y-4">
            <Text
              style={{fontSize: hp(1.7)}}
              className="font-bold flex-1 text-neutral-700">
              Ingredients
            </Text>
            <View className="space-y-2 ml-3">
              {loading ? (
                <Loader />
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
            <Text
              style={{fontSize: hp(1.7)}}
              className="font-bold flex-1 text-neutral-700">
              Instructions
            </Text>
            <Text style={{fontSize: hp(1.8)}} className="text-neutral-700">
              {recipeDetails.instructions ?? 'No instructions'}
            </Text>
            {recipeDetails.link ? (
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

          {recipeDetails.youtube ? (
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
        </View>
      ) : (
        <Text>Error fetching recipe details</Text>
      )}
    </ScreenWrapper>
  );
};

export default RecipeDetailsScreen;
