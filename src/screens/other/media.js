import React, {useState, memo, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  PanResponder,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header} from './../../component/';
import IMAGE from '../../constant/image';
import {APIRequest, ApiUrl, IMAGEURL} from './../../utils/api';
import Loader from '../../component/loader'; 
import Video from 'react-native-video';
import NoRecord from './noRecord';

const Media = ({navigation, route}) => {
  const [image, setImage] = useState([]);
  const [docs, setdocs] = useState([]);
  const [mediaType, setMediaType] = useState(1);
  const [isLoading, setisLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();
  const windowWidth = Dimensions.get('window').width;
  useEffect(() => {
    navigation.addListener('blur', () => {
      console.log('Leaving Home Screen');
      // setAudioStatus(false);

      // new code add to pause video from ref
      videoRef?.current?.setNativeProps({
        paused: true,
      });
    });

    // return unsubscribe;
  }, []);

  const RenderImages = ({item}) => {
    return (
      <View style={style.listview}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {}}
          style={style.imgCard}>
          {/* <TouchableOpacity onPress={()=>{}} style={{position:'absolute',top:5,right:-wp(3),zIndex:11}}>
          <Icon name="trash" style={{fontSize:15,color:'red',marginRight:wp(5)}} />
        </TouchableOpacity> */}
          {item.message_type == 1 ? (
            <TouchableOpacity
              onPress={file =>
                navigation.navigate('ShowImg', {
                  file: item.file_name,
                  fileType: 'photo',
                })
              }>
              <Image
                source={{
                  uri: `${IMAGEURL}/${item.file_name}`,
                }}
                style={{
                  height: windowWidth / 3 - 15,
                  resizeMode: 'cover',
                  width: windowWidth / 3 - 15,
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onPress={() => {
                  setIsPlaying(p => !p);
                  navigation.navigate('ShowImg', {
                    file: item?.file_name,
                    fileType: 'video',
                    iscoming: true,
                  });
                }}>
                <View
                  style={{
                    borderRadius: 15,
                    position: 'absolute',
                    zIndex: 1,
                    opacity: 0.4,
                    backgroundColor: color.black,
                    width: '100%',
                    height: '100%',
                  }}></View>
                <Video
                  ref={videoRef}
                  onLoad={() => {
                    videoRef?.current?.seek(3);
                    videoRef?.current?.setNativeProps({
                      paused: true,
                    });
                  }}
                  paused={true}
                  source={{uri: `${IMAGEURL}/${item?.file_name}`}}
                  resizeMode={'cover'}
                  style={{
                    // borderRadius: 15,
                    overflow: 'hidden',
                    // width: 200,
                    // height: 150,
                    // resizeMode: 'cover',
                    borderWidth: 2,
                    borderColor: color.borderGray,

                    height: windowWidth / 3 - 15,
                    resizeMode: 'cover',
                    width: windowWidth / 3 - 15,
                    borderRadius: 10,
                  }}
                />
                {console.log((windowWidth / 3 - 10) / 2)}
                <Image
                  source={IMAGE.PlayBtn}
                  style={{
                    position: 'absolute',
                    bottom: (windowWidth / 3 - 25) / 2.5,
                    // bottom: 25,
                    left: (windowWidth / 3 - 25) / 2.3,
                    height: 30,
                    zIndex: 9,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const RenderDocs = ({item, index}) => {
    return (
      <View key={index} style={style.listview}>
        <TouchableOpacity activeOpacity={0.8} style={style.docCard}>
          {item.message_type == 2 ? (
            <TouchableOpacity
              onPress={
                file => {
                  console.log('file', item);

                  navigation.navigate('ShowImg', {
                    file: item.file_name,
                    fileType: 'pdf',
                  });
                }
                // navigation.navigate('ShowImg', {file})
              }>
              <Image
                source={IMAGE.pdf}
                style={{
                  height: hp(14),
                  resizeMode: 'cover',
                  width: wp(28),
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onPress={() => {
                  setIsPlaying(p => !p);
                  navigation.navigate('ShowImg', {
                    file: item?.file_name,
                    fileType: 'video',
                  });
                }}>
                <View
                  style={{
                    borderRadius: 15,
                    position: 'absolute',
                    zIndex: 1,
                    opacity: 0.4,
                    backgroundColor: color.black,
                    width: '100%',
                    height: '100%',
                  }}></View>
                <Video
                  ref={videoRef}
                  onLoad={() => {
                    videoRef?.current?.seek(3);
                    videoRef?.current?.setNativeProps({
                      paused: true,
                    });
                  }}
                  paused={!isPlaying}
                  source={{uri: `${IMAGEURL}/${item?.file_name}`}}
                  resizeMode={'cover'}
                  style={{
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: color.borderGray,
                    height: hp(14),
                    resizeMode: 'cover',
                    width: wp(28),
                    borderRadius: 10,
                  }}
                />
                <Image
                  source={IMAGE.PlayBtn}
                  style={{
                    position: 'absolute',
                    bottom: 55,
                    left: 80,
                    height: 40,
                    zIndex: 9,
                    width: 40,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </>
          )}

          <View style={{paddingLeft: wp(3), justifyContent: 'center'}}>
            <Text style={style.docName}>{item?.file_original_name}</Text>
            {/* <Text style={style.size}>252 KB .pdf</Text> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  useEffect(() => {
    if (route?.params?.id) {
      fetchMedia(route?.params?.id);
    }
  }, []);

  const fetchMedia = id => {
    setisLoading(true);
    let config = {
      url:
        route?.params?.from === 'group'
          ? `${ApiUrl.groups}/${id}/media`
          : `${ApiUrl.media}${id}/media`,
      method: 'post',
      body: {
        offset: 0,
      },
    };
    APIRequest(
      config,
      res => {
        setImage(res?.chatMedia?.media);
        setdocs(res?.chatMedia?.doc);
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{flex: 1, backgroundColor: color.white}}>
        <Header title={'Media,Docs'} />
        <Loader isLoading={isLoading} type={'dots'} />

        <View style={style.tabView}>
          <TouchableOpacity
            onPress={() => {
              setMediaType(1);
            }}
            style={[style.tab, mediaType == 1 && style.activeTab]}>
            <Text
              style={[
                style.tabText,
                mediaType == 1 && {
                  color: color.black,
                  fontFamily: fontFamily.Bold,
                },
              ]}>
              Media
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMediaType(2);
            }}
            style={[style.tab, mediaType == 2 && style.activeTab]}>
            <Text
              style={[
                style.tabText,
                mediaType == 2 && {
                  color: color.black,
                  fontFamily: fontFamily.Bold,
                },
              ]}>
              Docs
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={style.bodySection}>
            {mediaType == 1 ? (
              <>
                {image.length > 0 ? (
                  <FlatList
                    key={'image'}
                    numColumns={3}
                    data={image}
                    // keyExtractor={item => String(item.id)}
                    keyExtractor={item => item.file_name}
                    renderItem={({item}) => <RenderImages item={item} />}
                  />
                ) : (
                  <>
                    {!isLoading && (
                      <NoRecord
                        image={IMAGE.noMedia}
                        title="No media found"
                        description="Share media in chat to see here."
                        showButton={false}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {docs.length > 0 ? (
                  <FlatList
                    key={'docs'}
                    data={docs}
                    keyExtractor={item => String(item)}
                    renderItem={({item, index}) => (
                      <RenderDocs item={item} index={index} />
                    )}
                  />
                ) : (
                  <>
                    {!isLoading && (
                      <NoRecord
                        image={IMAGE.noMedia}
                        title="No doc found"
                        description="Share doc in chat to see here."
                        showButton={false}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  docCard: {
    paddingVertical: hp(1),
    width: wp(85),
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
    flexDirection: 'row',
  },
  docfile: {
    height: hp(8),
    resizeMode: 'contain',
    width: wp(16),
  },
  docName: {
    fontSize: 14,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  size: {
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: color.btnBlue,
  },
  tab: {
    height: hp(5),
    width: wp(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(10),
  },
  tabText: {
    fontSize: 14,
    fontFamily: fontFamily.Semibold,
    color: color.textGray2,
  },

  modalImg: {
    resizeMode: 'contain',
    height: hp(50),
    width: wp(90),
    overflow: 'hidden',
    borderRadius: 5,
  },
  modalWrapper: {
    height: hp(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    position: 'absolute',
    zIndex: 999,
  },
  listview: {
    marginLeft: wp(2.5),
    marginVertical: hp(1),
  },
  catname: {
    marginTop: hp(1),
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily.SemiBold,
    color: color.textBlue,
  },
  imgCard: {
    overflow: 'hidden',
    // elevation: 1,
    backgroundColor: color.themePink,
    borderRadius: 10,
  },

  bodySection: {
    // alignSelf: 'center',
    marginVertical: hp(2),
  },
});
export default Media;
