import React,{ memo} from 'react'
import {View,StyleSheet,FlatList,Text, TouchableOpacity,Pressable, ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {color} from './../constant/';
import emoji from "emoji-datasource";
import Icon from 'react-native-vector-icons/FontAwesome5';

const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split("-").map(u => "0x" + u));

const _RenderEmoji = memo(({item,selectEmoji}) =>{
    return(
        <Pressable key={`${item.unified}`} onPress={()=>selectEmoji(charFromUtf16(item?.unified))}>
            <Text style={styles.emoji} >{charFromUtf16(item?.unified)}</Text>
        </Pressable>
    )
})

export default class EmojiKeyboard extends React.PureComponent {
    data: Map<*, *> = new Map();

    constructor(props) {
        super(props);
        this.state = {
            isReady:false,
            selectedCategory:'Smileys & Emotion'
        }
        this.Categories = [
            {
              symbol: "😀",
              name: "Smileys & Emotion"
            },
            {
              symbol: "🧑",
              name: "People & Body"
            },
            {
              symbol: "🦄",
              name: "Animals & Nature"
            },
            {
              symbol: "🍔",
              name: "Food & Drink"
            },
            {
              symbol: "⚾️",
              name: "Activities"
            },
            {
              symbol: "✈️",
              name: "Travel & Places"
            },
            {
              symbol: "💡",
              name: "Objects"
            },
            {
              symbol: "🔣",
              name: "Symbols"
            },
            {
              symbol: "🏳️‍🌈",
              name: "Flags"
            }
        ];
    }


    componentDidMount() {
        this.loadEmoji();
        setTimeout(() => {
            this.setState({isReady:true})
        }, 1000);
    }

    loadEmoji(){
        let emojiList = {}
        for(let value of emoji) {
            if(emojiList[value.category]) {
                emojiList[value.category].push({unified:value.unified})
            } else {
                emojiList[value.category] = new Array({unified:value.unified})
            }
        }
        this.data = emojiList;
        return true;
    }

    renderEmojiIcons(){
        return this.data[this.state.selectedCategory]
    }

    render() {
        return (
            <View style={styles.emojiKeyboard}>
                {(this.state.isReady)&&
                <>
                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={this.Categories}
                            horizontal={true}
                            keyExtractor={(item)=>String(item?.name)}
                            renderItem={({item,index})=><TouchableOpacity onPress={()=>{this.setState({selectedCategory:item.name})}} style={[styles.iconRow,(item.name==this.state.selectedCategory)&&{borderBottomWidth:2,borderColor:color.btnBlue}]}><Text style={styles.emoji}>{item.symbol}</Text></TouchableOpacity>}    
                        />
                    </View>
                    <FlatList
                        key={'01'}
                        showsVerticalScrollIndicator={false}
                        // contentContainerStyle={{paddingHorizontal:10}}
                        numColumns={10}
                        data={this.renderEmojiIcons()}
                        initialNumToRender={20}
                        keyExtractor={(item)=>String(item?.unified)}
                        renderItem={({item,index})=><_RenderEmoji selectEmoji={this.props.onSelectEmoji} item={item}/>}
                    />
                    {/* <TouchableOpacity onPress={this.props.backPress} activeOpacity={1} style={{position:'absolute',zIndex:9999,backgroundColor:color.textGray2,right:15,borderRadius:5,paddingHorizontal:5,paddingVertical:5,bottom:15}}>
                        <Icon name='backspace' style={{fontSize:20}} />
                    </TouchableOpacity> */}
                </>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    iconRow:{
        marginLeft:12,
        height:hp(5),
    },
    emoji:{
        width:40,
        height:40,
        fontSize:22,
        paddingLeft:5,
        paddingTop:5,
    },
    emojiKeyboard:{
        flex:1,
        backgroundColor:color.borderGray,
    },
})