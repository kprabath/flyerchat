import { StyleSheet, Dimensions } from 'react-native'

import { MessageType, Theme } from '../../types'

interface StyleProps {
  message: MessageType.DerivedVideo
  messageWidth: number
  theme: Theme
}

const { width: screenWidth } = Dimensions.get('window')

export default ({ message, messageWidth, theme }: StyleProps) =>
  StyleSheet.create({
    container: {
      maxWidth: messageWidth,
      minWidth: 100,
      overflow: 'hidden',
      padding: 12
    },
    subContainer: {
      width: Math.min(messageWidth, screenWidth * 0.8),
      height: 200,
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    absoluteWrapper:{...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center'},
    captionText: {
      marginBottom: 10,
      color: '#fff'
    }
  }) 