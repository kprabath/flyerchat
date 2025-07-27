import * as React from 'react'
import { Pressable, Text, View } from 'react-native'

import { oneOf } from '@flyerhq/react-native-link-preview'

import { MessageType } from '../../types'

import {
  ThemeContext,
  UserContext,
  excludeDerivedMessageProps,
} from '../../utils'
import { Avatar } from '../Avatar'
import { DeeplinkMessage } from '../Deeplink/DeeplinkMessage'
import { FileMessage } from '../FileMessage'
import { ImageMessage } from '../ImageMessage'
import { SoundMessage } from '../SoundMessage/SoundMessage'
import { StatusIcon } from '../StatusIcon'
import { TextMessage, TextMessageTopLevelProps } from '../TextMessage'
import { VideoMessage } from '../VideoMessage/VideoMessage'
import styles from './styles'

export interface MessageTopLevelProps extends TextMessageTopLevelProps {
  /** Called when user makes a long press on any message */
  onMessageLongPress?: (message: MessageType.Any) => void
  /** Called when user taps on any message */
  onMessagePress?: (message: MessageType.Any) => void
  /** Called when user taps on a video message */
  onVideoPress?: (message: MessageType.Video) => void
  /** Called when user taps on a sound message */
  onSoundPress?: (message: MessageType.Audio) => void
  /** Called when user taps on a deeplink message */
  onDeeplinkPress?: (message: MessageType.Deeplink) => void
  /** Customize the default bubble using this function. `child` is a content
   * you should render inside your bubble, `message` is a current message
   * (contains `author` inside) and `nextMessageInGroup` allows you to see
   * if the message is a part of a group (messages are grouped when written
   * in quick succession by the same author) */
  renderBubble?: (payload: {
    child: React.ReactNode
    message: MessageType.Any
    nextMessageInGroup: boolean
  }) => React.ReactNode
  /** Render a custom message inside predefined bubble */
  renderCustomMessage?: (
    message: MessageType.Custom,
    messageWidth: number
  ) => React.ReactNode
  /** Render a file message inside predefined bubble */
  renderFileMessage?: (
    message: MessageType.File,
    messageWidth: number
  ) => React.ReactNode
  /** Render an image message inside predefined bubble */
  renderImageMessage?: (
    message: MessageType.Image,
    messageWidth: number
  ) => React.ReactNode
  /** Render a video message inside predefined bubble */
  renderVideoMessage?: (
    message: MessageType.Video,
    messageWidth: number
  ) => React.ReactNode
  /** Render an audio message inside predefined bubble */
  renderSoundMessage?: (
    message: MessageType.Audio,
    messageWidth: number
  ) => React.ReactNode
  /** Render a text message inside predefined bubble */
  renderTextMessage?: (
    message: MessageType.Text,
    messageWidth: number,
    showName: boolean
  ) => React.ReactNode
  /** Render a deeplink message inside predefined bubble */
  renderDeeplinkMessage?: (
    message: MessageType.Deeplink,
    messageWidth: number
  ) => React.ReactNode
  /** Show user avatars for received messages. Useful for a group chat. */
  showUserAvatars?: boolean
}

export interface MessageProps extends MessageTopLevelProps {
  enableAnimation?: boolean
  message: MessageType.DerivedAny
  messageWidth: number
  roundBorder: boolean
  showAvatar: boolean
  showName: boolean
  showStatus: boolean
}

/** Base component for all message types in the chat. Renders bubbles around
 * messages and status. Sets maximum width for a message for
 * a nice look on larger screens. */
export const Message = React.memo(
  ({
    enableAnimation,
    message,
    messageWidth,
    onMessagePress,
    onMessageLongPress,
    onVideoPress,
    onSoundPress,
    onDeeplinkPress,
    onPreviewDataFetched,
    renderBubble,
    renderCustomMessage,
    renderFileMessage,
    renderImageMessage,
    renderVideoMessage,
    renderSoundMessage,
    renderTextMessage,
    renderDeeplinkMessage,
    roundBorder,
    showAvatar,
    showName,
    showStatus,
    showUserAvatars,
    usePreviewData,
  }: MessageProps) => {
    const theme = React.useContext(ThemeContext)
    const user = React.useContext(UserContext)

    const currentUserIsAuthor =
      message.type !== 'dateHeader' && user?.id === message.author.id

    const { container, contentContainer, dateHeader, pressable } = styles({
      currentUserIsAuthor,
      message,
      messageWidth,
      roundBorder,
      theme,
    })

    // Will be added back in the future
    if (message.type === 'dateHeader') {
      return null
      // return (
      //   <View style={dateHeader}>
      //     <Text style={theme.fonts.dateDividerTextStyle}>{message.text}</Text>
      //   </View>
      // )
    }

    const renderBubbleContainer = () => {
      const child = renderMessage()
      return oneOf(
        renderBubble,
        <View style={contentContainer} testID='ContentContainer'>
          {child}
        </View>
      )({
        child,
        message: excludeDerivedMessageProps(message),
        nextMessageInGroup: roundBorder,
      })
    }

    const renderMessage = () => {
      switch (message.type) {
        case 'custom':
          return (
            renderCustomMessage?.(
              excludeDerivedMessageProps(message) as MessageType.Custom,
              messageWidth
            ) ?? null
          )
        case 'file':
          return oneOf(renderFileMessage, <FileMessage message={message} />)(
            excludeDerivedMessageProps(message) as MessageType.File,
            messageWidth
          )
        case 'image':
          return oneOf(
            renderImageMessage,
            <ImageMessage
              {...{
                message,
                messageWidth,
              }}
            />
          )(
            excludeDerivedMessageProps(message) as MessageType.Image,
            messageWidth
          )
        case 'video':
          return oneOf(
            renderVideoMessage,
            <VideoMessage
              {...{
                message,
                messageWidth,
                onVideoPress,
              }}
            />
          )(
            excludeDerivedMessageProps(message) as MessageType.Video,
            messageWidth
          )
        case 'audio':
          return oneOf(
            renderSoundMessage,
            <SoundMessage
              {...{
                message,
                messageWidth,
                onSoundPress,
              }}
            />
          )(
            excludeDerivedMessageProps(message) as MessageType.Audio,
            messageWidth
          )
        case 'text':
          return oneOf(
            renderTextMessage,
            <TextMessage
              {...{
                enableAnimation,
                message,
                messageWidth,
                onPreviewDataFetched,
                showName,
                usePreviewData,
              }}
            />
          )(
            excludeDerivedMessageProps(message) as MessageType.Text,
            messageWidth,
            showName
          )
        case 'deeplink':
          return oneOf(
            renderDeeplinkMessage,
            <DeeplinkMessage
              message={
                excludeDerivedMessageProps(message) as MessageType.Deeplink
              }
              onDeeplinkPress={onDeeplinkPress}
            />
          )(
            excludeDerivedMessageProps(message) as MessageType.Deeplink,
            messageWidth
          )
        default:
          return null
      }
    }

    return (
      <View style={container}>
        <Avatar
          {...{
            author: message.author,
            currentUserIsAuthor,
            showAvatar,
            showUserAvatars,
            theme,
          }}
        />
        <Pressable
          onLongPress={() =>
            onMessageLongPress?.(excludeDerivedMessageProps(message))
          }
          onPress={() => onMessagePress?.(excludeDerivedMessageProps(message))}
          style={pressable}
        >
          {renderBubbleContainer()}
        </Pressable>
        <StatusIcon
          {...{
            currentUserIsAuthor,
            showStatus,
            status: message.status,
            theme,
          }}
        />
      </View>
    )
  }
)
