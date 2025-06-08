import { StyleSheet } from 'react-native'

import { MessageType, Theme } from '../../types'

interface StyleProps {
  message: MessageType.DerivedAudio
  messageWidth: number
  theme: Theme
}

export default ({ message, messageWidth, theme }: StyleProps) =>
  StyleSheet.create({
    container: {
      maxWidth: messageWidth,
      minWidth: 100,
      padding: 12,
      borderRadius: theme.borders.messageBorderRadius,
      backgroundColor: theme.colors.inputBackground,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    duration: {
      marginLeft: 12,
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: theme.colors.primary,
    },
  }) 