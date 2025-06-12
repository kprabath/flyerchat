import * as React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import SoundPlayer from 'react-native-sound-player'

import { MessageType } from '../../types'
import { ThemeContext } from '../../utils'
import { PlayButton } from '../PlayButton/PlayButton'
import styles from './styles'

export interface SoundMessageProps {
  message: MessageType.DerivedAudio
  messageWidth: number
  onSoundPress?: (message: MessageType.Audio) => void
  isPlaying?: boolean
}

export const SoundMessage = React.memo(
  ({ message, messageWidth, onSoundPress, isPlaying = false }: SoundMessageProps) => {
    const theme = React.useContext(ThemeContext)
    const [duration, setDuration] = React.useState<number>(message.duration || 0)
    const { container, controls, duration: durationStyle } = styles({
      message,
      messageWidth,
      theme,
    })

    // React.useEffect(() => {
    //   const getDuration = async () => {
    //     try {
    //       // Load the sound file
    //       await SoundPlayer.loadUrl(message.uri)
    //       // Get the duration
    //       const info = await SoundPlayer.getInfo()
    //       setDuration(info.duration)
    //       // Stop and reset the player
    //       SoundPlayer.stop()
    //     } catch (error) {
    //       console.error('Failed to get sound duration:', error)
    //     }
    //   }

    //   if (!message.duration) {
    //     getDuration()
    //   }
    // }, [message.uri, message.duration])

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
      <View style={container}>
        <TouchableOpacity 
          onPress={() => onSoundPress?.(message)} 
          style={controls}
        >
          <PlayButton size={32} />
          <View style={durationStyle}>
            <Text style={{ color: theme.colors.inputText }}>
              {formatDuration(duration)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
) 