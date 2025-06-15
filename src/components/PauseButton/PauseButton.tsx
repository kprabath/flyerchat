import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { ThemeContext } from '../../utils'
import styles from '../PlayButton/styles'

export interface PlayButtonProps {
  size?: number
}

export const PauseButton = React.memo(({ size = 40 }: PlayButtonProps) => {
  const theme = React.useContext(ThemeContext)
  const { container, icon } = styles({ size, theme })

  return (
    <View style={container}>
      <Image source={require('../../assets/pause.png')} style={icon} />
    </View>
  )
}) 


