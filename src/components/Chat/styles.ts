import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default ({ theme }: { theme: Theme }) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    typingAnimation: {
        backgroundColor: theme.colors.secondary,
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
      backgroundColor: theme.colors.inputBackground,
    },
    emptyComponentContainer: {
      alignItems: 'center',
      marginHorizontal: 24,
      transform: [{ rotateX: '180deg' }],
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
