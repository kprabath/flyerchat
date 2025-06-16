import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { MessageType } from '../../types';
import { ThemeContext } from '../../utils'

interface DeeplinkMessageProps {
  message: MessageType.Deeplink;
  onDeeplinkPress?: (message: MessageType.Deeplink) => void;
}

const Logo = require("../../assets/logo.png")

export const DeeplinkMessage: React.FC<DeeplinkMessageProps> = ({ message, onDeeplinkPress }) => {
 const theme = React.useContext(ThemeContext)
  return (
    <TouchableOpacity 
      style={{backgroundColor: theme.colors.primary}}
      onPress={() => onDeeplinkPress?.(message)}
    >
      <View style={styles.content}>
        <Image source={Logo} style = {styles.image}/>
        {message?.deeplink ? <Text style= {styles.text}>{message.deeplink.toLocaleUpperCase()}</Text>: null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  image: {
    height: 100,
    width: 200,
    backgroundColor:'#D2AF8C'
  }
});
