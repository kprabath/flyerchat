import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

interface StyleProps {
  size: number
  theme: Theme
}

export default ({ size, theme }: StyleProps) =>
  StyleSheet.create({
    container: {
      height: size,
      width: size,
      backgroundColor: "white",
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: size / 2,
    },
    icon: {
      width: size * 0.4,
      height: size * 0.4,
      tintColor: theme.colors.primary,
    },
  }) 