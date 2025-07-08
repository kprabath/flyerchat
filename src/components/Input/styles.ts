import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default ({ theme }: { theme: Theme }) =>
  StyleSheet.create({
    subcontainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: "space-between",
      paddingTop: 8
    },
    container: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      marginBottom: 20,
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
    },
    marginRight: {
      marginRight: 16,
    },
  })