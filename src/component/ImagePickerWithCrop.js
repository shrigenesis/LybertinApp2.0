import {PermissionsAndroid} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

export const pickImageCrop = async (
  type = 'image',
  cb,
  mediaType = 'mixed',
) => {
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
      maxHeight: 1000,
    };

    if (type === 'image') {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image);
        let file = {
          ...image,
          uri: image.sourceURL,
          name: image.filename,
          type: image.mime,
          duration: image?.duration ? image?.duration : 0,
          fileSize: image?.size / (1024 * 1024),
        };
        console.log(file);
        cb(file);
      });
    } else {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image);
        let file = {
          uri: image.sourceURL,
          name: image.filename,
          type: image.mime,
          duration: image?.duration ? image?.duration : 0,
          fileSize: image?.size / (1024 * 1024),
        };
        cb(file);
      });
    }

    // let imgFunction = type == 'image' ? launchImageLibrary : launchCamera;

    // imgFunction(config, response => {
    //   if (response.assets && response.assets[0]) {
    //     let image = response.assets[0];
    //     console.log(image);
    //     let file = {
    //       uri: image.uri,
    //       type: image.type == 'image/jpg' ? 'image/jpeg' : image.type,
    //       name: image.fileName,
    //       fileType: mediaType,
    //       duration: image?.duration ? image?.duration : 0,
    //       fileSize: image?.fileSize / (1024 * 1024),
    //     };
    //     cb(file);
    //   }
    // });
  }
};

export const requestPermission = async permissionFor => {
  try {
    let permission = '';
    if (permissionFor == 'storage') {
      permission = await request(
        Platform.OS == 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
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
        text1: 'Please Enable Permissions from Settings',
      });
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
