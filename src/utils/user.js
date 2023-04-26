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
  clearAllUserData() {
    SyncStorage.set('userdata', null);
    SyncStorage.set('token', null);
    SyncStorage.set('login', null);
    SyncStorage.set('fromRegister',false);
  }
}
