import { StyleSheet } from 'react-native'

import { MessageType, Theme, User } from '../../types'

interface StyleProps {
  message: MessageType.DerivedAudio
  messageWidth: number
  theme: Theme
  user?: User
}

export default ({ message, messageWidth, theme , user }: StyleProps) =>
  StyleSheet.create({
    container: {
      maxWidth: messageWidth,
      minWidth: 100,
      padding: 12
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
      tintColor: theme.colors.secondary,
    },
    captionText: {
      marginBottom: 10,
      color:  user?.id === message.author.id ? '#fff'  :  undefined,
    }
  }) 