import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { color } from '../constant'

const ReadMore = ({ description }) => {
  const [isExtend, setisExtend] = useState(false)
  console.log(description.length);
  return (
    <View>
      {description.length > 150 ?
        <View>
          <Text numberOfLines={isExtend ? -1 : 3}>
            {description}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setisExtend(d => !d)
            }>
            <Text
              style={{ color: color.btnBlue, textAlign: 'right' }}>
              {isExtend ? 'less' : '...read more'}
            </Text>
          </TouchableOpacity>
        </View>
        : 
        <Text>{description}</Text>
        }
    </View>
  )
}

export default ReadMore