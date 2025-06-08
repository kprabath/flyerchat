import * as React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Video from 'react-native-video'

import { MessageType } from '../../types'
import { ThemeContext } from '../../utils'
import styles from './styles'

export interface VideoMessageProps {
  message: MessageType.DerivedVideo
  messageWidth: number
}

export const VideoMessage = React.memo(
  ({ message, messageWidth }: VideoMessageProps) => {
    const theme = React.useContext(ThemeContext)
    const [paused, setPaused] = React.useState(true)
    const { container, video } = styles({
      message,
      messageWidth,
      theme,
    })

    return (
      <View style={container}>
        <Video
          source={{ uri: message.uri }}
          style={video}
          resizeMode="contain"
          paused={paused}
          controls={true}
          repeat={false}
          onLoad={(data) => {
            // Optional: Handle video loaded
          }}
          onError={(error) => {
            console.error('Video Error:', error)
          }}
        />
      </View>
    )
  }
) 