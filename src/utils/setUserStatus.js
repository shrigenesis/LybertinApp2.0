import { APIRequest, ApiUrl } from "./api";
import { User } from "./user";



const userdata = new User().getuserdata();

const setUserStatus = (status) => {
  let config = {
    url: ApiUrl.updateStatus,
    method: 'post',
    body: {
      user_id: userdata.id,
      is_online: status
    },
  };
  APIRequest(
    config,
    res => {
      console.log(res);
      return;
    },
    err => {
      console.log(err?.response?.data);
      return;

    },
  );
  return;
}

export default setUserStatus