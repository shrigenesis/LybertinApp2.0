/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, Text, View } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import EventList from '../screens/other/eventList';
import EventListOrganiser from './../screens/other/eventListOrganiser';
import Barcode from '../screens/other/Barcode';
import friends from './../screens/other/friends';
import GroupList from './../screens/other/groupList';
import Request from './../screens/other/request';
import Search from './../screens/other/search';
import Chat from './../screens/other/chat';
import GroupChat from './../screens/other/groupChat';
import PostStory from './../screens/other/postStory';
import MyProfile from './../screens/other/myProfile';
import ShowStory from './../screens/other/ShowStory';
import Blocklist from './../screens/other/blocklist';
import Media from './../screens/other/media';
import UserProfile from './../screens/other/userprofile';
import AddGroup from './../screens/other/addGroup';
import EditProfile from './../screens/other/editprofile';
import ShowImg from './../screens/other/ShowImg';
import eventDetails from '../screens/other/eventDetails';
import eventDetailsOrg from '../screens/other/eventDetailsOrg';
import buyTicket from '../screens/other/buyTicket';
import ticketsScreen from '../screens/other/ticketsScreen';
import featuredEvent from '../screens/other/featuredEvent';
import popularEvent from '../screens/other/popularEvent';
import filterScreen from '../screens/other/filterScreen';
import chooseEventDate from '../screens/other/chooseEventDate';
// import ticketDetails from '../screens/other/ticketDetails';
import TicketDetails from '../screens/other/ticketDetails';
import ticketDetailsqrcode from '../screens/other/ticketDetailsqrcode';
import groupInfo from '../screens/other/groupInfo';
import addParticipent from '../screens/other/addParticipent';
import highlights from '../screens/other/highlights';
import showHightlight from '../screens/other/showHightlight';
import Createhightlights from '../screens/other/Createhightlights';
import MyFriends from '../screens/other/MyFriends';
import seeAllEventOrg from '../screens/other/seeAllEventOrg';
import EventListOrganiserFilter from '../screens/other/eventListOrganiserFilter';
import EditGroup from './../screens/other/EditGroup';
import groupMedia from '../screens/other/groupMedia';
import myEarning from '../screens/other/myEarning';
import webPage from '../screens/other/webPage';
import aboutUs from '../screens/other/aboutUs';
import addTextStory from '../screens/other/addTextStory';
import UpdateQuestions from '../screens/other/UpdateQuestions'
// drawer
// import CustomDrawerContent from './Menu';
import IMAGE from '../constant/image';
import { fontFamily } from '../constant/font';
import { color, fontSize } from '../constant';
import { User } from '../utils/user';
import { LoginContext } from '../context/LoginContext';
import ChangePassword from '../screens/other/changepassword';
import InterestSelector from '../screens/auth/interestSelector';
import PersonalitySelector from '../screens/auth/personalitySelector';
import EducationList from '../screens/other/educationList';
import EducationShowAll from '../screens/other/educationShowAll';
import educationDetails from '../screens/other/educationDetails';
import EducationVideoShowAll from '../screens/other/educationVideoShowAll';
import VideoPlayer from '../screens/other/VideoPlayer';
import Marketplace from '../screens/other/Marketplace';
import MarketplaceDetails from '../screens/other/MarketplaceDetails';
import Wallet from './../screens/other/Wallet';
import Withdraw from '../screens/other/Withdraw';
import { G, Path, Svg } from 'react-native-svg';
import filterScreenEducation from '../screens/other/filterScreenEducation';
import FeaturedCourse from '../screens/other/FeaturedCourse';
import Payment from '../screens/other/Payment';
import LiveConference from '../screens/other/LiveConference';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
export const isMountedRef = React.createRef();

function OtherTabBar() {
  const tabstyle = {
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
      height: Platform.OS == 'ios' ? hp(9) : hp(7),
      paddingTop: hp(1),
    },
    tabBarLabelStyle: {
      fontFamily: fontFamily.Regular,
    },
  };

  const ActiveInActiveTab = ({ focus, label, image, imageFocus }) => {
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 5,
          width: wp(25),
          alignItems: 'center',
          // borderBottomWidth: Platform.OS == 'ios' ? 0.5 : 2,
        }}>
        <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
            }}
            source={focus?imageFocus:image}
          />
       
        <Text
          style={[
            {
              fontFamily: fontFamily.Medium,
              color: color.iconGray,
              fontSize: fontSize.size10,
            },
            focus && { color: color.btnBlue },
          ]}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="Events"
      screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
      <Tab.Screen
        name={'Friends'}
        component={friends}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.friend}
                imageFocus={IMAGE.friendFocus}
                label={'Friends'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'Groups'}
        component={GroupList}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.group}
                imageFocus={IMAGE.groupFocus}
                label={'Groups'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'Events'}
        component={EventList}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.event}
                imageFocus={IMAGE.eventFocus}
                label={'Events'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'Education'}
        component={EducationList}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.education}
                imageFocus={IMAGE.educationFocus}
                label={'Education'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'ticketsScreen'}
        component={ticketsScreen}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.tickets}
                imageFocus={IMAGE.ticketsFocus}
                label={'Tickets'}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function OtherTabBarOrg() {
  const tabstyle = {
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
      height: Platform.OS == 'ios' ? hp(12) : hp(7),
      paddingTop: hp(1),
    },
    tabBarLabelStyle: {
      fontFamily: fontFamily.Regular,
    },
  };

  const ActiveInActiveTab = ({ focus, label, image }) => {
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 5,
          width: wp(20),
          alignItems: 'center',
          borderBottomWidth: Platform.OS == 'ios' ? 0.5 : 2,
        }}>
        <Image
          style={{
            width: 25,
            tintColor: focus ? color.btnBlue : color.iconGray,
            height: 25,
            resizeMode: 'contain',
          }}
          source={image}
        />
        <Text
          style={[
            {
              fontFamily: fontFamily.Medium,
              color: color.iconGray,
              fontSize: 10,
            },
            focus && { color: color.btnBlue, fontFamily: fontFamily.Bold },
          ]}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
      <Tab.Screen
        name={'Friends'}
        component={friends}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.friend}
                label={'Friends'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'Groups'}
        component={GroupList}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.group}
                label={'Groups'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'Events'}
        component={EventListOrganiser}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.event}
                label={'My Events'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'ScanTickets'}
        component={Barcode}
        options={{
          ...tabstyle,
          tabBarIcon: ({ size, focused }) => {
            return (
              <ActiveInActiveTab
                focus={focused}
                image={IMAGE.scan2x}
                label={'Scan Tickets'}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export const OtherStack = ({ fromRegister, isLogin }) => (

  <Stack.Navigator>
    {isLogin == 'true' && (
      <>
        {(fromRegister) && (
          <Stack.Screen
            name="interestSelector"
            component={InterestSelector}
            options={{
              header: () => null,
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          />
        )}
        {(fromRegister) && (
          <Stack.Screen
            name="personalitySelector"
            component={PersonalitySelector}
            options={{
              header: () => null,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
        )}
      </>
    )}



    <Stack.Screen
      name="EventList"
      component={OtherTabBar}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="GroupChat"
      component={GroupChat}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="ShowStory"
      component={ShowStory}
      options={{
        header: () => null,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
    />
    <Stack.Screen
      name="Request"
      component={Request}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />

    <Stack.Screen
      name="Search"
      component={Search}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="UserProfile"
      component={UserProfile}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="AddGroup"
      component={AddGroup}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="ShowImg"
      component={ShowImg}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="Blocklist"
      component={Blocklist}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="MyProfile"
      component={MyProfile}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="MyFriends"
      component={MyFriends}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="marketplace"
      component={Marketplace}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="wallet"
      component={Wallet}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="withdraw"
      component={Withdraw}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="marketplaceDetails"
      component={MarketplaceDetails}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="Media"
      component={Media}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="PostStory"
      component={PostStory}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="eventDetails"
      component={eventDetails}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="educationDetails"
      component={educationDetails}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="videoPlayer"
      component={VideoPlayer}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="LiveConference"
      component={LiveConference}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="eventDetailsOrg"
      component={eventDetailsOrg}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />

    <Stack.Screen
      name="buyTicket"
      component={buyTicket}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="featuredEvent"
      component={featuredEvent}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="featuredCourse"
      component={FeaturedCourse}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="popularEvent"
      component={popularEvent}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="educationShowAll"
      component={EducationShowAll}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="educationVideoShowAll"
      component={EducationVideoShowAll}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="filterScreen"
      component={filterScreen}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="filterScreenEducation"
      component={filterScreenEducation}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="chooseEventDate"
      component={chooseEventDate}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="ticketDetails"
      component={TicketDetails}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="ticketDetailsqrcode"
      component={ticketDetailsqrcode}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />

    <Stack.Screen
      name="groupInfo"
      component={groupInfo}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="addParticipent"
      component={addParticipent}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="highlights"
      component={highlights}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="Createhightlights"
      component={Createhightlights}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />

    <Stack.Screen
      name="showHightlight"
      component={showHightlight}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="seeAllEventOrg"
      component={seeAllEventOrg}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="eventListOrganiserFilter"
      component={EventListOrganiserFilter}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="EditGroup"
      component={EditGroup}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="groupMedia"
      component={groupMedia}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="myEarning"
      component={myEarning}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="webPage"
      component={webPage}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="aboutUs"
      component={aboutUs}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="addTextStory"
      component={addTextStory}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="UpdateQuestions"
      component={UpdateQuestions}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
    <Stack.Screen
      name="Payment"
      component={Payment}
      options={{ header: () => null, ...TransitionPresets.SlideFromRightIOS }}
    />
  </Stack.Navigator>
);
// export const OtherStack = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{swipeEdgeWidth:0,headerShown: false}}
//     //   drawerContent={props => <CustomDrawerContent {...props} />}
//       >
//       <Drawer.Screen name="TabBar" component={OtherTabBar} />
//     </Drawer.Navigator>
//   );
// };
