import { MessageType, Theme, User } from '../../types'
import { StyleSheet } from 'react-native'

const styles = ({
  message,
  theme,
  user,
}: {
  message: MessageType.DerivedFile
  theme: Theme
  user?: User
}) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      padding: theme.insets.messageInsetsVertical,
      paddingRight: theme.insets.messageInsetsHorizontal,
    },
    icon: {
      // tintColor: 'red',
      width: 30,
      height: 30,

    },
    iconContainer: {
      alignItems: 'center',
      // backgroundColor:
      //   user?.id === message.author.id
      //     ? `${String(theme.colors.sentMessageDocumentIcon)}33`
      //     : `${String(theme.colors.receivedMessageDocumentIcon)}33`,
      backgroundColor: 'white',
      borderRadius: 21,
      height: 42,
      justifyContent: 'center',
      width: 42,
    },
    name:
      user?.id === message.author.id
        ? theme.fonts.sentMessageBodyTextStyle
        : theme.fonts.receivedMessageBodyTextStyle,
    size: {
      ...(user?.id === message.author.id
        ? theme.fonts.sentMessageCaptionTextStyle
        : theme.fonts.receivedMessageCaptionTextStyle),
      marginTop: 4,
    },
    textContainer: {
      flexShrink: 1,
      marginLeft: 16,
    },
    captionText: {
      marginBottom: 10,
      color: user?.id === message.author.id ? '#fff' : undefined,
      padding: 12,
      fontFamily: 'Manrope-Regular',
    },
  })

export default styles
