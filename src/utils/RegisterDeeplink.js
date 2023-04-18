import { APIRequest, ApiUrl } from "./api";
import * as RootNavigation from './../../RootNavigation';
const RegisterDeeplink = (link) => {
  console.log(link);
  alert('link  RegisterDeeplink page')
  const RouteType = link?.split("/")[3]; 
  const id = link?.split("=")[1];
if (RouteType === "education") {
  alert('link  education')
  console.log(RouteType, id);
  RootNavigation.navigate('educationDetails', { id: id});
}


alert('link  eventDetails1')
  const token = link?.split("token=")[1];
    let config = {
      url: `${ApiUrl.registerDeeplink}`,
      method: 'post',
      body: {
        token:token
      },
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          console.log('dfbdrt hrthrth');
          alert('eventDetails')
          RootNavigation.navigate('eventDetails', { event_id: res?.link_data?.event_id});
        }
      },
      err => {
        alert('link  err eventDetails1')
        console.log(err);
      },
    );
  };
  export default RegisterDeeplink;