import { PermissionsAndroid } from 'react-native';
import Document from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DeviceInfo from "react-native-device-info";
import Toast from 'react-native-toast-message';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export const pickDocument = async cb => {
  let permission = await requestPermission('storage');
  if (permission) {
    Document.pickSingle({
      type: [
        // Document.types.doc,
        // Document.types.zip,
        // Document.types.docx,
        Document.types.pdf,
      ],
    })
      .then(res => {
        let data = res;
        let file = {
          uri: data.uri,
          type: data.type,
          name: data.name,
          fileType: data?.type == 'application/pdf' ? 'pdf' : 'doc',
          fileSize: data?.size / (1024 * 1024) 
        };
        cb(file); 
      })
      .catch(err => {
        console.log(err);
      });
  }
};
export const pickMixed = async cb => {
  let permission = await requestPermission('storage');
  if (permission) {
    Document.pickSingle({ type: [Document.types.images, Document.types.video] })
      .then(res => {
        let data = res;
        let file = {
          uri: data.uri,
          type: data.type,
          name: data.name,
          fileType: data?.type == 'application/pdf' ? 'pdf' : 'doc',
        };
        cb(file);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const pickImage = async (type = 'image', cb, mediaType = 'mixed') => {
  let permission = await requestPermission(
    type == 'image' ? 'storage' : 'camera',
  );
  if (permission) {
    let config = {
      mediaType: mediaType,
      saveToPhotos: false,
      selectionLimit: 1,
      videoQuality: 'medium',
      maxWidth: 1000,
      maxHeight: 1000
    };

    let imgFunction = type == 'image' ? launchImageLibrary : launchCamera;

    imgFunction(config, response => {
      if (response.assets && response.assets[0]) {
        let image = response.assets[0];
        console.log(image);
        let file = {
          uri: image.uri,
          type: image.type == "image/jpg" ? "image/jpeg" : image.type,
          name: image.fileName,
          fileType: mediaType,
          duration: image?.duration ? image?.duration : 0,
          fileSize: image?.fileSize / (1024 * 1024) 
        };
        cb(file);
      }
    });
  }
};

export const requestPermission = async permissionFor => {
  try {
    let permission = '';
    if (permissionFor == 'storage') {
      if (Platform.OS == 'ios') {
        permission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY); 
      } else {
        if (DeviceInfo.getSystemVersion() >= 13) {
          permission = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        } else {
          permission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }  
      } 
    } else if (permissionFor == 'audio') {
      permission = await request(
        Platform.OS == 'ios'
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO,
      );
    } else {
      permission = await request(
        Platform.OS == 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      );
    }

    if (permission == 'granted') {
      return true;
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please Enable Permissions from Settings'
      })
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
