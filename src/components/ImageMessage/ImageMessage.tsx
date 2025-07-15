import { MessageType, Size } from '../../types'
import { ThemeContext, UserContext, useTwilio } from '../../utils'
import styles from './styles'
import * as React from 'react'
import { Image, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'

export interface ImageMessageProps {
  message: MessageType.DerivedImage
  /** Maximum message width */
  messageWidth: number
}

/** Image message component. Supports different
 * aspect ratios */
export const ImageMessage = React.memo(
  ({ message, messageWidth }: ImageMessageProps) => {
    const theme = React.useContext(ThemeContext)
    const user = React.useContext(UserContext)

    const size = {
      height: message.metadata?.height ?? 300,
      width: message.metadata?.width ?? 200,
    }
    const aspectRatio = size.width / (size.height || 1)
    const isMinimized = false
    const { horizontalImage, minimizedImage, verticalImage, captionText } =
      styles({
        aspectRatio,
        message,
        messageWidth,
        theme,
        user,
      })

    const renderImage = () => {
      return (
        <FastImage
          accessibilityRole='image'
          resizeMode='contain'
          source={{ uri: message.uri }}
          style={
            isMinimized
              ? minimizedImage
              : aspectRatio < 1
              ? verticalImage
              : horizontalImage
          }
        />
      )
    }
    return (
      <View>
        {message?.text ? <Text style={captionText}>{message.text}</Text> : null}
        {renderImage()}
      </View>
    )
  },
  (a, b) => a.message.uri === b.message.uri && a.message.id === b.message.id
)
