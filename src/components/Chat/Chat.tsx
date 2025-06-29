import { usePrevious } from '../../hooks'
import { l10n } from '../../l10n'
import { defaultTheme } from '../../theme'
import { MessageType, Theme, User } from '../../types'
import {
  calculateChatMessages,
  initLocale,
  L10nContext,
  ThemeContext,
  TwilioContext,
  TwilioContextType,
  unwrap,
  UserContext,
  useTwilio,
} from '../../utils'
import { CircularActivityIndicator } from '../CircularActivityIndicator'
import { Input, InputAdditionalProps, InputTopLevelProps } from '../Input'
import { Message, MessageTopLevelProps } from '../Message'
import PDFView from '../PDFView/PDFView'
import TypingAnimation from '../TypingAnimation/TypingAnimation'
import ImageView from './ImageView'
import ImageViewHeader from './ImageView.header'
import styles from './styles'
import {
  KeyboardAccessoryView,
  useComponentSize,
} from '@flyerhq/react-native-keyboard-accessory-view'
import { oneOf } from '@flyerhq/react-native-link-preview'
import { FlashList } from '@shopify/flash-list'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import * as React from 'react'
import {
  FlatList,
  FlatListProps,
  GestureResponderHandlers,
  InteractionManager,
  LayoutAnimation,
  StatusBar,
  StatusBarProps,
  Text,
  View,
  Modal,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Untestable
/* istanbul ignore next */
const animate = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
}

// eslint-disable-next-line jest/require-hook
dayjs.extend(calendar)

export type ChatTopLevelProps = InputTopLevelProps & MessageTopLevelProps

export interface ChatProps extends ChatTopLevelProps {
  /** Called when user taps on a video message */
  onVideoPress?: (message: MessageType.Video) => void
  /** Called when user taps on a sound message */
  onSoundPress?: (message: MessageType.Audio) => void
  /** Called when user taps on a deeplink message */
  onDeeplinkPress?: (message: MessageType.Deeplink) => void
  /** Twilio context value to provide Twilio functionality throughout the chat */
  twilioContextValue?: TwilioContextType
  /** Allows you to replace the default Input widget e.g. if you want to create a channel view. */
  customBottomComponent?: () => React.ReactNode
  /** If {@link ChatProps.dateFormat} and/or {@link ChatProps.timeFormat} is not enough to
   * customize date headers in your case, use this to return an arbitrary
   * string based on a `dateTime` of a particular message. Can be helpful to
   * return "Today" if `dateTime` is today. IMPORTANT: this will replace
   * all default date headers, so you must handle all cases yourself, like
   * for example today, yesterday and before. Or you can just return the same
   * date header for any message. */
  customDateHeaderText?: (dateTime: number) => string
  /** Allows you to customize the date format. IMPORTANT: only for the date,
   * do not return time here. @see {@link ChatProps.timeFormat} to customize the time format.
   * @see {@link ChatProps.customDateHeaderText} for more customization. */
  dateFormat?: string
  /** Disable automatic image preview on tap. */
  disableImageGallery?: boolean
  /** Allows you to change what the user sees when there are no messages.
   * `emptyChatPlaceholder` and `emptyChatPlaceholderTextStyle` are ignored
   * in this case. */
  emptyState?: () => React.ReactNode
  /** Use this to enable `LayoutAnimation`. Experimental on Android (same as React Native). */
  enableAnimation?: boolean
  flatListProps?: Partial<FlatListProps<MessageType.DerivedAny[]>>
  inputProps?: InputAdditionalProps
  /** Used for pagination (infinite scroll) together with {@link ChatProps.onEndReached}.
   * When true, indicates that there are no more pages to load and
   * pagination will not be triggered. */
  isLastPage?: boolean
  /** Indicates if someone is currently typing in the chat */
  isTyping?: boolean
  /** Override the default localized copy. */
  l10nOverride?: Partial<Record<keyof (typeof l10n)[keyof typeof l10n], string>>
  locale?: keyof typeof l10n
  messages: MessageType.Any[]
  /** Used for pagination (infinite scroll). Called when user scrolls
   * to the very end of the list (minus `onEndReachedThreshold`).
   * See {@link ChatProps.flatListProps} to set it up. */
  onEndReached?: () => Promise<void>
  /** Show user names for received messages. Useful for a group chat. Will be
   * shown only on text messages. */
  showUserNames?: boolean
  /** Chat theme. Implement {@link Theme} to create your own theme or use
   * existing one, like the {@link defaultTheme}. */
  theme?: Theme
  /**
   * Allows you to customize the time format. IMPORTANT: only for the time,
   * do not return date here. @see {@link ChatProps.dateFormat} to customize the date format.
   * @see {@link ChatProps.customDateHeaderText} for more customization.
   */
  timeFormat?: string
  user: User
  onDownloadPress?: (
    message:
      | MessageType.Audio
      | MessageType.Video
      | MessageType.Image
      | MessageType.File
      | MessageType.Any
  ) => void
  /** Custom React component to render after the SendButton */
  inputRightViewComponent?: () => React.ReactNode
  pdfRightIcon?: ({ message }: { message: MessageType.File }) => React.ReactNode
  fullImageViewMiddleComponent?: React.ReactNode
}

/** Entry component, represents the complete chat */
export const Chat = ({
  customBottomComponent,
  customDateHeaderText,
  dateFormat,
  disableImageGallery,
  emptyState,
  enableAnimation,
  flatListProps,
  inputProps,
  isAttachmentUploading,
  isLastPage,
  isTyping,
  l10nOverride,
  locale = 'en',
  messages,
  onAttachmentPress,
  onEndReached,
  onMessageLongPress,
  onMessagePress,
  onVideoPress,
  onSoundPress,
  onDeeplinkPress,
  onPreviewDataFetched,
  onSendPress,
  renderBubble,
  renderCustomMessage,
  renderFileMessage,
  renderImageMessage,
  renderTextMessage,
  onDownloadPress,
  sendButtonVisibilityMode = 'editing',
  showUserAvatars = false,
  showUserNames = false,
  textInputProps,
  theme = defaultTheme,
  timeFormat,
  twilioContextValue,
  usePreviewData = true,
  user,
  inputRightViewComponent,
  pdfRightIcon,
  fullImageViewMiddleComponent,
}: ChatProps) => {
  const {
    container,
    emptyComponentContainer,
    emptyComponentTitle,
    flatList,
    flatListContentContainer,
    footer,
    footerLoadingPage,
    header,
    typingAnimation,
    safeAreaFooter,
    // keyboardAccessoryView,
  } = styles({ theme })

  const { onLayout, size } = useComponentSize()
  const animationRef = React.useRef(false)
  const list = React.useRef<FlashList<MessageType.DerivedAny>>(null)
  const insets = useSafeAreaInsets()
  const [isImageViewVisible, setIsImageViewVisible] = React.useState(false)
  const [isNextPageLoading, setNextPageLoading] = React.useState(false)
  const [imageViewIndex, setImageViewIndex] = React.useState(0)
  const [stackEntry, setStackEntry] = React.useState<StatusBarProps>({})
  const [showPDFViewer, setShowPDFViewer] = React.useState(false)
  const [selectedPDFMessage, setSelectedPDFMessage] =
    React.useState<MessageType.File | null>(null)

  const l10nValue = React.useMemo(
    () => ({ ...l10n[locale], ...unwrap(l10nOverride) }),
    [l10nOverride, locale]
  )

  const { chatMessages, gallery } = calculateChatMessages(messages, user, {
    customDateHeaderText,
    dateFormat,
    showUserNames,
    timeFormat,
  })

  const previousChatMessages = usePrevious(chatMessages)

  React.useEffect(() => {
    if (
      chatMessages[0]?.type !== 'dateHeader' &&
      chatMessages[0]?.id !== previousChatMessages?.[0]?.id &&
      chatMessages[0]?.author?.id === user.id
    ) {
      list.current?.scrollToOffset({
        animated: true,
        offset: 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages])

  React.useEffect(() => {
    initLocale(locale)
  }, [locale])

  // Untestable
  /* istanbul ignore next */
  if (animationRef.current && enableAnimation) {
    InteractionManager.runAfterInteractions(animate)
  }

  React.useEffect(() => {
    // Untestable
    /* istanbul ignore next */
    if (animationRef.current && enableAnimation) {
      InteractionManager.runAfterInteractions(animate)
    } else {
      animationRef.current = true
    }
  }, [enableAnimation, messages])

  const handleEndReached = React.useCallback(
    // Ignoring because `scroll` event for some reason doesn't trigger even basic
    // `onEndReached`, impossible to test.
    // TODO: Verify again later
    /* istanbul ignore next */
    async () => {
      setNextPageLoading(true)
      await onEndReached?.()
      setNextPageLoading(false)
    },
    [isLastPage, isNextPageLoading, messages.length, onEndReached]
  )

  const handleImagePress = React.useCallback(
    async (message: MessageType.Image) => {
      if (twilioContextValue?.getMediaurl) {
        await twilioContextValue?.getMediaurl?.(message).then((url) => {
          message.uri = url
        })

      }

      setImageViewIndex(
        gallery.findIndex(
          (image) => image.id === message.id && image.uri === message.uri
        )
      )
      setIsImageViewVisible(true)
      setStackEntry(
        StatusBar.pushStackEntry({
          barStyle: 'light-content',
          animated: true,
        })
      )
    },
    [gallery , twilioContextValue]
  )

  const handlePDFPress = React.useCallback((message: MessageType.File) => {
    if (twilioContextValue?.getMediaurl) {
      twilioContextValue?.getMediaurl(message).then((url) => {
        message.uri = url
        setSelectedPDFMessage(message)
        setShowPDFViewer(true)
      })
      return
    }
    setSelectedPDFMessage(message)
    setShowPDFViewer(true)
  }, [])

  const handleMessagePress = React.useCallback(
    (message: MessageType.Any) => {
      if (message.type === 'image' && !disableImageGallery) {
        handleImagePress(message)
      } else if (message.type === 'file' && message.mimeType?.includes('pdf')) {
        console.log('message is', message.uri)
        handlePDFPress(message as MessageType.File)
      } else {
        onMessagePress?.(message)
      }
    },
    [disableImageGallery, handleImagePress, handlePDFPress, onMessagePress]
  )

  // TODO: Tapping on a close button results in the next warning:
  // `An update to ImageViewing inside a test was not wrapped in act(...).`
  /* istanbul ignore next */
  const handleRequestClose = () => {
    setIsImageViewVisible(false)
    StatusBar.popStackEntry(stackEntry)
  }

  const keyExtractor = React.useCallback(
    ({ id }: MessageType.DerivedAny) => id,
    []
  )

  const onDownloadPressLocal = React.useCallback(() => {
    const selectedMessage = messages.find(
      (e) => e.id === gallery?.[imageViewIndex]?.id
    )
    if (selectedMessage) {
      onDownloadPress?.(selectedMessage as MessageType.Any)
    }
  }, [onDownloadPress])

  const renderItem = React.useCallback(
    ({ item: message }: { item: MessageType.DerivedAny; index: number }) => {
      const messageWidth =
        showUserAvatars &&
        message.type !== 'dateHeader' &&
        message.author.id !== user.id
          ? Math.floor(Math.min(size.width * 0.72, 440))
          : Math.floor(Math.min(size.width * 0.77, 440))

      const roundBorder =
        message.type !== 'dateHeader' && message.nextMessageInGroup
      const showAvatar =
        message.type !== 'dateHeader' && !message.nextMessageInGroup
      const showName = message.type !== 'dateHeader' && message.showName
      const showStatus = message.type !== 'dateHeader' && message.showStatus

      return (
        <Message
          {...{
            enableAnimation,
            message,
            messageWidth,
            onMessageLongPress,
            onMessagePress: handleMessagePress,
            onPreviewDataFetched,
            renderBubble,
            renderCustomMessage,
            renderFileMessage,
            renderImageMessage,
            renderTextMessage,
            roundBorder,
            showAvatar,
            showName,
            showStatus,
            showUserAvatars,
            usePreviewData,
            onVideoPress,
            onSoundPress,
            onDeeplinkPress,
          }}
        />
      )
    },
    [
      enableAnimation,
      handleMessagePress,
      onMessageLongPress,
      onPreviewDataFetched,
      renderBubble,
      renderCustomMessage,
      renderFileMessage,
      renderImageMessage,
      renderTextMessage,
      showUserAvatars,
      size.width,
      usePreviewData,
      user.id,
      onVideoPress,
      onSoundPress,
      onDeeplinkPress,
    ]
  )

  const renderListEmptyComponent = React.useCallback(
    () => (
      <View style={emptyComponentContainer}>
        {oneOf(
          emptyState,
          <Text style={emptyComponentTitle}>
            {l10nValue.emptyChatPlaceholder}
          </Text>
        )()}
      </View>
    ),
    [emptyComponentContainer, emptyComponentTitle, emptyState, l10nValue]
  )

  const renderListFooterComponent = React.useCallback(
    () =>
      // Impossible to test, see `handleEndReached` function
      /* istanbul ignore next */
      isNextPageLoading ? (
        <View style={footerLoadingPage}>
          <CircularActivityIndicator color={theme.colors.primary} size={16} />
        </View>
      ) : (
        <View style={footer} />
      ),
    [footer, footerLoadingPage, isNextPageLoading, theme.colors.primary]
  )

  const renderScrollable = React.useCallback(
    (panHandlers: GestureResponderHandlers) => (
      <FlashList
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={{
          ...flatListContentContainer,
          // eslint-disable-next-line react-native/no-inline-styles
          ...{
            justifyContent: chatMessages.length !== 0 ? undefined : 'center',
            paddingTop: insets.bottom,
          },
        }}
        initialNumToRender={10}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={<View />}
        ListHeaderComponentStyle={header}
        maxToRenderPerBatch={6}
        windowSize={8}
        onEndReachedThreshold={0.75}
        style={flatList}
        showsVerticalScrollIndicator={false}
        {...unwrap(flatListProps)}
        data={chatMessages}
        inverted
        keyboardDismissMode='interactive'
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        estimatedItemSize={100}
        ref={list}
        renderItem={renderItem}
        {...panHandlers}
      />
    ),
    [
      chatMessages,
      flatList,
      flatListContentContainer,
      flatListProps,
      handleEndReached,
      header,
      insets.bottom,
      keyExtractor,
      renderItem,
      renderListEmptyComponent,
      renderListFooterComponent,
    ]
  )

  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <L10nContext.Provider value={l10nValue}>
          <TwilioContext.Provider value={twilioContextValue}>
            <View style={container} onLayout={onLayout}>
              {customBottomComponent ? (
                <>
                  <>{renderScrollable({})}</>
                  <>{customBottomComponent()}</>
                </>
              ) : (
                <KeyboardAccessoryView
                  {...{
                    renderScrollable,
                    // style: keyboardAccessoryView,
                  }}
                >
                  <View>
                    {isTyping ? (
                      <TypingAnimation
                        style={typingAnimation}
                        dotRadius={5}
                        dotMargin={10}
                        dotY={0}
                      />
                    ) : null}
                  </View>
                  <Input
                    {...{
                      ...unwrap(inputProps),
                      isAttachmentUploading,
                      onAttachmentPress,
                      onSendPress,
                      renderScrollable,
                      sendButtonVisibilityMode,
                      textInputProps,
                      inputRightViewComponent,
                    }}
                  />
                </KeyboardAccessoryView>
              )}
              <ImageView
                imageIndex={imageViewIndex}
                images={gallery}
                onRequestClose={handleRequestClose}
                visible={isImageViewVisible}
                middleComponent={fullImageViewMiddleComponent}
                HeaderComponent={() => (
                  <ImageViewHeader
                    showDownloadButton={!gallery?.[imageViewIndex]?.isLocal}
                    onDownloadPress={onDownloadPressLocal}
                    onClosePress={handleRequestClose}
                  />
                )}
              />
              {showPDFViewer && selectedPDFMessage && (
                <Modal
                  visible={showPDFViewer}
                  animationType='slide'
                  presentationStyle='fullScreen'
                >
                  <PDFView
                    message={selectedPDFMessage}
                    rightIcon={pdfRightIcon}
                    onClose={() => {
                      setShowPDFViewer(false)
                      setSelectedPDFMessage(null)
                    }}
                  />
                </Modal>
              )}
              <View style={safeAreaFooter} />
            </View>
          </TwilioContext.Provider>
        </L10nContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}
