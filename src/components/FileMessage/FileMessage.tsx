import * as React from 'react'
import { Image, Text, View } from 'react-native'
import moment from 'moment'

import { MessageType } from '../../types'
import {
  formatBytes,
  L10nContext,
  ThemeContext,
  UserContext,
} from '../../utils'
import styles from './styles'

export interface FileMessageProps {
  message: MessageType.DerivedFile
}

const formatToJapanDate = (date: number)=> {
   const formattedDate = moment(date).format("MM月DD日 HH:MM")
   return  formattedDate
}

export const FileMessage = ({ message }: FileMessageProps) => {


  const l10n = React.useContext(L10nContext)
  const theme = React.useContext(ThemeContext)
  const user = React.useContext(UserContext)
  const { container, icon, iconContainer, name, size, textContainer, captionText } = styles({
    message,
    theme,
    user,
  })



  return (
    <View>
      {message?.text ? <Text style={captionText}>{message.text}</Text> : null}
      <View
        accessibilityLabel={l10n.fileButtonAccessibilityLabel}
        style={container}
      >
        <View style={iconContainer}>
          {theme.icons?.documentIcon?.() ?? (
            <Image
              source={require('../../assets/file-text.png')}
              style={icon}
            />
          )}
        </View>
        <View style={textContainer}>
          <Text style={name}>{message.name}</Text>
          <Text style={size}>{"サイズ: " + formatBytes(message.size)}</Text>
          {message?.createdAt ?  <Text style={size}>{"有効期限: " + formatToJapanDate(message.createdAt)}</Text> : null}
        </View>
      </View>
    </View>
  )
}
