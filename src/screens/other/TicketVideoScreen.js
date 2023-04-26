import React, { useState, useEffect } from 'react'
import { View, FlatList, ScrollView, StyleSheet } from 'react-native'
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
import EducationVideoListItemBooking from './educationVideoListItemBooking'

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

  return (
    <View>
      {isLoading ?
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={(item) => <TicketListSkelton />}
          keyExtractor={item => `SkeletonListOfVideosTickets${item}`}
        />
        :
        Videos.length == 0 ? (
          <View style={styles.NoRecordWrapper}>
            <NoRecord
              image={IMAGE.noMedia}
              title="No Videos"
              description="Buy a videos of an courses to make them appear here."
              buttonText="Explore course"
              navigation={props.navigation}
              navigateTo={'Education'}
              showButton={true}
            />
          </View>
        ) : (
          <ScrollView style={{height:hp(75) }}>
            {Videos.map((d) => (
              <View style={{
                marginTop: 20,
                backgroundColor: color.white,
                borderRadius: 10,
              }}>
                <EducationVideoListItemBooking item={d} purchased={true} />
              </View>
            ))}
          </ScrollView>
        )}
    </View>
  )
}

export default TicketVideoScreen;


const styles = StyleSheet.create({
  NoRecordWrapper: {
    height: hp(80),
    backgroundColor: color.white
  },
});
