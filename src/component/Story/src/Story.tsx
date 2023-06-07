/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unused-prop-types */
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import Image from 'react-native-scalable-image';
import PropTypes from 'prop-types';
import {StoryType} from '.';
import {Text} from 'react-native-elements';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {Linking} from 'react-native';
import {IMAGE, color, fontFamily, fontSize} from '../../../constant';
import SvgUri from 'react-native-svg-uri';

const ScreenWidth = Dimensions.get('window').width;

type Props = {
  story: StoryType;
  onVideoLoaded?: (Object) => void;
  onImageLoaded?: () => void;
  pause: boolean;
  isLoaded?: boolean;
  isNewStory?: boolean;
};
const Story = (props: Props) => {
  const {story} = props;
  const {
    url,
    type,
    caption,
    url_readmore,
    isReadMore,
    linkPreview,
    showPreview,
  } = story || {};
  const [isPortation, setIsPortation] = useState(false);
  const [heightScaled, setHeightScaled] = useState(231);
  const loadInBrowser = link => {
    Linking.openURL(link).catch(err =>
      console.error("Couldn't load page", err),
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />
      {/* {!props.isLoaded && (
      <View style={styles.loading}>
        <ActivityIndicator color="white" />
      </View>
      )} */}
      {type === 'image' ? (
        <View
          style={{
            height: '100%',
            width: '100%',
          }}>
          {!isReadMore && (
            <Image
              source={{uri: url}}
              onLoadEnd={props.onImageLoaded}
              style={styles.content}
              resizeMode="contain"
              // width={ScreenWidth}
            />
          )}
          {isReadMore && (
            <View style={styles.linkWrapper}>
              {!showPreview ? (
                <TouchableOpacity
                  onPress={() => {
                    loadInBrowser(url_readmore);
                  }}>
                  <Text style={{color: '#fff', fontSize: 20}}>
                    {url_readmore}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                onPress={() => {
                  loadInBrowser(url_readmore);
                }}
                style={styles.storywrapperbox}>
                  <View style={{alignSelf: 'center'}}>
                    {(linkPreview.favicon.includes('.svg') || !linkPreview.favicon) ? (
                     <SvgUri
                     width={wp(25)}
                     height={wp(25)}
                     source={{uri:linkPreview.favicon}}
                   />
                    ) : (
                      <Image
                        style={{height: wp(25), width: wp(25)}}
                        source={{uri: linkPreview.favicon}}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      padding: 10,
                      gap: 5,
                      width: wp(60),
                    }}>
                    <Text style={styles.TextTitle}>{linkPreview.title}</Text>
                    <Text style={styles.TextDesc}>
                      {linkPreview.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      ) : (
        <Video
          source={{uri: url}}
          paused={props.pause || props.isNewStory}
          onLoad={item => {
            const {width, height} = item.naturalSize;
            const heightScaled = height * (ScreenWidth / width);
            let isPortrait = height > width;
            setIsPortation(height > width);
            setHeightScaled(heightScaled);
            props.onVideoLoaded(item);

            console.warn(width, height, heightScaled);
            console.warn('É PAISAGEM?', isPortrait);
          }}
          // style={
          //   isPortation
          //     ? [styles.contentVideoPortation, { height: heightScaled }]
          //     : [styles.contentVideo, { height: heightScaled }]
          // }
          style={
            Platform.OS === 'ios'
              ? [
                  styles.contentVideo,
                  {
                    height: isPortation
                      ? heightScaled
                      : heightPercentageToDP(100),
                  },
                ]
              : isPortation
              ? [styles.contentVideoPortation, {height: heightScaled}]
              : [styles.contentVideo, {height: heightScaled}]
          }
          resizeMode={Platform.OS === 'ios' ? 'center' : 'stretch'}
        />
      )}
      {!isReadMore && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            backgroundColor: '#000',
            paddingVertical: heightPercentageToDP(1),
          }}>
          <Text
            style={{
              color: '#fff',
              paddingHorizontal: heightPercentageToDP(1),
              fontSize: 18,
              textAlign: 'center',
              paddingBottom: 10,
            }}>
            {caption}{' '}
          </Text>
        </View>
      )}
    </View>
  );
};

Story.propTypes = {
  story: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

//  720 405 231.42857142857142

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {width: '100%', height: '100%', flex: 1, resizeMode: 'contain'},
  linkWrapper: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: wp(100),
    backgroundColor: '#681f84',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentVideo: {
    width: ScreenWidth + 20,
    //aspectRatio: 1,
    backgroundColor: '#000',
    //flex: 1,
    height: 231,
  },
  contentVideoPortation: {
    width: ScreenWidth + 20,
    //aspectRatio: 1,
    backgroundColor: '#000',
    //flex: 1,
    height: 231,
  },
  imageContent: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextTitle: {
    fontSize: fontSize.size14,
    fontFamily: fontFamily.Semibold,
    color: color.white,
  },
  TextDesc: {
    fontSize: fontSize.size10,
    fontFamily: fontFamily.Light,
    color: color.white,
  },
  storywrapperbox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    maxWidth: wp(90),
    borderRadius: 7,
  },
});

export default Story;
