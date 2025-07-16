import { MessageType, Theme, User } from '../../types'
import { StyleSheet } from 'react-native'

const styles = ({
  aspectRatio,
  message,
  messageWidth,
  theme,
  user,
}: {
  aspectRatio: number
  message: MessageType.Image
  messageWidth: number
  theme: Theme
  user?: User
}) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      padding: theme.insets.messageInsetsVertical,
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
      marginRight: 10,
    },

    name:
      user?.id === message.author.id
        ? theme.fonts.sentMessageBodyTextStyle
        : theme.fonts.receivedMessageBodyTextStyle,
    horizontalImage: {
      height: messageWidth / aspectRatio,
      width: messageWidth,
      borderRadius: 12,
    },
    minimizedImage: {
      borderRadius: 15,
      height: 64,
      marginLeft: theme.insets.messageInsetsVertical,
      marginRight: 16,
      marginVertical: theme.insets.messageInsetsVertical,
      width: 64,
    },
    minimizedImageContainer: {
      alignItems: 'center',
      backgroundColor:
        user?.id === message.author.id
          ? theme.colors.primary
          : theme.colors.secondary,
      flexDirection: 'row',
    },
    nameText:
      user?.id === message.author.id
        ? theme.fonts.sentMessageBodyTextStyle
        : theme.fonts.receivedMessageBodyTextStyle,
    sizeText: {
      ...(user?.id === message.author.id
        ? theme.fonts.sentMessageCaptionTextStyle
        : theme.fonts.receivedMessageCaptionTextStyle),
      marginTop: 4,
    },
    textContainer: {
      flexShrink: 1,
      marginRight: theme.insets.messageInsetsHorizontal,
      marginVertical: theme.insets.messageInsetsVertical,
    },
    verticalImage: {
      height: messageWidth,
      width: messageWidth,
      borderRadius: 12,
    },
    captionText: {
      marginBottom: 10,
      padding: 12,
      color: user?.id === message.author.id ? '#fff' : undefined,
      fontFamily: 'Manrope-Regular',
    },
  })

export default styles
