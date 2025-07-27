import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default ({ theme }: { theme: Theme }) =>
  StyleSheet.create({
    subcontainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
    },
    container: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginHorizontal: 16,
    },
    input: {
      ...theme.fonts.inputTextStyle,
      color: theme.colors.inputText,
      flex: 1,
      maxHeight: 100,
      // Fixes default paddings for Android
      paddingBottom: 0,
      paddingTop: 0,
      fontFamily: 'Manrope-Regular',
    },
    marginRight: {
      marginRight: 16,
    },
  })
