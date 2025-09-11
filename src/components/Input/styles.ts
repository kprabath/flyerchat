import { Platform, StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default ({
  theme,
  isKeyboardVisible,
}: {
  theme: Theme
  isKeyboardVisible: boolean
}) =>
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
      ...(Platform.OS === 'android'
        ? {
            minHeight: 40,
            maxHeight: 100,
          }
        : {
            maxHeight: isKeyboardVisible ? 100 : 40,
          }),
      paddingBottom: 0,
      paddingTop: 0,
      fontFamily: 'Manrope-Regular',
    },
    marginRight: {
      marginRight: 16,
    },
    inputText: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 0 : 10,
      left: 0,
      right: 0,
      color: theme.colors.black,
      backgroundColor: 'transparent',
      pointerEvents: 'none',
      paddingRight: 40,
    },
    inputTextContainer: {
      flexDirection: 'row',
      position: 'relative',
    },
    inputTextOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      pointerEvents: 'none',
      paddingRight: 30,
    },
  })
