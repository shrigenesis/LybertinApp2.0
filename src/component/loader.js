import React, { FC } from 'react';
import { StyleSheet, Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { color, fontSize } from '../constant';
import CircularProgress from 'react-native-circular-progress-indicator';

const Loader = ({ isLoading, type = 'circle', pageCircleText = 'Please Wait' }) => {
  if (isLoading) {
    if (type == 'circle') {
      return <LottieView speed={1.6} style={{ height: 100 }} source={require('./../animation/circle.json')} autoPlay loop />;
    }
    else if (type == 'dots') {
      return (
        <Modal transparent={true} animationType={'fade'} visible={isLoading}>
          <View style={styles.modalBackground}>
            {/* <View style={styles.activityIndicatorWrapper}> */}
            <LottieView speed={1} style={{ height: 200 }} source={require('./../animation/dots.json')} autoPlay loop />
            {/* </View> */}
          </View>
        </Modal>
      )
    }
    else if (type == 'pageCircle') {
      return (
        <Modal transparent={true} animationType={'fade'} visible={isLoading}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <LottieView speed={1} style={{ height: 80 }} source={require('./../animation/circle.json')} autoPlay loop />
              <Text style={styles.pleaseWait}>{pageCircleText}</Text>
            </View>
          </View>
        </Modal>
      )
    }
    else if (type == 'progress') {
      return (
        <Modal transparent={true} animationType={'fade'} visible={isLoading}>
          <View style={styles.modalBackground}>
            <CircularProgress
              value={100}
              duration={2000}
              radius={40}
              inActiveStrokeOpacity={0.2}
              valueSuffix={'%'}
              progressValueColor={'#ecf0f1'}
              activeStrokeColor={'#f39c12'}
              inActiveStrokeColor={'#9b59b6'}
            />
          </View>
        </Modal>
      )
    }
    else {
      return null;
    }
  }
  else {
    return null;
  }
};

/** with images */
// return (

//   <View style={{height:80,width:80,alignItems:'center',justifyContent:'center'}}>
//       <View style={{backgroundColor:'#13577d',padding:13,borderRadius:120,overflow:'hidden'}}>
//           <Image source={{uri:'https://doves.stage02.obdemo.com/assets/img/logo.png'}} style={{height:40,width:40,resizeMode:'contain'}} />
//       </View>
//       <View style={{position:'absolute'}}>
//         <LottieView speed={1.6} style={{ height: 200 }} source={require('./../animation/circle.json')} autoPlay loop/>
//       </View>
//   </View>
//   )
export default Loader;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(110, 110, 110, 0.7)',
  },
  activityIndicatorWrapper: {
    elevation: 10,
    backgroundColor: color.white,
    height: 120,
    width: 120,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  pleaseWait: {
    fontSize: fontSize.size16,
    color: color.black
  },
});

