/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RouterStack } from './src/navigations/Route';
import LoginContextProvider from './src/context/LoginContext';
import SyncStorage from 'sync-storage';
import SplashScreen from 'react-native-splash-screen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { localNotificationService } from './LocalNotificationService';
import { fcmService } from './FCMService';
import { navigationRef } from './RootNavigation';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';


LogBox.ignoreAllLogs();

const App = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    SplashScreen.hide();
    init();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);

    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('[App] onRegister: ', token);
    }

    function onNotification(notify) {
      // console.log('[App] onNotification: ', notify);

      localNotificationService.showNotification(
        'channel-id',
        Platform.OS === 'ios' ? notify.message : notify.title,
        notify.body,
        notify,
      );
    }

    function onOpenNotification(notify, data) {
      console.log('[App] onOpenNotification: ', notify);
    }
  }, []);



  const init = async () => {
    await SyncStorage.init();
    setIsReady(true);
    SplashScreen.hide();
  };

  if (isReady) {
    return (
      <LoginContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <MenuProvider>
            <BottomSheetModalProvider>
              <NavigationContainer ref={navigationRef}>
                <RouterStack />
                <Toast />
              </NavigationContainer>
            </BottomSheetModalProvider>
          </MenuProvider>
        </GestureHandlerRootView>
      </LoginContextProvider>
    );
  } else {
    return null;
  }
};
export default App;
