<View style={styles.container}>
  <SafeAreaView>
    <FocusAwareStatusBar
      barStyle={'dark-content'}
      backgroundColor={color.white}
    />
    <Header
      appReady={this.state.appReady}
      isLoading={this.state.isLoading}
      LeftIcon={() => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{
              height: 34,
              width: 30,
              marginLeft: hp(-1),
              marginRight: hp(-2),
            }}>
            <Icon
              name={'angle-left'}
              style={{
                fontSize: 30,
                color: color.black,
                marginLeft: hp(1),
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({page: 1});
              this.props.navigation.navigate('UserProfile', {
                data: {
                  ...this.props?.route?.params,
                  name: this.props?.route?.params?.userName,
                },
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: wp(3),
            }}>
            {this.props?.route?.params?.avatar ? (
              <Image
                source={{
                  uri: `${IMAGEURL}/${this.props?.route?.params?.avatar}`,
                }}
                style={{
                  marginLeft: wp(2),
                  borderRadius: 120,
                  height: 40,
                  width: 40,
                }}
              />
            ) : (
              <Image
                source={IMAGE.chatgirl}
                style={{
                  marginLeft: wp(2),
                  borderRadius: 120,
                  height: 30,
                  width: 30,
                }}
              />
            )}
            <View
              style={{
                marginLeft: wp(3),
                marginTop: hp(1.5),
                width: wp(60),
              }}>
              <Text numberOfLines={1} style={styles.heading}>
                {this.props?.route?.params?.userName}
              </Text>
              <Text
                style={[
                  styles.onlineText,
                  {
                    color:
                      this.state.isOnline == '1' ? 'green' : color.textGray2,
                  },
                ]}>
                {this.state.isTyping
                  ? 'Typing...'
                  : this.state.isOnline == '1'
                  ? 'Online'
                  : 'Offline'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      title={null}
    />
  </SafeAreaView>

  <View
    style={{
      // gap: 10,
      ...Platform.select({
        ios: {
          flex: 1,
          // minHeight: Dimensions.get('window').height - 60
        },
        android: {
          flex: 1,
        },
      }),
    }}>
    {this.state.isLoading && this.state.page > 1 && (
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: color.chatRight,
          padding: 10,
          borderRadius: 10,
          columnGap: 10,
          top: 0,
          zIndex: 1,
        }}>
        <ActivityIndicator size="small" color={color.btnBlue} />
        <Text style={{fontStyle: 'italic'}}>Please wait...</Text>
      </View>
    )}
    <AudioContextProvider>
      <FlatList
        ref={this.chatListRef}
        data={this.state.chatList}
        keyExtractor={item => item.uuid}
        inverted={true}
        onEndReached={this.onScrollHandler}
        onEndThreshold={1}
        style={{
          flex: 1,
          marginBottom: Platform.OS === 'ios' ? 15 : 15,
        }}
        renderItem={({item, index}) => (
          <ChatItem
            onImagePress={files =>
              this.props.navigation.navigate('ShowImg', {
                file: files?.file,
                fileType: files?.fileType,
              })
            }
            user_id={this.props?.route?.params?.user_id}
            avatar={this.props?.route?.params?.avatar}
            item={item}
            index={index}
            menu={this.state.menu}
            reportOn={replyMSG => this.handleOnReportOn(replyMSG)}
          />
        )}
      />

      {this.state.appReady && (
        <BottomViewNew
          message={this.state.message}
          file={this.state.file}
          audioFile={file => this.setState({audioFile: file})}
          deleteFile={() => this.setState({file: undefined})}
          sendMessage={
            this.state.file || this.state.audioFile != ''
              ? this.sendFile
              : this.sendMessage
          }
          textChange={v => {
            this.setState({message: v});
            this.onTyping(v != '');
          }}
          inputFocus={() => this.setState({isShowBottomSheet: false})}
          addPress={() => {
            Keyboard.dismiss();
            // this.bottomSheetRef?.current?.expand();
            this.setState({isShowBottomSheet: true});
          }}
          emojiSelect={v => {
            this.setState({message: `${this.state.message}${v}`});
          }}
          setFile={file => {
            this.setState({file: file});
          }}
          isConnected={this.state.isConnected}
        />
      )}
      {/* </View> */}
    </AudioContextProvider>

    <BottomSheetUploadFile
      cancelBtn={{
        color: color.lightGray,
        title: 'Cancel',
        textColor: color.btnBlue,
      }}
      isShowBottomSheet={this.state.isShowBottomSheet}
      setisShowBottomSheet={this.setisShowBottomSheet.bind(this)}>
      <View>
        {/* <View style={{ alignContent: 'center', paddingVertical: hp(1), marginBottom: 10 }}>
                  <Text style={BottomSheetUploadFileStyle.roportHeading}>Add Story</Text>
                  <Text style={BottomSheetUploadFileStyle.subHeading}>Post Photo Video To Your Story</Text>
                </View> */}
        <View>
          <TouchableOpacity
            onPress={() =>
              pickImage(
                'camera',
                res => {
                  // file(res);
                  this.UpdateFile(res);
                },
                'photo',
              )
            }
            style={BottomSheetUploadFileStyle.cardBlock}>
            <Image
              source={IMAGE.camera}
              style={BottomSheetUploadFileStyle.icon}
            />
            <Text style={BottomSheetUploadFileStyle.cardText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              pickImage(
                'image',
                res => {
                  this.UpdateFile(res);
                },
                'photo',
              )
            }
            style={BottomSheetUploadFileStyle.cardBlock}>
            <Image
              source={IMAGE.camera}
              style={BottomSheetUploadFileStyle.icon}
            />
            <Text style={BottomSheetUploadFileStyle.cardText}>
              Select Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              pickImage(
                'camera',
                res => {
                  this.UpdateFile(res);
                },
                'video',
              )
            }
            style={BottomSheetUploadFileStyle.cardBlock}>
            <Image
              source={IMAGE.video}
              style={BottomSheetUploadFileStyle.icon}
            />
            <Text style={BottomSheetUploadFileStyle.cardText}>Take Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              pickImage(
                'image',
                res => {
                  this.UpdateFile(res);
                },
                'video',
              )
            }
            style={BottomSheetUploadFileStyle.cardBlock}>
            <Image
              source={IMAGE.video_add}
              style={BottomSheetUploadFileStyle.icon}
            />
            <Text style={BottomSheetUploadFileStyle.cardText}>
              Select Video
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              pickDocument(res => {
                this.UpdateFile(res);
              })
            }
            style={BottomSheetUploadFileStyle.cardBlock}>
            <Image
              source={IMAGE.note}
              style={BottomSheetUploadFileStyle.icon}
            />
            <Text style={BottomSheetUploadFileStyle.cardText}>Document</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetUploadFile>
  </View>
</View>