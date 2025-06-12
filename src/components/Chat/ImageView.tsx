import * as React from 'react'
import { ImageRequireSource, ImageURISource, View } from 'react-native'

interface Props {
  imageIndex: number
  images: Array<ImageURISource | ImageRequireSource>
  onRequestClose: () => void
  visible: boolean;
  HeaderComponent: ()=> React.ReactNode
}

const ImageView = (_: Props) => {
  return <View />
}

export default ImageView
