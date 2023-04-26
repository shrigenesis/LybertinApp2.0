import { APIRequest, ApiUrl } from "./api";
import * as RootNavigation from './../../RootNavigation';
const RegisterDeeplink = (link) => {
  console.log(link);
  const RouteType = link?.split("/")[3]; 
  const id = link?.split("=")[1];
if (RouteType === "education") {
  console.log(RouteType, id);
  RootNavigation.navigate('educationDetails', { id: id});
}


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
          RootNavigation.navigate('eventDetails', { event_id: res?.link_data?.event_id});
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  export default RegisterDeeplink;