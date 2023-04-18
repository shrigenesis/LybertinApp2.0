import React, { useState, memo, useEffect } from 'react';
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
} from 'react-native';
import { color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Header } from './../../component/';
import IMAGE from '../../constant/image';
import { APIRequest, ApiUrl, IMAGEURL, Toast } from './../../utils/api';
import Loader from '../../component/loader';
import Video from 'react-native-video';

const groupMedia = ({ navigation, route }) => {
  const [image, setImage] = useState([]);
  const [docs, setdocs] = useState([]);
  const [mediaType, setMediaType] = useState(1);
  const [isLoading, setisLoading] = useState(false);

  const RenderImages = memo(({ item, index }) => (
    <View key={index} style={style.listview}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { }}
        style={style.imgCard}>
        {/* <TouchableOpacity onPress={()=>{}} style={{position:'absolute',top:5,right:-wp(3),zIndex:11}}>
          <Icon name="trash" style={{fontSize:15,color:'red',marginRight:wp(5)}} />
        </TouchableOpacity> */}
        {/* (
        if (item.message_type==1){
          <Text>Image</Text>
        } else if (item.message_type==5){
          <Text>Video</Text>
        } else {
          <Text>Audio</Text>
        }) */}
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
                height: hp(14),
                resizeMode: 'cover',
                width: wp(28),
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        ) : item.message_type == 5 ? (
          <Video
            source={{ uri: `${IMAGEURL}/${item?.file_name}` }}
            resizeMode={'cover'}
            muted={true}
            style={{
              height: hp(14),
              resizeMode: 'cover',
              width: wp(28),
              borderRadius: 10,
            }}
          />
        ) : (
          <View></View>
        )}
      </TouchableOpacity>
    </View>
  ));

  const RenderDocs = memo(({ item, index }) => (
    <View key={index} style={style.listview}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { }}
        style={style.docCard}>
        {item.message_type == 2 ? (
          <TouchableOpacity
            onPress={file =>
              navigation.navigate('ShowImg', {
                file: item.file_name,
                fileType: 'pdf',
              })
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
          <Video
            source={{ uri: `${IMAGEURL}/${item?.file_name}` }}
            muted={true}
            resizeMode={'cover'}
            style={{
              height: hp(14),
              resizeMode: 'cover',
              width: wp(28),
              borderRadius: 10,
            }}
          />
        )}

        <View style={{ paddingLeft: wp(3), justifyContent: 'center' }}>
          <Text style={style.docName}>Blockchain.docx</Text>
          <Text style={style.size}>252 KB .docx</Text>
        </View>
      </TouchableOpacity>
    </View>
  ));
  useEffect(() => {
    // if (route?.params?.id) {
    fetchMedia();
    // }
  }, []);

  const fetchMedia = id => {
    setisLoading(true);
    let groupId = route?.params?.groupId;
    let config = {
      url: `${ApiUrl.groups}/${groupId}/media`,
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
      <View style={{ flex: 1, backgroundColor: color.white }}>
        <Header
          title={'Media,Docs'}
        />
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
              <FlatList
                key={'image'}
                numColumns={3}
                data={image}
                keyExtractor={item => String(item.id)}
                renderItem={({ item, index }) => (
                  <RenderImages item={item} index={index} />
                )}
              />
            ) : (
              <FlatList
                key={'docs'}
                data={docs}
                keyExtractor={item => String(item)}
                renderItem={({ item, index }) => (
                  <RenderDocs item={item} index={index} />
                )}
              />
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
    backgroundColor: color.white
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
export default groupMedia;
