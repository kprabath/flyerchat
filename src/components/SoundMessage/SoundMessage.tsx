import * as React from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import Sound from 'react-native-sound'

import { MessageType } from '../../types'
import { ThemeContext } from '../../utils'
import styles from './styles'

// Enable playback in silence mode
Sound.setCategory('Playback')

export interface SoundMessageProps {
  message: MessageType.DerivedAudio
  messageWidth: number
}

export const SoundMessage = React.memo(
  ({ message, messageWidth }: SoundMessageProps) => {
    const theme = React.useContext(ThemeContext)
    const [sound, setSound] = React.useState<Sound | null>(null)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [duration, setDuration] = React.useState(0)
    const { container, controls, duration: durationStyle, icon } = styles({
      message,
      messageWidth,
      theme,
    })

    React.useEffect(() => {
      // Initialize sound
      const newSound = new Sound(message.uri, '', (error) => {
        if (error) {
          console.error('Failed to load sound', error)
          return
        }
        setDuration(newSound.getDuration())
      })

      setSound(newSound)

      return () => {
        if (newSound) {
          newSound.release()
        }
      }
    }, [message.uri])

    const playSound = () => {
      if (!sound) return

      if (isPlaying) {
        sound.pause()
        setIsPlaying(false)
      } else {
        sound.play((success) => {
          if (success) {
            setIsPlaying(false)
          } else {
            console.error('Playback failed')
          }
        })
        setIsPlaying(true)
      }
    }

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
      <View style={container}>
        <TouchableOpacity onPress={playSound} style={controls}>
          <Image
            source={isPlaying ? require('../../assets/pause.png') : require('../../assets/play.png')}
            style={icon}
          />
          <View style={durationStyle}>
            <Text style={{ color: theme.colors.primary }}>
              {formatDuration(duration || message.duration || 0)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
) 