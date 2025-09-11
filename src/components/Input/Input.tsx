import * as React from 'react'
import {
  Animated,
  Keyboard,
  Platform,
  TextInput,
  TextInputProps,
  View,
} from 'react-native'

import { MessageType } from '../../types'

import { L10nContext, ThemeContext, UserContext, unwrap } from '../../utils'
import {
  AttachmentButton,
  AttachmentButtonAdditionalProps,
  AttachmentButtonProps,
} from '../AttachmentButton'
import {
  CircularActivityIndicator,
  CircularActivityIndicatorProps,
} from '../CircularActivityIndicator'
import { SendButton } from '../SendButton'
import styles from './styles'

export interface InputTopLevelProps {
  /** Whether attachment is uploading. Will replace attachment button with a
   * {@link CircularActivityIndicator}. Since we don't have libraries for
   * managing media in dependencies we have no way of knowing if
   * something is uploading so you need to set this manually. */
  isAttachmentUploading?: boolean
  /** @see {@link AttachmentButtonProps.onPress} */
  onAttachmentPress?: () => void
  /** Will be called on {@link SendButton} tap. Has {@link MessageType.PartialText} which can
   * be transformed to {@link MessageType.Text} and added to the messages list. */
  onSendPress: (message: MessageType.PartialText) => void
  /** Controls the visibility behavior of the {@link SendButton} based on the
   * `TextInput` state. Defaults to `editing`. */
  sendButtonVisibilityMode?: 'always' | 'editing'
  textInputProps?: TextInputProps
  /** Custom React component to render after the SendButton */
  inputRightViewComponent?: () => React.ReactNode
  renderSendButton?: (props: {
    isEditing?: boolean
    handleSend?: (message: MessageType.PartialText) => void
  }) => React.ReactNode
}

export interface InputAdditionalProps {
  attachmentButtonProps?: AttachmentButtonAdditionalProps
  attachmentCircularActivityIndicatorProps?: CircularActivityIndicatorProps
}

export type InputProps = InputTopLevelProps & InputAdditionalProps

/** Bottom bar input component with a text input, attachment and
 * send buttons inside. By default hides send button when text input is empty. */
export const Input = ({
  attachmentButtonProps,
  attachmentCircularActivityIndicatorProps,
  isAttachmentUploading,
  onAttachmentPress,
  onSendPress,
  sendButtonVisibilityMode,
  textInputProps,
  inputRightViewComponent,
  renderSendButton,
}: InputProps) => {
  const l10n = React.useContext(L10nContext)
  const theme = React.useContext(ThemeContext)
  const user = React.useContext(UserContext)
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false)
  const {
    container,
    input,
    marginRight,
    subcontainer,
    inputText,
    inputTextOverlay,
    inputTextContainer,
  } = styles({
    theme,
    isKeyboardVisible,
  })

  // Use `defaultValue` if provided
  const [text, setText] = React.useState(textInputProps?.defaultValue ?? '')
  const [inputHeight, setInputHeight] = React.useState(40)
  const bottomSectionOpacity = React.useRef(new Animated.Value(1)).current
  const bottomSectionHeight = React.useRef(new Animated.Value(50)).current

  const value = textInputProps?.value ?? text

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // Reset to minimum height when keyboard shows
        if (Platform.OS === 'android') {
          setInputHeight(40)
        }

        // Delay state change to avoid jumping
        setTimeout(() => {
          setIsKeyboardVisible(true)
        }, 50)

        // Animate bottom section to hidden with sequential timing
        Animated.sequence([
          Animated.timing(bottomSectionOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(bottomSectionHeight, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start()
      }
    )

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Reset input height when keyboard hides
        setInputHeight(40)

        // Delay state change to avoid jumping
        setTimeout(() => {
          setIsKeyboardVisible(false)
        }, 50)

        // Animate bottom section to visible with sequential timing
        Animated.sequence([
          Animated.timing(bottomSectionHeight, {
            toValue: 50,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(bottomSectionOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start()
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const handleChangeText = (newText: string) => {
    // Track local state in case `onChangeText` is provided and `value` is not
    setText(newText)
    textInputProps?.onChangeText?.(newText)
  }

  const handleContentSizeChange = (event: any) => {
    if (Platform.OS === 'android') {
      const { height } = event.nativeEvent.contentSize
      const newHeight = Math.max(40, Math.min(100, height + 20)) // +20 for padding
      setInputHeight(newHeight)
    }
  }

  const handleSend = () => {
    const trimmedValue = value.trim()

    // Impossible to test since button is not visible when value is empty.
    // Additional check for the keyboard input.
    /* istanbul ignore next */
    if (trimmedValue) {
      onSendPress({ text: trimmedValue, type: 'text' })
      setText('')
    }
  }

  return (
    <View
      style={[
        container,
        {
          backgroundColor: theme.colors.inputBackground,
          borderRadius: theme.borders.inputBorderRadius,
        },
      ]}
    >
      <View style={inputTextContainer}>
        <View style={{ flex: 1 }}>
          <TextInput
            multiline
            numberOfLines={5}
            placeholder={l10n.inputPlaceholder}
            placeholderTextColor={`${String(theme.colors.inputText)}80`}
            underlineColorAndroid='transparent'
            textAlignVertical={Platform.OS === 'android' ? 'top' : 'auto'}
            scrollEnabled={Platform.OS === 'android' ? isKeyboardVisible : true}
            onContentSizeChange={handleContentSizeChange}
            {...textInputProps}
            // Keep our implementation but allow user to use these `TextInputProps`
            style={[
              input,
              textInputProps?.style,
              {
                color: isKeyboardVisible ? theme.colors.black : 'transparent',
                ...(Platform.OS === 'android'
                  ? {
                      height: inputHeight,
                      textAlignVertical: 'top',
                    }
                  : {}),
              },
            ]}
            onChangeText={handleChangeText}
            value={value}
          />
        </View>

        {renderSendButton ? (
          renderSendButton?.({
            isEditing: value.trim()?.length > 0,
            handleSend,
          })
        ) : sendButtonVisibilityMode === 'always' ||
          (sendButtonVisibilityMode === 'editing' && user && value.trim()) ? (
          <SendButton onPress={handleSend} />
        ) : null}
      </View>

      <Animated.View
        style={[
          subcontainer,
          {
            height: bottomSectionHeight,
            opacity: bottomSectionOpacity,
            overflow: 'hidden',
          },
        ]}
      >
        {user &&
          (isAttachmentUploading ? (
            <CircularActivityIndicator
              {...{
                ...attachmentCircularActivityIndicatorProps,
                color: theme.colors.inputText,
                style: marginRight,
              }}
            />
          ) : (
            !!onAttachmentPress && (
              <AttachmentButton
                {...unwrap(attachmentButtonProps)}
                onPress={onAttachmentPress}
              />
            )
          ))}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {inputRightViewComponent?.()}
        </View>
      </Animated.View>
    </View>
  )
}
