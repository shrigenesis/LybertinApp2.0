/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  NativeTouchEvent,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";


import GestureRecognizer from "react-native-swipe-gestures";
import Story from "./Story";
import UserView from "./UserView";
import ProgressArray from "./ProgressArray";
import { StoriesType, StoryType } from ".";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  dataStories: StoriesType;
  onStoryNext: (boolean: boolean) => void;
  onStoryPrevious: (boolean: boolean) => void;
  onClose: () => void;
  deleteOnPress: (id: number) => void;
  reportOnPress: (id: number) => void;
  isNewStory: boolean;
  textReadMore: string;
  itemIndex: number
};

const StoryContainer: React.FC<Props> = (props: Props) => {
  const { dataStories, deleteOnPress, reportOnPress, itemIndex } = props;
  const { stories = [] } = dataStories || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModelOpen, setModel] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(3);
  const story = stories.length ? stories[currentIndex] : {};
  const { isReadMore }: StoryType = story || {};
  const [isFirstLoad, setisFirstLoad] = useState(false)

  // const onVideoLoaded = (length) => {
  //   props.onVideoLoaded(length.duration);
  // };

  useEffect(() => {
    console.log(stories);
        
    setTimeout(()=>{
      setisFirstLoad(true)
    }, Platform.OS==='ios'? 1000: 100)

    if (story.type === 'image') {
      if(Platform.OS==='ios'){
        setLoaded(true);
      }
    }
  }, [story])


  const changeStory = (evt: NativeTouchEvent) => {
    if (evt.locationX > SCREEN_WIDTH / 2) {
      nextStory();
    } else {
      prevStory();
    }
  };

  const nextStory = () => {
    if (stories.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      setLoaded(false);
      // if(story.type==='image'){
      //   setLoaded(true);
      // }
      setDuration(3);
    } else {
      setCurrentIndex(0);
      props.onStoryNext(false);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0 && stories.length) {
      setCurrentIndex(currentIndex - 1);
      setLoaded(false);
      setDuration(3);
      // if(story.type==='image'){
      //   setLoaded(true);
      // }
    } else {
      setCurrentIndex(0);
      props.onStoryPrevious(false);
    }
  };

  const onImageLoaded = () => {
    setLoaded(true);
  };

  const onVideoLoaded = (length) => {
    setLoaded(true);
    setDuration(length.duration);
  };

  const onPause = (result) => {
    setIsPause(result);
  };

  // const onReadMoreOpen = () => {
  //   setIsPause(true);
  //   setModel(true);
  // };
  // const onReadMoreClose = () => {
  //   setIsPause(false);
  //   setModel(false);
  // };

  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <View>
            <Story
              onImageLoaded={onImageLoaded}
              pause
              onVideoLoaded={onVideoLoaded}
              story={story}
            />
          </View>
          <View style={{position: 'absolute', top: heightPercentageToDP(49), left: widthPercentageToDP(48) }}>
            <ActivityIndicator color="white" />
          </View>
        </View>
      );
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeDown = () => {
    if (!isModelOpen) {
      props.onClose();
    } else {
      setModel(false);
    }
  };

  const onSwipeUp = () => {
    if (!isModelOpen && isReadMore) {
      setModel(true);
    }
  };

  return (
    <>
    {isFirstLoad?
      <GestureRecognizer
      onSwipeDown={onSwipeDown}
      onSwipeUp={onSwipeUp}
      config={config}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={500}
        onPress={(e) => changeStory(e.nativeEvent)}
        onLongPress={() => onPause(true)}
        onPressOut={() => onPause(false)}
        style={styles.container}
      >
        <View style={styles.container}>
          <Story
            onImageLoaded={onImageLoaded}
            pause={isPause}
            isNewStory={props.isNewStory}
            onVideoLoaded={onVideoLoaded}
            story={story}
          />

          {loading()}

          
          <UserView
            name={dataStories?.username}
            profile={dataStories?.profile}
            datePublication={stories[currentIndex].created}
            story={story}
            onClosePress={props.onClose}
            deleteOnPress={deleteOnPress}
            reportOnPress={reportOnPress}
          />

          <ProgressArray
            next={nextStory}
            isLoaded={isLoaded}
            duration={duration}
            pause={isPause}
            isNewStory={props.isNewStory}
            stories={stories}
            currentIndex={currentIndex}
            currentStory={stories[currentIndex]}
            length={stories.map((_, i) => i)}
            progress={{ id: currentIndex }}
          />
         

          {/* {isReadMore && (
            <Readmore title={props.textReadMore} onReadMore={onReadMoreOpen} />
          )} */}
          
        </View>

        {/* <Modal
          style={styles.modal}
          position="bottom"
          isOpen={isModelOpen}
          onClosed={onReadMoreClose}
        >
          <View style={styles.bar} />
          <WebView source={{ uri: stories[currentIndex].url_readmore }} />
        </Modal> */}
      </TouchableOpacity>
    </GestureRecognizer>:null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0
  },
  progressBarArray: {
    flexDirection: "row",
    position: "absolute",
    top: 30,
    width: "98%",
    height: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userView: {
    flexDirection: "row",
    position: "absolute",
    top: 55,
    width: "98%",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 12,
    color: "white",
  },
  time: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 3,
    marginLeft: 12,
    color: "white",
  },
  content: { width: "100%", height: "100%" },
  loading: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bar: {
    width: 50,
    height: 8,
    backgroundColor: "gray",
    alignSelf: "center",
    borderRadius: 4,
    marginTop: 8,
  },
});

export default StoryContainer;
