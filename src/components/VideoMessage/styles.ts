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
      borderRadius: theme.borders.messageBorderRadius,
      overflow: 'hidden',
    },
    video: {
      width: Math.min(messageWidth, screenWidth * 0.8),
      height: 200,
      backgroundColor: theme.colors.background,
    },
    thumbnail: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {
      opacity: 0.8,
    },
  }) 