import React, { useState, useEffect, FC, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { APIRequest, ApiUrl, IMAGEURL, Toast } from '../../utils/api';
import EducationListItem from './educationListItem';
import EventListSkelton from '../../utils/skeltons/eventListSkelton';
import NoRecord from './noRecord';

export default class EducationShowAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: 0,
      filter_type: this.props.route.params.filter_type,
      isLoading: true,
    };
  }

  componentDidMount = () => {
    this.getEvents();
  };

  getEvents = () => {
    let config = {
      url: ApiUrl.educationListFilter,
      method: 'post',
      body: {
        filter_type: this.state.filter_type!=='live'? this.state.filter_type: '' ,
        course_type: this.state.filter_type==='live'? this.state.filter_type: '' 
      },
    };
    APIRequest(
      config,
      res => {
        this.setState({
          data: res.data,
        });
        this.setState({ ...this.state, isLoading: false })
      },
      err => {
        console.log(err);
        this.setState({ ...this.state, isLoading: false })
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.lightGray} />
        <View style={styles.headerBox}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backImageBox}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={IMAGE.back}
                style={styles.backImage}
              />
            </TouchableOpacity>

            <Text style={styles.headerText}>
              {this.props.route.params.title}
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('filterScreenEducation')}>
              <Image
                source={IMAGE.filterList}
                style={styles.filterImage}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <Divider style={styles.divider} /> */}
        <View style={styles.listBox}>
          {!this.state.isLoading ?
            this.state.data.length > 0 ? <FlatList
              data={this.state.data}
              keyExtractor={index => `educationList-${index}`}
              renderItem={({ item }) => (
                <EducationListItem item={item} />
              )}
              numColumns={2}
            /> :
              <NoRecord
                image={IMAGE.noConversation}
                title="No Courses found"
                description="You will get Featured and Live conferences Courses here."
                showButton={false}
              />
            :
            <FlatList
              keyExtractor={index => `featuredCourseSkelton-${index}`}
              showsVerticalScrollIndicator={false}
              data={[0, 1, 2, 3, 4, 6]}
              numColumns={2}
              renderItem={() => (
                <EventListSkelton />
              )}
            />
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    backgroundColor: color.lightGray,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp(4) : 2,
  },
  headerBox: {
    marginHorizontal: '4%',
    marginVertical: '6%',
  },
  backImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  backImageBox: {
    height: 30,
    width: 30
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
  listBox: {
    backgroundColor: '#00000012',
    paddingHorizontal: 10,
    flex: 1
  },
  filterImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  }
});
