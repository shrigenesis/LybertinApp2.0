// import React,{useEffect, useRef,useState} from "react";
// import {Image,View,Text,FlatList,TouchableOpacity,Dimensions, StyleSheet} from 'react-native';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {color,fontFamily} from "./../constant/";
// import IMAGE from "../constant/image";
// import {IMAGEURL} from './../utils/api';

// export function ImageGallery({data=[],showImageGallery,close=()=>{}}) {
//     const [showCloseWraper,setShowCloseWraper] = useState(false);
//     const flatlistRef = useRef(null);
//     const [activeEventIndex, setActiveEventIndex] = useState(0);
  
//     const onViewChanged = React.useRef(({viewableItems}) => {
//       if (viewableItems.length > 0) {
//         const {index, item} = viewableItems[0];
//         setActiveEventIndex(index);
//       }
//     });

//     useEffect(()=>{
//         // if(snapIndex) {
//         //     flatlistRef?.current?.scrollToIndex({ animated: true,index:snapIndex }) 
//         // }
//     },[])
//     return (
//         <Modal onRequestClose={()=>close()} visible={showImageGallery} >
//             <View>
//                 <View style={style.counterWraper}>
//                     <View>
//                         <Text style={style.counter}>{activeEventIndex+1} / {data.length}</Text>
//                     </View>
//                     <TouchableOpacity onPress={()=>{close(false)}}>
//                         <Image source={IMAGE.close} style={style.close} />
//                     </TouchableOpacity>
//                 </View>
//                 <FlatList
//                     ref={flatlistRef}
//                     showsHorizontalScrollIndicator={false}
//                     overScrollMode={'never'}
//                     snapToInterval={Dimensions.get('window').width}
//                     snapToAlignment={'center'}
//                     data={data}
//                     horizontal={true}
//                     // initialScrollIndex={(snapIndex)?snapIndex:0}
//                     disableIntervalMomentum
//                     viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
//                     onViewableItemsChanged={onViewChanged.current}
//                     onScrollToIndexFailed={info => {
//                     const wait = new Promise(resolve => setTimeout(resolve, 500));
//                     wait.then(() => {
//                         flatlistRef.current?.scrollToIndex({
//                         index: info.index,
//                         animated: true,
//                         });
//                     });
//                     }}
//                     renderItem={({item, index}) => {
//                     return (
//                         <TouchableOpacity onPress={()=>setShowCloseWraper(!showCloseWraper)} activeOpacity={1}>
//                             <Image source={{uri:`${IMAGEURL}/${item.content}`}} style={{resizeMode:'contain',backgroundColor:'#fff',height:hp(100),width:wp(100)}} />
//                         </TouchableOpacity>
//                     )
//                     }}
//                 />
//         </View>
//       </Modal>
//     );
//   }
  
//   const style = StyleSheet.create({
//     counter:{
//         fontFamily:fontFamily.Bold,
//         color:color.white,
//         fontSize:20
//     },
//     close:{
//         tintColor:'#fff',
//         height:20,
//         width:20,
//         marginTop:hp(1)
//     },
//     counterWraper:{
//         paddingTop:hp(3),
//         paddingHorizontal:wp(5),
//         height:hp(10),
//         flexDirection:'row',
//         justifyContent:'space-between',
//         width:wp(100),
//         backgroundColor:'rgba(20, 20, 20,0.5)',
//         position:'absolute',
//         zIndex:999
//     }
//   })