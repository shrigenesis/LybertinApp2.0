import RNFetchBlob from 'react-native-blob-util';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {PermissionsAndroid, Platform} from 'react-native';

export const Download = async (url, ext, setDownloadProgress) => {
  const granted =
    Platform.OS !== 'ios' &&
    (await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ));

  if (url && granted == 'granted') {
    return new Promise(async resolve => {
      let name = `${moment().unix()}`;
      const {config, fs} = RNFetchBlob;
      let PictureDir = fs.dirs.DownloadDir;
      const dirToSave =
        Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
      let options = {
        fileCache: true,
        IOSBackgroundTask: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: PictureDir + '/' + `${name}.${ext}`,
          description: `${name}.${ext} Download`,
        },
        appendExt: ext,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `${name}.${ext} Download`,
        path: `${dirToSave}/${name}.${ext}`,
      };
      config(options)
        .fetch('GET', url)
        .then(async res => {
          setDownloadProgress && setDownloadProgress(false);
          resolve(res);
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(options.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(options.path);
          }
          Toast.show({
            type: 'info',
            text1: 'File Downloaded!',
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  } else {
    return new Promise(async resolve => {
      let name = `${moment().unix()}`;
      const {config, fs} = RNFetchBlob;
      let PictureDir = fs.dirs.DownloadDir;
      const dirToSave =
        Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
      let options = {
        // fileCache: true,
        IOSBackgroundTask: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: PictureDir + '/' + `${name}.${ext}`,
          description: `${name}.${ext} Download`,
        },
        appendExt: ext,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `${name}.${ext} Download`,
        path: `${dirToSave}/${name}.${ext}`,
      };
      config(options)
        .fetch('GET', url)
        .progress((received, total) => {
          console.log(received, total);
        })
        .then(async res => {
          setDownloadProgress && setDownloadProgress(false);
          resolve(res);
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(options.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(options.path);
          }
          Toast.show({
            type: 'info',
            text1: 'File Downloaded!',
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
};
