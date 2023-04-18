/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useContext, useEffect, FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
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
import {Button, Header, Loader} from '../../component';
import {color, fontFamily, fontSize, IMAGE} from '../../constant';
import {APIRequest, APIRequestWithFile, ApiUrl} from '../../utils/api';
import Toast from 'react-native-toast-message'
import LinearGradient from 'react-native-linear-gradient';
import { User } from '../../utils/user';

const PersonalitySelector = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [personalities, setPersonalities] = React.useState([]);
  const [selectedPersonalities, setselectedPersonalities] = React.useState([]);


  const colors = [
    ['#F51451', '#C5BD00'],
    ['#C5BD00', '#2AD587'],
    ['#C5BD00', '#5000A8'],
    ['#DEBA8E', '#DF7B8D'],
    ['#FF99DA', '#B76E78'],
    ['#277C56', '#0E0C27'],
    ['#0584B8', '#A3D9EF'],
    ['#FE8D01', '#5000A8'],
    ['#DF7B8D', '#C5BD00'],
    ['#AD03A8', '#0575E6'],
    ['#D68596', '#580FEA'],
  ];

  useEffect(() => {
    getInterests();
  }, []);

  const getInterests = async() => {
    
    let config = {
      url: ApiUrl.questions,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          const arr = res.questions[1].options.map(item => {
            return {...item, color: setColor()};
          });
          setPersonalities(arr);
        }
        
        
      },
      err => {
        
      },
      (false),
    );
  };

  const setColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const handleSelect = (item, i) => {
    let index = selectedPersonalities.indexOf(item.value);
    let data = [...selectedPersonalities];
    if (index == -1) {
      data.push(item.value);
    } else {
      data.splice(index, 1);
    }
    setselectedPersonalities(data);
  };

  const skipAndNext = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'EventList'}],
    });
  };

  const saveAndNext = () => {
    if (selectedPersonalities.length <= 0) {
      return Toast.show({
        type: 'info',
        text1: 'Please select atleast one item.',
      });
    }
    completeProfile();
  };

  const completeProfile = () => {
    setIsLoading((prvState) => !prvState );
    let formData = new FormData();
    if (selectedPersonalities.length > 0) {
      for (let i = 0; i < selectedPersonalities.length; i++) {
        formData.append('personality[]', selectedPersonalities[i]);
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
        setIsLoading((prvState) => !prvState );
        setIsFromRegister();
       
        navigation.reset({
          index: 0,
          routes: [{name: 'EventList'}],
        });
      },
      err => {
        setIsLoading((prvState) => !prvState );
      },
    );
  };
  const setIsFromRegister = () =>{
    const user =  new User();
    user.setFromRegister(false);
  }
  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{flex: 1, backgroundColor: color.white}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <>
          <Header
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
              What words best describe you?
            </Text>
          </View>

          <ScrollView>
            <View style={style.pillsWrapper}>
              {personalities.map((item, index) => (
                <LinearGradient
                  key={`pesonilties-${index}`}
                  style={style.gradientBack}
                  angle={20}
                  colors={item.color}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelect(item, index);
                    }}
                    style={style.pills}>
                    <Text style={style.pillText}>{item.value}</Text>
                    {selectedPersonalities.indexOf(item.value) != -1 && (
                      <Image source={IMAGE.checkNewFill} style={style.imgBox} />
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              ))}
            </View>
          </ScrollView>
          <View style={style.btnWrapper}>
            <TouchableOpacity style={{marginVertical: hp(2)}}>
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
    textAlign: 'left',
    color: color.black,
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
export default PersonalitySelector;
