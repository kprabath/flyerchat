import styles from './styles'
import * as React from 'react'
import { View, Image, Pressable, Text } from 'react-native'
import { PlayButton } from '../PlayButton/PlayButton'

import { MessageType } from '../../types'
import { ThemeContext } from '../../utils'

export interface VideoMessageProps {
  message: MessageType.DerivedVideo
  messageWidth: number
  onVideoPress?: (message: MessageType.Video) => void
}

// render a generic video component here

export const VideoMessage = React.memo(
  ({ message, messageWidth, onVideoPress }: VideoMessageProps) => {
    const theme = React.useContext(ThemeContext)

    const [generatedThumbnail, setGeneratedThumbNail] = React.useState(null);

    // TO: DO if no thumnail is available generate the thmumnail
    // pass a functon called generate thumnail from props which will generate the thumnail 
    // using native android and ios
    // and it will get updated 

    const { container, thumbnailImage, subContainer, absoluteWrapper, captionText } = styles({
      message,
      messageWidth,
      theme,
    })

    const handlePress = () => {
      if (onVideoPress) {
        onVideoPress(message)
      }
    }

    return (
      <Pressable style={container} onPress={handlePress}>
        {message?.text ? <Text style={captionText}>{message.text}</Text> : null}
        <View style={subContainer}>
          {message?.thumbnailUrl ? (
            <Image
              source={{ uri: message.thumbnailUrl }}
              style={thumbnailImage}
              resizeMode='cover'
            />
          ) : null}
          <View style={absoluteWrapper}>
            <PlayButton size={40} />
          </View>
        </View>
      </Pressable>
    )
  }
)
