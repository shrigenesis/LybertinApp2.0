/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {
  useState,
  useEffect,

} from 'react';
import {
  View,

  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { color, fontFamily, fontSize, IMAGE} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {

  Button,
  Header,

  Loader,
} from '../../component/';
// import Loader from '../../component/loader';
import {
  APIRequest,
  APIRequestWithFile,
  ApiUrl, 
} from './../../utils/api';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';




const UpdateQuestions = ({navigation, route}) => {
  const [isLoading, setIsLoading]  = useState(false);
  const [listData, setListData] = useState([]);
  const [selected, setSelected] = useState([]);
  // const [force, setForce] = useState(false);

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
        getQuestions(route?.params?.title);
       
  },[]);

  // call this on mount
 
  const getQuestions = (type) => {
    setIsLoading((isLoading) => !isLoading);
    let config = {
      url: ApiUrl.questions,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
         
          if(type === 'personality'){
             const arr = res.questions[1].options.map(item => {
              return {...item, color: setColor()};
            });
            setListData(arr);
          }else{
            const arr = res.questions[0].options.map(item => {
              return {...item, color: setColor()};
            });
            setListData(arr);  
          }
          setSelected(route?.params?.selected !== null ? route?.params?.selected :[] );
        }
        setIsLoading((isLoading) => !isLoading);
      },
      err => {
        setIsLoading((isLoading) => !isLoading);
      },
      (false),
    );
  };

  const setColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const handleSelect = (item, i) => {
    let index = selected?.indexOf(item.value);
    let data = [...selected];
    if (index == -1) {
      data.push(item.value);
    } else {
      data.splice(index, 1);
    }
    setSelected(data);
  };

  const update = () => {
    if (selected.length <= 0) {
          return Toast.show({
            type: 'info',
            text1: 'Please select atleast one item.',
          });
        }
    // setIsLoading((isLoading) => !isLoading);
    let formData = new FormData();
    if (selected?.length > 0) {
      for (let i = 0; i < selected?.length; i++) {
        formData.append(`${route?.params?.title}[]`, selected[i]);
      }
    }

    let config = {
      url: ApiUrl.updateInterests,
      method: 'post',
      body: formData,
    };
    console.log(config);
    APIRequestWithFile(
      config,
      res => {
        // setIsLoading((isLoading) => !isLoading);
        navigation.navigate('EditProfile')
        
      },
      err => {
        // setIsLoading((isLoading) => !isLoading);
      },
    );
  };
  



  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{flex: 1, backgroundColor: color.background}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        {<Loader isLoading={isLoading} type={'dots'} />}
        <Header title={'Update Profile'} />
        <View style={style.questionWrapper}>
            <Text style={style.questionText}>
              {route?.params?.title === 'personality' ?'What words best describe you?':'Let’s get to know you better, What type of events interest you?'}
            </Text>
          </View>

          <ScrollView>
            <View style={style.pillsWrapper}>
              {listData.map((item, index) => (
                <LinearGradient
                  style={style.gradientBack}
                  angle={20}
                  key={item.value}
                  colors={item.color}>
                  <TouchableOpacity
                   
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelect(item, index);
                    }}
                    style={style.pills}>
                    <Text style={style.pillText}>{item.value}</Text>
                    {console.log(selected)}
                    {selected?.indexOf(item.value) != -1 && (
                      <Image source={IMAGE.checkNewFill} style={style.imgBox} />
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              ))}
            </View>
          </ScrollView>
          <View style={style.btnWrapper}>
          <TouchableOpacity style={{marginVertical: hp(2)}}>
              <Button onPress={update} label={'Update'} />
            </TouchableOpacity>
          </View>
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
export default UpdateQuestions;
