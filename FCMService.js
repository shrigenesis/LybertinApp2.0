/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import * as RootNavigation from './RootNavigation.js';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // Use Has Permissions
          this.getToken(onRegister);
        } else {
          //user dont have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('[FCMService] permission rejected', error);
      });
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User Does not have a device token');
        }
      })
      .catch(error => {
        console.log('[FCMService] getToken rejected', error);
      });
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('[FCMService] Request Permission rejected', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] deleteToken');
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] Delete Token error', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    //when the application is running but in background
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     '[FCMService] onNotificationOpendApp Notification Cauesd app to open error',
    //   );
    //   if (remoteMessage) {
    //     const notification = remoteMessage.notification;
    //     // onOpenNotification(notification, remoteMessage.data);
    //     //this.
    //   }
    // });

    //when the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(
          '[FCMService] getInitialNotification Notification Cauesd app to open error',
          remoteMessage,
        );
        if (remoteMessage) {
          const notification = remoteMessage.notification;

          if (
            remoteMessage?.data?.notification_type ==
            'FRIEND_REQUEST_NOTIFICATION'
          ) {
            setTimeout(() => {
              RootNavigation.navigate('Request');
            }, 1000);
          }

          if (remoteMessage?.data?.notification_type == 'ONE_TO_ONE_MESSAGE') {
            setTimeout(() => {
              RootNavigation.navigate('Chat', {
                avatar: remoteMessage?.data?.avatar,
                userName: remoteMessage?.data?.userName,
                user_id: remoteMessage?.data?.user_id,
              });
            }, 1000);
          }
          if (
            remoteMessage?.data?.notification_type ==
            'GROUP_MESSAGE_NOTIFICATION'
          ) {
            setTimeout(() => {
              RootNavigation.navigate('GroupChat', {
                group_id: remoteMessage?.data?.group_id,
                user_id: remoteMessage?.data?.to_id,
                groupType: remoteMessage?.data?.groupType,
                mediaPrivacy: remoteMessage?.data?.mediaPrivacy,
                privacy: remoteMessage?.data?.privacy,
                isAdmin: remoteMessage?.data.isAdmin,
              });
            }, 1000);
          }
          if (
            remoteMessage?.data?.notification_type ==
            'STORY_UPDATE_NOTIFICATION'
          ) {
            setTimeout(() => {
              RootNavigation.navigate('ShowStory', {
                list: JSON.parse(remoteMessage?.data?.view_stories),
              });
            }, 1000);
          }
          if (
            remoteMessage?.data?.notification_type ==
            'EVENT_BOOKED_NOTIFICATION'
          ) {
            setTimeout(() => {
              RootNavigation.navigate('eventDetails', {
                event_id: remoteMessage?.data?.event_id,
              });
            }, 1000);
          }
          if (
            remoteMessage?.data?.notification_type ==
            'MARKETING_EVENT_NOTIFICATION'
          ) {
            setTimeout(() => {
              RootNavigation.navigate('marketplaceDetails', {
                event_id: remoteMessage?.data?.marketing_event_id,
              });
            }, 1000);
          }
          onOpenNotification(notification);
        }
      });

    //forgrounnd state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data;
        } else {
          notification = remoteMessage.data;
        }
        onNotification(notification);
      }
    });

    //Triggerd When have new token
    messaging().onTokenRefresh(fcmToken => {
      console.log('[FCMService] new token refresh', fcmToken);
    });
  };
  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
