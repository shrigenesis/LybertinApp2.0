/* eslint-disable prettier/prettier */
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StoryType } from "./src";
import LinearGradient from 'react-native-linear-gradient';

const gradientColor = ['#FF4252', '#FF7500', '#FFB700', "#00BF15", "#006DDF", "#C02CDD"];


const { CubeNavigationHorizontal } = require("react-native-3dcube-navigation");

import StoryContainer from "./src/StoryContainer";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

type Props = {
  data: StoryType[];
  containerAvatarStyle?: StyleSheet.Styles;
  avatarStyle?: StyleSheet.Styles;
  titleStyle?: StyleSheet.Styles;
  textReadMore?: string;
  deleteOnPress: (id: number) => void;
  reportOnPress: (id: number) => void;
};

const Stories = (props: Props) => {
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);

  const onStorySelect = (index: number) => {
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    setModel(false);
  };


  const onStoryNext = (isScroll: boolean) => {
    const newIndex = currentUserIndex + 1;
    if (props.data.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        //erro aqui
        try {
          modalScroll?.current.scrollTo(newIndex, true);
        } catch (e) {
          console.warn("error=>", e);
        }
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll: boolean) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll?.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log("next");
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious(false);
      console.log("previous");
      setCurrentScrollValue(scrollValue);
    }
  };

  const getStoryUserName = (item: any) => {
    if (!item?.own_story) {
      return (item?.title?.length > 7) ? ((item?.title?.substring(0, 7)) + '...') : item?.title
    } else
      return 'Your story';
  }

  return (
    <View style={{ paddingVertical: heightPercentageToDP(1) }}>
      <FlatList
        style={{ width: widthPercentageToDP(100) - 100 }}
        data={props.data}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <View style={styles.boxStory}>
            <TouchableOpacity style={styles.boxStory1} onPress={() => onStorySelect(index)}>
              <LinearGradient colors={gradientColor} style={[styles.superCircle, props.containerAvatarStyle]}>
                <Image
                  style={[styles.circle, props.avatarStyle]}
                  source={{ uri: item?.profile }}
                />
              </LinearGradient>
              <Text style={[props.titleStyle]} numberOfLines={1}>
                {getStoryUserName(item)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll?.current?.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}
      >
        <CubeNavigationHorizontal
          callBackAfterSwipe={(g) => onScrollChange(g)}
          ref={modalScroll}
          style={styles.container}
        >
          {props.data.map((item, index) => (
            <StoryContainer
              key={item.title}
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              dataStories={item}
              deleteOnPress={(id) => { onStoryClose(), props.deleteOnPress(id) }}
              reportOnPress={(id) => { onStoryClose(), props.reportOnPress(id) }}
              isNewStory={index !== currentUserIndex}
              textReadMore={props.textReadMore}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};

const styles = new StyleSheet.create({
  boxStory: {
    marginLeft: 6,

  },
  boxStory1: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemSeparator: { height: 1, backgroundColor: "#ccc" },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#000',
  //   paddingBottom: 50,
  // },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 120,
    resizeMode: 'cover',
  },
  superCircle: {
    height: 55,
    width: 55,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 8,
    textAlign: "center",
  },
});

export default Stories;
