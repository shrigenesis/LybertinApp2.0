/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform, AppState } from 'react-native';
import * as RootNavigation from './RootNavigation.js';

class LocalNotificationService {
  configure = () => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id', // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        allowWhileIdle: true,

        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        vibration: 3000,
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        //  console.log("[LocalNotificationService] onRegister:", token);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },
      onNotification: function (notification) {
        console.log('[LocalNotificationService] onNotification:', notification);
        // var data = {
        //   channelId: 'channel-id',
        //   autoCancel: true,
        //   title: notification.data.title,
        //   message: notification.data.message,
        //   vibrate: true,
        //   vibration: 2000,
        //   playSound: true,
        //   allowWhileIdle: true,
        //   soundName: 'default',

        //   // popInitialNotification: false,
        //   requestPermissions: true,

        //   // actions: '["Reject", "Accept"]',
        //   // action:true,
        //   invokeApp: false,
        // };
        if (notification?.data?.item?.notification_type == 'FRIEND_REQUEST_NOTIFICATION') {
          setTimeout(() => {
            RootNavigation.navigate('Request');
          }, 1000);
        }

        if (notification?.data?.item?.notification_type == 'ONE_TO_ONE_MESSAGE') {
          setTimeout(() => {
            RootNavigation.navigate('Chat', {
              avatar: notification?.data?.item?.avatar,
              userName: notification?.data?.item?.userName,
              user_id: notification?.data?.item?.user_id,
            });
          }, 1000);
        }
        if (
          notification?.data?.item?.notification_type == 'GROUP_MESSAGE_NOTIFICATION') {
          setTimeout(() => {
            RootNavigation.navigate('GroupChat', {
              group_id: notification?.data?.item?.group_id,
              user_id: notification?.data?.item?.to_id,
              groupType: notification?.data?.item?.groupType,
              mediaPrivacy: notification?.data?.item?.mediaPrivacy,
              privacy: notification?.data?.item?.privacy,
              isAdmin: notification?.data?.item?.isAdmin,
            });
          }, 1000);
        }
        if (
          notification?.data?.item?.notification_type =='STORY_UPDATE_NOTIFICATION') {
            // console.log(notification?.data?.item?.view_stories,JSON.parse(notification?.data?.item?.view_stories))
          setTimeout(() => {
            RootNavigation.navigate('ShowStory', {
              list: JSON.parse(notification?.data?.item?.view_stories),
            })
          }, 1000);
        }
        if (
          notification?.data?.item?.notification_type =='EVENT_BOOKED_NOTIFICATION') {
          setTimeout(() => {
            RootNavigation.navigate('eventDetails', {
              event_id: notification?.data?.item?.event_id,
            })
          }, 1000);
        }
        if (
          notification?.data?.item?.notification_type =='MARKETING_EVENT_NOTIFICATION') {
          setTimeout(() => {
            RootNavigation.navigate('marketplaceDetails', {
              event_id: notification?.data?.item?.marketing_event_id,
            })
          }, 1000);
        }
        PushNotification.cancelAllLocalNotifications()
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: false,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };
  unRegister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, option = {}) => {
    console.log('show notificationsssss');
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, option),
      ...this.buildIOSNotification(id, title, message, data, option),
      channelId: 'channel-id',

      title: title || '',
      message: message || '',
      playSound: option.playSound || true,
      soundName: 'default',
      vibrate: true,
      vibration: 2000,
      // actions: '["Reject", "Accept"]',
      userInteraction: false, //Boolen
    });
  };
  buildAndroidNotification = (id, title, message, data = {}, option = {}) => {
    return {
      autoCancel: true,
      largeIcon: option.largeIcon || 'ic_launcher',
      smallIcon: option.smallIcon || 'ic_stat_ic_notification',
      bigText: message || '', // (optional) default: "message" prop
      subText: title || '',
      vibrate: option.vibrate || true, // (optional) default: true
      vibration: option.vibration || 2000,
      priority: option.priority || 'high',
      importance: option.importance || 'high',
      data: data,
    };
  };
  buildIOSNotification = (id, title, message, data = {}, option = {}) => {
    return {
      alertAction: option.alertAction || 'view',
      category: option.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };
  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeAllDeliveredNotificationByID = notificationId => {
    // console.log("[LocalNotificationService] removeAllDeliveredNotificationByID:", notificationId);
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
  };
}

export const localNotificationService = new LocalNotificationService();
