import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default ({ theme }: { theme: Theme }) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    typingAnimation: {
        backgroundColor: "#F0F0F0",
        height: 40,
        width: 80,
        borderRadius: 50,
        marginBottom: 20,
        marginLeft: 20,
        
    },
    safeAreaFooter:{
      height: 40,
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: -1,
      backgroundColor: theme.colors.footerBackground,
    },
    emptyComponentContainer: {
      alignItems: 'center',
      marginHorizontal: 24,
      transform: [{ scale: -1}],
    },
    emptyComponentTitle: {
      ...theme.fonts.emptyChatPlaceholderTextStyle,
      textAlign: 'center',
    },
    flatList: {
      backgroundColor: theme.colors.background,
      height: '100%',
    },
    flatListContentContainer: {
      flexGrow: 1,
    },
    footer: {
      height: 16,
    },
    footerLoadingPage: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      height: 32,
    },
    header: {
      height: 4,
    },
    keyboardAccessoryView: {
      backgroundColor: theme.colors.inputBackground,
      // borderTopLeftRadius: theme.borders.inputBorderRadius,
      // borderTopRightRadius: theme.borders.inputBorderRadius,
    },
  })
