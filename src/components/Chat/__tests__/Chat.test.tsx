import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import {
  fileMessage,
  imageMessage,
  textMessage,
  user,
} from '../../../../jest/fixtures'
import { l10n } from '../../../l10n'
import { MessageType } from '../../../types'
import { Chat } from '../Chat'
import { ReactTestInstance } from 'react-test-renderer'

describe('Chat', () => {
  it('renders empty state', () => {
    const { getByText } = render(
      <Chat
        messages={[]}
        user={{ id: '1' }}
        onSendPress={() => {}}
      />
    )

    expect(getByText('No messages yet')).toBeTruthy()
  })

  it('renders messages', () => {
    const messages: MessageType.Any[] = [
      {
        author: { id: '1' },
        createdAt: Date.now(),
        id: '1',
        text: 'Hello',
        type: 'text',
      },
    ]

    const { getByText } = render(
      <Chat
        messages={messages}
        user={{ id: '1' }}
        onSendPress={() => {}}
      />
    )

    expect(getByText('Hello')).toBeTruthy()
  })

  it('calls onSendPress when send button is pressed', () => {
    const onSendPress = jest.fn()
    const { getByTestId } = render(
      <Chat
        messages={[]}
        user={{ id: '1' }}
        onSendPress={onSendPress}
      />
    )

    const button = getByTestId('SendButton')
    if (button) {
      fireEvent.press(button)
    }

    expect(onSendPress).toHaveBeenCalled()
  })

  it('renders custom empty state', () => {
    const { getByText } = render(
      <Chat
        messages={[]}
        user={{ id: '1' }}
        onSendPress={() => {}}
        emptyState={<Text>Custom empty state</Text> as any}
      />
    )

    expect(getByText('Custom empty state')).toBeTruthy()
  })

  it('renders custom bottom component', () => {
    const { getByText } = render(
      <Chat
        messages={[]}
        user={{ id: '1' }}
        onSendPress={() => {}}
        customBottomComponent={<Text>Custom bottom</Text> as any}
      />
    )

    expect(getByText('Custom bottom')).toBeTruthy()
  })

  it('renders image preview', () => {
    expect.assertions(1)
    const messages = [
      textMessage,
      imageMessage,
      fileMessage,
      {
        ...textMessage,
        createdAt: 1,
        id: 'new-uuidv4',
        status: 'delivered' as const,
      },
    ]
    const onSendPress = jest.fn()
    const { getByRole, getByText } = render(
      <Chat messages={messages} onSendPress={onSendPress} user={user} />
    )
    const button = getByRole('image').parent
    fireEvent.press(button as ReactTestInstance)
    const closeButton = getByText('✕')
    expect(closeButton).toBeDefined()
  })

  it('sends a text message', () => {
    expect.assertions(1)
    const messages = [
      textMessage,
      fileMessage,
      {
        ...imageMessage,
        createdAt: 1,
      },
      {
        ...textMessage,
        createdAt: 2,
        id: 'new-uuidv4',
        status: 'sending' as const,
      },
    ]
    const onSendPress = jest.fn()
    const { getByLabelText } = render(
      <Chat
        messages={messages}
        onSendPress={onSendPress}
        textInputProps={{ defaultValue: 'text' }}
        user={user}
      />
    )
    const button = getByLabelText(l10n.en.sendButtonAccessibilityLabel)
    fireEvent.press(button)
    expect(onSendPress).toHaveBeenCalledWith({ text: 'text', type: 'text' })
  })

  it('opens file on a file message tap', () => {
    expect.assertions(1)
    const messages = [fileMessage, textMessage, imageMessage]
    const onSendPress = jest.fn()
    const onFilePress = jest.fn()
    const onMessagePress = (message: MessageType.Any) => {
      if (message.type === 'file') {
        onFilePress(message)
      }
    }
    const { getByLabelText } = render(
      <Chat
        onMessagePress={onMessagePress}
        messages={messages}
        onSendPress={onSendPress}
        showUserAvatars
        user={user}
      />
    )

    const button = getByLabelText(l10n.en.fileButtonAccessibilityLabel)
    fireEvent.press(button)
    expect(onFilePress).toHaveBeenCalledWith(fileMessage)
  })

  it('opens image on image message press', () => {
    expect.assertions(1)
    const messages = [imageMessage]
    const onSendPress = jest.fn()
    const onImagePress = jest.fn()
    const onMessagePress = (message: MessageType.Any) => {
      if (message.type === 'image') {
        onImagePress(message)
      }
    }

    const onMessageLongPress = jest.fn()

    const { getByTestId } = render(
      <Chat
        onMessagePress={onMessagePress}
        onMessageLongPress={onMessageLongPress}
        messages={messages}
        onSendPress={onSendPress}
        showUserAvatars
        user={user}
      />
    )

    const button = getByTestId('ContentContainer')
    fireEvent.press(button)
    expect(onImagePress).toHaveBeenCalledWith(imageMessage)
  })

  it('fires image on image message long press', () => {
    expect.assertions(1)
    const messages = [imageMessage]
    const onSendPress = jest.fn()
    const onImagePress = jest.fn()
    const onMessagePress = (message: MessageType.Any) => {
      if (message.type === 'image') {
        onImagePress(message)
      }
    }

    const onMessageLongPress = jest.fn()

    const { getByTestId } = render(
      <Chat
        onMessagePress={onMessagePress}
        onMessageLongPress={onMessageLongPress}
        messages={messages}
        onSendPress={onSendPress}
        showUserAvatars
        user={user}
      />
    )

    const button = getByTestId('ContentContainer')
    fireEvent(button, 'onLongPress')
    expect(onMessageLongPress).toHaveBeenCalledWith(imageMessage)
  })

  it('renders empty chat placeholder', () => {
    expect.assertions(1)
    const messages: any[] = []
    const onSendPress = jest.fn()
    const onMessagePress = jest.fn()
    const { getByText } = render(
      <Chat
        messages={messages}
        onMessagePress={onMessagePress}
        onSendPress={onSendPress}
        user={user}
      />
    )

    const placeholder = getByText(l10n.en.emptyChatPlaceholder)
    expect(placeholder).toBeDefined()
  })
})
