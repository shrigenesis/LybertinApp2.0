/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import { FC, useContext } from 'react';
import { User } from './user';
import { LoginContext } from '../context/LoginContext';
import Toast from 'react-native-toast-message';

// let BASEURL = 'http://192.168.0.120:8000';
export const BASEURL = 'https://stage.shrigenesis.com';
// export const BASEURL = 'https://events.kookingklub.com';
// export const BASEURL = 'https://lybertine.com';
export const domainUriPrefix = 'https://lybertinapp.page.link';
export const twitterSuccessUrl = `${BASEURL}/twitterSuccess`
export const twitterFailUrl = `${BASEURL}/twitterFail`

let apiBaseUrl = `${BASEURL}/api/`;
let apiMarketingBaseUrl = `${BASEURL}/marketing/`;
export const socketUrl = 'https://lybertinesocketchat.shrigenesis.com';
export const termsUrl = `${BASEURL}/terms`
// export const IMAGEURL = new User().getPrefixurl();
export const IMAGEURL = `${BASEURL}/storage`;

export const BaseURL = 'https://lybertine.com/storage'

// export const Toast = msg => {
//   if (msg && typeof msg == 'string') {
//     SimpleToast.show(msg);
//   }
// };

export const ApiUrl = {
  login: `${apiBaseUrl}auth/login`,
  signup: `${apiBaseUrl}auth/signup`,
  questions: `${apiBaseUrl}questions`,
  create: `${apiBaseUrl}highlight/create`,
  highlights: `${apiBaseUrl}highlight/highlights-group`,
  logout: `${apiBaseUrl}auth/logout`,
  forget: `${apiBaseUrl}auth/forgot-password`,
  checkemail: `${apiBaseUrl}auth/check-email`,
  checkusername: `${apiBaseUrl}auth/check-username`,
  search: `${apiBaseUrl}users/search`,
  sendReq: `${apiBaseUrl}follow/send-request`,
  rejectReq: `${apiBaseUrl}follow/reject-request`,
  withdrawReq: `${apiBaseUrl}follow/withdraw-request`,
  friendList: `${apiBaseUrl}follow/friends-list`,
  conversations: `${apiBaseUrl}conversation-messages`,
  conversationsDetails: `${apiBaseUrl}conversations`,
  conversationsList: `${apiBaseUrl}conversations-list`,
  followingCount: `${apiBaseUrl}follow/followings-count`,
  followersCount: `${apiBaseUrl}follow/followers-count`,
  followers: `${apiBaseUrl}follow/followers`,
  userlist: `${apiBaseUrl}users-list`,
  sendMessage: `${apiBaseUrl}send-message`,
  oauth: `${apiBaseUrl}auth/continue-oauth`,
  continueWithEmail: `${apiBaseUrl}auth/continue-with-email`,
  my_contacts: `${apiBaseUrl}groups/my-contacts`,
  myprofile: `${apiBaseUrl}profile/auth`,
  updateprofile: `${apiBaseUrl}profile/update`,
  updateInterests: `${apiBaseUrl}profile/update`,
  changePassword: `${apiBaseUrl}profile/change-password`,
  groups: `${apiBaseUrl}groups`,
  groupCreate: `${apiBaseUrl}groups/create`,
  sendFile: `${apiBaseUrl}conversations/file-upload`,
  groupList: `${apiBaseUrl}conversations-list-groups`,
  pinUnpinChatList: `${apiBaseUrl}pin-conversations`,
  groupDetail: `${apiBaseUrl}groups/show/`,
  groupUpdate: `${apiBaseUrl}groups/update/`,
  storyCreate: `${apiBaseUrl}story/create`,
  viewStory: `${apiBaseUrl}story/view-story`,
  stories: `${apiBaseUrl}story/index`,
  deletestory: `${apiBaseUrl}story/delete-story`,
  reportstory: `${apiBaseUrl}reported-story/report`,
  requestList: `${apiBaseUrl}follow/pendingfriendRequest-list`,
  accpetRequest: `${apiBaseUrl}follow/accept-request`,
  blockedList: `${apiBaseUrl}blocked-user/blocked`,
  blockedUser: `${apiBaseUrl}blocked-user/block-unblock`,
  unfollow: `${apiBaseUrl}follow/unfollow`,
  media: `${apiBaseUrl}users/`,
  userinfo: `${apiBaseUrl}user-info/`,
  deletehighlight: `${apiBaseUrl}highlight/delete-highlight`,
  myBooking: `${apiBaseUrl}events/customer-bookings`,
  eventDetails: `${apiBaseUrl}events/show`,
  downloadTicket: `${apiBaseUrl}events/download-ticket`,
  downloadInvoice: `${apiBaseUrl}events/invoice-download`,
  getQr: `${apiBaseUrl}events/get-qrcode`,
  cancelBooking: `${apiBaseUrl}events/cancel-booking`,
  bookTickect: `${apiBaseUrl}events/book-ticket`,
  pay360CallbackSuccess: `${apiBaseUrl}pay360CallbackSuccess`,
  checkoutInfo: `${apiBaseUrl}events/checkout-info`,
  paypalProcessPayment: `${apiBaseUrl}events/paypalProcessPayment`,
  applyPromocode: `${apiBaseUrl}events/apply-promocode`,
  scanTicket: `${apiBaseUrl}events/scan-ticket`,
  eventFilter: `${apiBaseUrl}events/filter`,
  eventIndex: `${apiBaseUrl}events/index`,
  eventReport: `${apiBaseUrl}events/report-booking`,
  organizerEvents: `${apiBaseUrl}events/organizer-events`,
  courses: `${apiBaseUrl}courses`,
  getCityBasedOncountry: `${apiBaseUrl}events/getCityBasedOncountry`,
  deleteConversation: `${apiBaseUrl}deleteConversation`,
  userStories: `${apiBaseUrl}highlight/user-stories`,
  organiserTotalEarning: `${apiBaseUrl}events/organiser_total_earning`,
  highlightIndex: `${apiBaseUrl}highlight/index`,
  checkinCheckout: `${apiBaseUrl}events/checkin-checkout`,
  reportUser: `${apiBaseUrl}report-user`,

  // Marketing
  getDeeplink: `${apiMarketingBaseUrl}generate-promotional-event-deeplink`,
  registerDeeplink: `${apiMarketingBaseUrl}register-deeplink-receiver`,
  getMarketingEventList: `${BASEURL}/event_marketing`,
  getMarketingEventDetails: `${BASEURL}/event_marketing/eventInfo`,
  getWalletTransaction: `${apiMarketingBaseUrl}wallet-transactions`,
  widthdrawalRequest: `${apiMarketingBaseUrl}widthdrawal-request`,
  twitterPost: `${apiMarketingBaseUrl}post-on-twitter`,

  // Education 
  educationList: `${apiBaseUrl}courses`,
  educationListFilter: `${apiBaseUrl}courses-filter`,
  educationBuy: `${apiBaseUrl}courses/buy/course`,
  educationPurchased: `${apiBaseUrl}courses/purchased`,
  educationAddInterest: `${apiBaseUrl}user-courses-interest`,
};

export const APIRequest = async (config = {}, onSuccess, onError, noAuth = null) => {

  const token = new User().getToken();
  try {
    let data = {};
    if (token && noAuth == null) {
      data = {
        method: config.method,
        url: config.url,
        data: config.body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
    } else {
      data = {
        method: config.method,
        url: config.url,
        data: config.body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      };
    }
    console.log(data);
    axios(data)
      .then(res => {
        console.log(res);
        if (res.status == 200 || res.status == 201) {
          onSuccess(res.data);
        }

      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    console.log("error", error);
    Toast.show({
      type: 'error',
      text1: error
    });
  }
};



export const APIRequestWithFile = async (config = {}, onSuccess, onError,  uploadProgress) => {
  const token = new User().getToken();
  
  try {
    let data = {
      method: config.method,
      url: config.url,
      data: config.body,
      headers: {
        Accept: 'multipart/form-data',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progress) =>
        uploadProgress(progress, config.uniqueId),
    };
    console.log('config', data);
    axios(data)
      .then(res => {
        if (res.status == 200 || res.status == 201) {
          console.log(res.data);
          onSuccess(res.data);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: error
    });
  }
};
export const APIRequestWithFile1 = async (config = {}, onSuccess, onError, uploadProgress) => {
  const token = new User().getToken();
  try {
    let data = {
      method: config.method,
      url: config.url,
      data: config.body,
      headers: {

        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progress) =>
        uploadProgress(progress, config.uniqueId),
    };
    console.log('config', data);
    axios(data)
      .then(res => {
        if (res.status == 200 || res.status == 201) {
          onSuccess(res.data);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: error
    });
  }
};
