/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useContext, useEffect, FC } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Header, Loader } from '../../component';
import { color, fontFamily, fontSize, IMAGE } from '../../constant';
import { APIRequest, APIRequestWithFile, ApiUrl } from '../../utils/api';
import Toast from 'react-native-toast-message';

import { LoginContext } from './../../context/LoginContext';
import { write } from 'react-native-fs';
import { ZoomIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
const InterestSelector = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [interests, setInterests] = React.useState([]);
  const [selectedInterests, setSelectedInterests] = React.useState([]);

  const colors = [
    ['#F51451', '#C5BD00'],
    ['#F51451', '#AD03A8'],
    ['#23CC3F', '#914056'],
    ['#DEBA8E', '#DF7B8D'],
    ['#FF99DA', '#B76E78'],
    ['#0584B8', '#A3D9EF'],
    ['#FE8D01', '#5000A8'],
    ['#DF7B8D', '#C5BD00'],
    ['#AD03A8', '#0575E6'],
    ['#D68596', '#580FEA'],
    ['#B039C8', '#01A893'],
  ];

  useEffect(() => {
    getInterests();
  }, []);

  const getInterests = () => {
    setIsLoading(true);
    let config = {
      url: ApiUrl.questions,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          const arr = res.questions[0].options.map(item => {
            return { ...item, color: setColor() };
          });
          setInterests(arr);
        }
        setIsLoading(false);
      },
      err => {
        setIsLoading(false);
      },
      (false),
    );
  };
  const setColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const handleSelect = (item, i) => {
    let index = selectedInterests.indexOf(item.value);
    let data = [...selectedInterests];
    if (index == -1) {
      data.push(item.value);
    } else {
      data.splice(index, 1);
    }
    setSelectedInterests(data);
  };

  const skipAndNext = () => {
    setIsLoading(false);
    navigation?.navigate('personalitySelector');
  };

  const saveAndNext = () => {
    if (selectedInterests.length <= 0) {
      return Toast.show({
        type: 'info',
        text1: 'Please select atleast one item.',
      });
    }
    completeProfile();
  };

  const completeProfile = () => {
    setIsLoading(true);
    let formData = new FormData();
    if (selectedInterests.length > 0) {
      for (let i = 0; i < selectedInterests.length; i++) {
        formData.append('interests[]', selectedInterests[i]);
      }
    }

    let config = {
      url: ApiUrl.updateInterests,
      method: 'post',
      body: formData,
    };
    APIRequestWithFile(
      config,
      res => {
        setIsLoading(false);
        navigation?.navigate('personalitySelector');
      },
      err => {
        console.log(err);
        setIsLoading(false);
      },
    );
  };

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{ flex: 1, backgroundColor: color.white }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <>
          <Header
            LeftIcon={() => <></>}
            title=""
            RightIcon={() => (
              <TouchableOpacity onPress={skipAndNext}>
                <Text>Skip</Text>
              </TouchableOpacity>
            )}
          />
          <Loader isLoading={isLoading} type={'dots'} />
          <View style={style.questionWrapper}>
            <Text style={style.questionText}>
              Let’s get to know you better, What type of events interest you?
            </Text>
          </View>

          <ScrollView>
            <View style={style.pillsWrapper}>
              {interests.map((item, index) => (
                <LinearGradient
                style={style.gradientBack}
                key={`interests-${index}`}
                  angle={90}
                  colors={item.color}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelect(item, index);
                    }}
                    style={style.pills}>
                    <Text style={style.pillText}>{item.value}</Text>
                    {selectedInterests.indexOf(item.value) != -1 && (
                      <Image source={IMAGE.checkNewFill} style={style.imgBox} />
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              ))}
            </View>
          </ScrollView>
          <View style={style.btnWrapper}>
            <TouchableOpacity style={{ marginVertical: hp(2) }}>
              <Button onPress={saveAndNext} label={'Save'} />
            </TouchableOpacity>
          </View>
        </>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  questionWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  questionText: {
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.size25,
    color: color.black,
    textAlign: 'left',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  pillsWrapper: {
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gradientBack: {
    borderRadius: 30,
    marginVertical: 10,
    marginRight: 5,
  },
  pills: {
    // backgroundColor: color.btnBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    // paddingVertical: 15,
  },
  pillText: {
    fontFamily: fontFamily.Semibold,
    fontSize: fontSize.size14,
    color: color.white,
    marginVertical: 15,
  },
  imgBox: {
    height: 20,
    width: 20,
    tintColor: color.white,
    marginLeft: 10,
  },
  btnWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default InterestSelector;
