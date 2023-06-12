/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useRef, useState} from 'react';
import { AppState } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { LoginContext } from '../context/LoginContext';
import { OtherStack } from './otherStack';
import { OtherStackOrg } from './otherStackOrg';
import Login from '../screens/auth/login';
import Intro from '../screens/auth/intro';
import Intro2 from '../screens/auth/intro2';
import Intro3 from '../screens/auth/intro3';
import Intro4 from '../screens/auth/intro4';
import Register from '../screens/auth/register';
import ForgetPassword from '../screens/auth/forgetPassword';
import Terms from '../screens/other/Terms';
import { User } from '../utils/user';
import InterestSelector from '../screens/auth/interestSelector';
import PersonalitySelector from '../screens/auth/personalitySelector';
import ProvideEmail from '../screens/auth/provideEmail';
import { useEffect } from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import * as RootNavigation from './../../RootNavigation';
import SyncStorage from 'sync-storage';
import { APIRequest, ApiUrl } from '../utils/api';
import getPathFromUrl from '../utils/getPathFromUrl';
import RegisterDeeplink from '../utils/RegisterDeeplink';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const userdata = new User().getuserdata();

export const AuthStack = () => {
  let getisOld = new User().getisOld();
  let isFromRegister = new User().getFromRegister();
  console.log(isFromRegister);
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      swipeEnabled: true,
      drawerType: "slide",
      swipeEdgeWidth: 100,
      swipeMinDistance: 100,
    }}>
      {!getisOld && (
        <Stack.Screen
          name="Intro"
          component={Intro}
          options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
        />
      )}
      {!getisOld && (
        <Stack.Screen
          name="Intro2"
          component={Intro2}
          options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
        />
      )}
      {!getisOld && (
        <Stack.Screen
          name="Intro3"
          component={Intro3}
          options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
        />
      )}
      {!getisOld && (
        <Stack.Screen
          name="Intro4"
          component={Intro4}
          options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
        />
      )}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ header: () => null, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{ header: () => null }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: () => null,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="provideEmail"
        component={ProvideEmail}
        options={{
          header: () => null,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{
          header: () => null,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </Stack.Navigator>
  );
};



export const RouterStack = () => {
  let userStore = new User();
  let { isLogin } = React.useContext(LoginContext);
  let { type } = React.useContext(LoginContext);
  const appState = useRef(AppState.currentState);
  const [storedMessageUnsend, setstoredMessageUnsend] = useState([])
  const [storedMessage, setstoredMessage] = useState([])

  useEffect(() => {  
    setUserStatus('1')
    AppState.addEventListener("change", _handleAppStateChange);
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        sendOfflineMessage()
        // setIsConnected(true)
      } else {
        // setIsConnected(false)
      }
    });

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
      unsubscribe()
    };

  }, [])

  const sendOfflineMessage = async () => {
    try {
      const myArray = await AsyncStorage.getItem('SINGLE_CHAT_MESSAGE');
      if (myArray !== null) {
        const offlinemessagedata = JSON.parse(myArray);
        setstoredMessage(offlinemessagedata)
        console.log('offlinemessagedata',offlinemessagedata);
        for (let index = 0; index < offlinemessagedata.length; index++) {
          const item = offlinemessagedata[index]
          await sendMessageOffline(item)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const sendMessageOffline = async (item) => {
    let config = {
      url: ApiUrl.sendMessage,
      method: 'post',
      body: {
        uuid: item.uuid,
        created_at: item.created_at,
        time_zone: item.time_zone,
        is_archive_chat: item.is_archive_chat,
        to_id: item.to_id,
        message: item.message,
        is_group: item.is_group,
        message_type: 0,
      },
    };
    APIRequest(
      config,
      res => {
        console.log('res?.conversation.uuid',res?.conversation.uuid);
        const remainingItems = storedMessageUnsend.filter((item) => item.uuid !== res?.conversation.uuid)
        setstoredMessageUnsend(remainingItems)
        console.log('remainingItems',remainingItems);
        AsyncStorage.setItem('SINGLE_CHAT_MESSAGE', JSON.stringify(remainingItems));
      },
      err => {
      },
    );
  }

  const _handleAppStateChange = (nextAppState) => {
    if (AppState.currentState==='background') {
      setUserStatus('0')
    } else {
      setUserStatus('1') 
    }
    console.log("AppState", appState.current, AppState.currentState); 
  };
  

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => {
      unsubscribe();
    }
  }, []);
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        handleDynamicLink(link)
      });
  }, []);

  const setUserStatus = (status) => {
    let config = {
      url:ApiUrl.updateStatus,
      method: 'post',
      body: {
        user_id: `${userdata?.id}`,
        is_online: status
      },
    };
    APIRequest(
      config,
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      },
    );
  }

  const handleDynamicLink = (link) => {
    setTimeout(() => {
      if (isLogin) {
        RegisterDeeplink(link?.url)
      } else {
        SyncStorage.set('deepLink', link?.url);
      }
    }, 1000)
  };

  if (isLogin) {
    return type == 2 ? <OtherStack isLogin={isLogin} fromRegister={userStore?.getFromRegister()} /> : <OtherStackOrg />;
  } else {
    return <AuthStack />;
  }
};
