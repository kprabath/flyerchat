import * as React from 'react';
import { Image, Text, View } from 'react-native';

import moment from 'moment';

import { MessageType } from '../../types';

import { L10nContext, ThemeContext, UserContext, formatBytes } from '../../utils';
import styles from './styles';

export interface FileMessageProps {
  message: MessageType.DerivedFile;
}

const formatToJapanDate = (date: number) => {
  const formattedDate = moment(date).format('MM月DD日 HH:MM');
  return formattedDate;
};

export const isUrlExpired = (url: string) => {
  // Get the current time in seconds
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  // Extract the expiration time from the URL
  const expirationTime = extractExpirationTime(url);
  // Check if the current time has exceeded the expiration time
  return currentTimeInSeconds > expirationTime;
};

export const extractExpirationTime = (url: string) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const expiresParam = params.get('Expires');
    return expiresParam ? parseInt(expiresParam, 10) : 0;
  } catch (error) {
    return 0;
  }
};
export const FileMessage = ({ message }: FileMessageProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = React.useContext(ThemeContext);
  const user = React.useContext(UserContext);
  const { container, icon, iconContainer, name, size, textContainer, captionText } = styles({
    message,
    theme,
    user,
  });

  if (isUrlExpired(message.uri)) {
    return (
      <View style={container}>
        <View style={iconContainer}>
          <Image source={require('../../assets/file-times.png')} style={icon} />
        </View>
        <View style={textContainer}>
          <Text style={name}>ファイルの保存期間が過ぎました</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      {message?.text ? <Text style={captionText}>{message.text}</Text> : null}
      <View accessibilityLabel={l10n.fileButtonAccessibilityLabel} style={container}>
        <View style={iconContainer}>
          {theme.icons?.documentIcon?.() ?? (
            <Image source={require('../../assets/file-text.png')} style={icon} />
          )}
        </View>
        <View style={textContainer}>
          <Text style={name}>{message.name}</Text>
          <Text style={size}>{'サイズ: ' + formatBytes(message.size)}</Text>
          {message?.createdAt ? (
            <Text style={size}>{'有効期限: ' + formatToJapanDate(message.createdAt)}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};
