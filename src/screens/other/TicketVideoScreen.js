import React, { useState, useEffect } from 'react'
import { View, FlatList, ScrollView } from 'react-native'
import { User } from '../../utils/user'
import EducationVideoListItem from './educationVideoListItem'
import { IMAGE, color } from '../../constant'
import { APIRequest, ApiUrl } from '../../utils/api'
import TicketListSkelton from '../../utils/skeltons/TicketListSkelton'
import NoRecord from './noRecord'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TicketVideoScreen = (props) => {
  const [isLoading, setisLoading] = useState(true);
  const [Videos, setVideos] = useState([]);
  const user = new User().getuserdata()


  useEffect(() => {
    getVideos()
  }, [])


  const getVideos = () => {
    let config = {
      url: `${ApiUrl.educationPurchased}/${user.id}`,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        console.log(res);
        setVideos(res.data);
        setisLoading(false);
      },
      err => {
        console.log(err);
        setisLoading(false);
      },
    );
  };

  console.log(user);

  return (
    <ScrollView>
      {isLoading ?
        <FlatList
          data={[1, 2, 3, 5, 5, 7]}
          renderItem={(item) => <TicketListSkelton />}
          keyExtractor={item => `SkeletonListOfMediaTickets${item}`}
        />
        :
        Videos.length == 0 ? (
          <NoRecord
            image={IMAGE.Ticket}
            title="No Videos"
            description="Buy a videos of an event to make them appear here."
            buttonText="Explore course"
            navigation={props.navigation}
            navigateTo={'popularEvent'}
            showButton={true}
          />
        ) : (
            <View style={{marginBottom: hp(41) }}>
              {Videos.map((d) => (
                <View style={{
                  marginTop: 20,
                  backgroundColor: color.white,
                  borderRadius: 10,
                }}>
                  <EducationVideoListItem item={d} purchased={true} />
                </View>
              ))}
            </View>
        )}
    </ScrollView>
  )
}

export default TicketVideoScreen;

