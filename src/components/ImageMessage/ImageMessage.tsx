import { MessageType, Size } from '../../types'
import { formatBytes, ThemeContext, UserContext, useTwilio } from '../../utils'
import styles from './styles'
import * as React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'

export interface ImageMessageProps {
  message: MessageType.DerivedImage
  /** Maximum message width */
  messageWidth: number
}

/** Image message component. Supports different
 * aspect ratios, renders blurred image as a background which is visible
 * if the image is narrow, renders image in form of a file if aspect
 * ratio is very small or very big. */
export const ImageMessage = ({ message, messageWidth }: ImageMessageProps) => {
  const theme = React.useContext(ThemeContext)
  const user = React.useContext(UserContext)
  const twilioContext = useTwilio()

  const [url, setUrl] = React.useState<string>()

  const defaultHeight = message.height ?? 0
  const defaultWidth = message.width ?? 0
  const [size, setSize] = React.useState<Size>({
    height: 300,
    width: 300,
  })
  const aspectRatio = size.width / (size.height || 1)
  const isMinimized = aspectRatio < 0.1 || aspectRatio > 10
  const {
    horizontalImage,
    minimizedImage,
    minimizedImageContainer,
    nameText,
    sizeText,
    textContainer,
    verticalImage,
    captionText,
  } = styles({
    aspectRatio,
    message,
    messageWidth,
    theme,
    user,
  })

  React.useEffect(() => {
    ;(async () => {
      // if file is a local path
      let uri = message.uri
      if (
        message.uri.startsWith('file://') ||
        message.uri.startsWith('content://')
      ) {
        console.log('this is a local url', uri)
      } else {
        uri = await twilioContext?.downloadFile?.({
          taskId: message.id,
          mimeType: message.mimeType,
          fileName: message.name,
          uri: message.uri,
        })
      }
      if (uri) {
        setUrl(uri)
        if (defaultHeight <= 0 || defaultWidth <= 0)
          Image.getSize(
            uri,
            (width, height) => {
              setSize({ height, width })
            },
            (error) => {
              setSize({ height: 0, width: 0 })
            }
          )
      }
    })()
  }, [message.uri])

  const renderImage = () => {
    return (
      <FastImage
        accessibilityRole='image'
        resizeMode={isMinimized ? 'cover' : 'contain'}
        source={{ uri: url || message.uri }}
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

  return isMinimized ? (
    <View style={minimizedImageContainer}>
      {renderImage()}
      <View style={textContainer}>
        <Text style={nameText}>{message.name}</Text>
        <Text style={sizeText}>{formatBytes(message.size)}</Text>
      </View>
    </View>
  ) : (
    <View>
      {message?.text ? <Text style={captionText}>{message.text}</Text> : null}
      <ImageBackground blurRadius={26} source={{ uri: message.uri }} style={{}}>
        {renderImage()}
      </ImageBackground>
    </View>
  )
}
