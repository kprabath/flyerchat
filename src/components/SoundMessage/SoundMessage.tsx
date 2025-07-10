import { MessageType } from '../../types'
import { ThemeContext, UserContext, useTwilio } from '../../utils'
import { PlayButton } from '../PlayButton/PlayButton'
import styles from './styles'
import * as React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

export interface SoundMessageProps {
  message: MessageType.DerivedAudio
  messageWidth: number
  onSoundPress?: (message: MessageType.Audio) => void
  isPlaying?: boolean
}

export const SoundMessage = React.memo(
  ({
    message,
    messageWidth,
    onSoundPress,
    isPlaying = false,
  }: SoundMessageProps) => {
    const theme = React.useContext(ThemeContext)
    const duration = message?.metadata?.duration || 0
    const user = React.useContext(UserContext)

    const {
      container,
      controls,
      duration: durationStyle,
      captionText,
    } = styles({
      message,
      messageWidth,
      theme,
      user
    })

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
      <View style={container}>
        {message?.text ? (
          <Text style={captionText}>{message?.text}</Text>
        ) : null}
        <TouchableOpacity
          onPress={() => onSoundPress?.(message)}
          style={controls}
        >
          <PlayButton size={32} />
          <View style={durationStyle}>
            <Text style={{ color: message.author.id === user.id ? theme.colors.inputText : undefined }}>
              {formatDuration(duration)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
)
