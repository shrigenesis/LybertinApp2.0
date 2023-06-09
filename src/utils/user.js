import SyncStorage from 'sync-storage';

export class User {
  setFromRegister(val) {
    SyncStorage.set('fromRegister', val);
  }
  getFromRegister() {
    return SyncStorage.get('fromRegister');
  }
  setisOld() {
    SyncStorage.set('isOld', true);
  }
  getisOld() {
    return SyncStorage.get('isOld');
  }
  setuserdata(data) {
    SyncStorage.set('userdata', data);
  }
  getuserdata() {
    return SyncStorage.get('userdata');
  }

  setToken(data) {
    SyncStorage.set('token', data);
  }
  getToken() {
    return SyncStorage.get('token');
  }

  setPrefixurl(data) {
    SyncStorage.set('Prefixurl', data);
  }
  getPrefixurl() {
    return SyncStorage.get('Prefixurl');
  }

  setLogin(data) {
    SyncStorage.set('login', data);
  }

  isLogin() {
    return SyncStorage.get('login');
  }

  setType(data) {
    SyncStorage.set('type', data);
  }

  usertype() {
    return SyncStorage.get('type');
  }
  setAudio(data) {
    SyncStorage.set('audio', 'data');
  }

  getAudio() {
    return SyncStorage.get('audio');
  }

  setOfflineMessage(data) {
    return SyncStorage.get('message', data);
  }
  getOfflineMessage() {
    return SyncStorage.get('message');
  }
  clearAllUserData() {
    SyncStorage.remove('userdata', null);
    SyncStorage.remove('token', null);
    SyncStorage.remove('login', null);
    SyncStorage.remove('fromRegister',false);
  }
}
