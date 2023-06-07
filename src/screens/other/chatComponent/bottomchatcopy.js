<KeyboardAvoidingView
      keyboardVerticalOffset={'90'}
      contentInsetAdjustmentBehavior="automatic"
      behavior={Platform.OS == 'ios' ? 'padding' : ''}>
      <View onLayout={event => updateBottomViewHeight(event)}>
        {!isRecordingStart && recordingFile && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              zIndex: 99,
              backgroundColor: '#F6F6F6',
              width: wp(100),
            }}>
            {Audio()}
          </View>
        )}
        <View
          style={{
            // flex:1,
            // flexDirection:'row',
            minHeight: hp(9),
            marginTop: replyOn
              ? replyBoxheight == ''
                ? hp(8)
                : replyBoxheight
              : hp(1),
            paddingTop: showEmojiKeyboard ? hp(6.5) : 0,
            backgroundColor: '#F6F6F6',
          }}>
          {file && (
            <Animated.View
              entering={SlideInLeft}
              exiting={SlideOutDown}
              style={styles.fileView}>
              <View
                style={{
                  width: wp(100),
                  height: 50,
                  position: 'absolute',
                  top: 0,
                  zIndex: 999,
                  backgroundColor: 'rgba(52, 52, 52, 0.4)',
                }}>
                <TouchableOpacity
                  onPress={deleteFile}
                  style={{
                    position: 'absolute',
                    left: 15,
                    top: 10,
                    zIndex: 999,
                  }}>
                  <Image
                    source={IMAGE.close}
                    style={{
                      color: color.red,
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    audio?.setaudio('');
                    sendMessage();
                  }}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    zIndex: 999,
                  }}>
                  <Image
                    source={IMAGE.right}
                    style={{
                      color: color.red,
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center'}}>
                {file?.fileType == 'pdf' ? (
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Pdf
                      trustAllCerts={false}
                      source={{
                        uri: `${file?.uri}`,
                        cache: true,
                      }}
                      // source={{uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true}}
                      style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                      }}
                    />
                  </View>
                ) : null}
                {file?.fileType == 'photo' || file?.fileType == 'image' ? (
                  <Image
                    source={{uri: file.uri}}
                    style={{
                      resizeMode: 'contain',
                      height: Platform.OS === 'ios' ? hp(85) : hp(100),
                      width: wp(100),
                    }}
                  />
                ) : null}
                {file?.fileType == 'video' || file?.fileType === 'video/mp4' ? (
                  <Video
                    source={{uri: file?.uri}}
                    resizeMode={'contain'}
                    style={{height: '100%', width: wp(100)}}
                  />
                ) : null}
              </View>
            </Animated.View>
          )}
          <View
            style={[
              styles.msgSendViewWrapper,
              showEmojiKeyboard && {marginBottom: hp(35)},
            ]}>
            {replyOn && (
              <View style={styles.replyBox}>
                <View onLayout={onLayout} style={{flex: 0.9}}>
                  <Text style={{color: color.btnBlue}}>
                    {' '}
                    {replyOn?.sender?.name}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {getIconAndMessageOnReplyBox(replyOn)}
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {replyOn?.message_type == '1' && (
                    <Image
                      source={{uri: `${IMAGEURL}/${replyOn?.file_name}`}}
                      style={{resizeMode: 'cover', height: 50, width: 50}}
                    />
                  )}
                  <TouchableOpacity onPress={removeReplyBox}>
                    <Image
                      source={IMAGE.closeCircle}
                      style={{
                        resizeMode: 'contain',
                        height: 20,
                        width: 20,
                        tintColor: color.btnBlue,
                        marginLeft: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.msgSendView}>
              {!isRecordingStart && (
                <TouchableOpacity
                  disabled={media_privacy == 2}
                  onPress={() => {
                    searchInput.current.blur();
                    setTimeout(()=>{
                      addPress();
                    },500)
                    audio?.setaudio('');
                  }}>
                  <Image
                    source={IMAGE.add}
                    style={{
                      resizeMode: 'contain',
                      height: 25,
                      width: 25,
                      tintColor: color.btnBlue,
                    }}
                  />
                </TouchableOpacity>
              )}
              <View style={{flexDirection: 'row'}}>
                {!isRecordingStart && (
                  <>
                    <TouchableOpacity
                      disabled={group_type == 2}
                      onPress={() => {
                        !isRecordingStart &&
                          setshowEmojiKeyboard(!showEmojiKeyboard);
                        Keyboard.dismiss();
                      }}
                      style={{
                        position: 'absolute',
                        zIndex: 99,
                        left: wp(5),
                        bottom: Platform.OS === 'ios' ? 10 : 5,
                      }}>
                      <Image
                        source={IMAGE.smile}
                        style={{
                          resizeMode: 'contain',
                          height: 18,
                          width: 18,
                          tintColor: color.btnBlue,
                        }}
                      />
                    </TouchableOpacity>
                    <TextInput
                      editable={group_type == 1}
                      value={message}
                      onFocus={() => {
                        setshowEmojiKeyboard(false);
                        inputFocus();
                      }}
                      onContentSizeChange={event => {
                        setheight(Math.round((event.nativeEvent.contentSize.height-41)/16));
                      }}
                      onChangeText={textChange}
                      placeholder={'Write a reply....'}
                      textAlignVertical={'center'}
                      paddingHorizontal={40}
                      placeholderTextColor={color.textGray2}
                      ref={searchInput}
                      multiline={true} 
                      // numberOfLines={
                      //   height> 0 ? height+1> 4 ? 4:(height+1):1
                      // }
                      style={[ 
                        styles.msgSendBox,
                        {height: height> 0 ? null : hp(4.5),
                          maxHeight: (height+1)>0? 100: 200
                        },
                      ]}
                    />
                    <TouchableOpacity
                      disabled={disable}
                      onPress={() => {
                        StopMultiplePress();
                        !isRecordingStart && sendMessage(),
                          setRecordingFile(''),
                          audio?.setaudio('');
                      }}
                      style={styles.sendbtn}>
                      {!isRecordingStart && (
                        <Image
                          source={IMAGE.send}
                          style={{
                            resizeMode: 'contain',
                            height: 18,
                            width: 18,
                            tintColor: color.btnBlue,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: wp(23),
                  paddingHorizontal: wp(3),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    pickCamera == 1
                      ? isRecordingStart
                        ? console.log('onStopRecord()')
                        : (onStartRecord(), textChange)('')
                      : console.log('kkkkkk');
                  }}>
                  <Image
                    source={IMAGE.mic}
                    style={{
                      tintColor: isRecordingStart ? color.red : color.btnBlue,
                      resizeMode: 'contain',
                      height: 25,
                      width: 25,
                      tintColor: color.btnBlue,
                    }}
                  />
                </TouchableOpacity>
                {isRecordingStart && (
                  <View
                    style={{
                      position: 'absolute',
                      left: wp(15),
                      width: wp(75),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Animated.Text
                      entering={FadeInLeft}
                      exiting={SlideOutRight}
                      // style={styles.recordingTimer}
                    >
                      {moment.utc(recordingTime * 1000).format('mm:ss')}
                    </Animated.Text>
                    <Text>Recording ...</Text>
                    <TouchableOpacity
                      onPress={() => {
                        pickCamera == 1
                          ? isRecordingStart
                            ? onStopRecord()
                            : onStartRecord()
                          : console.log('kkkkkk');
                      }}>
                      <Image
                        source={IMAGE.stop}
                        style={{
                          resizeMode: 'contain',
                          height: 25,
                          width: 25,
                          // tintColor: color.btnBlue,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {!isRecordingStart && (
                  <TouchableOpacity
                    onPress={() => {
                      audio?.setaudio('');
                      pickCamera == 1
                        ? pickImage(
                            'camera',
                            res => {
                              setFile(res);
                            },
                            'image',
                          )
                        : console.log('kkkkkk');
                    }}>
                    <Image
                      source={IMAGE.camera}
                      style={{
                        resizeMode: 'contain',
                        height: 25,
                        width: 25,
                        tintColor: color.btnBlue,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          {showEmojiKeyboard && (
            <Animated.View
              entering={SlideInDown}
              exiting={FadeOut}
              style={{height: hp(35), zIndex: 999}}>
              <EmojiKeyboard onSelectEmoji={emojiSelect} />
            </Animated.View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>