import { MessageType } from '../../types'
import { useTwilio } from '../../utils'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native'
import Pdf from 'react-native-pdf'

interface PDFViewProps {
  message: MessageType.File
  onClose: () => void
}

const PDFView: React.FC<PDFViewProps> = ({ message, onClose }) => {
  const twilio = useTwilio()

  const [uri, setUri] = useState<string>()

  useEffect(() => {
    twilio?.getContentTemporaryUrl?.(message.id).then((url) => {
      let uri = message.uri
      if (message.uri.startsWith('content://')) {
        twilio.copyToCache?.(message).then((res) => {
          setUri(res)
        })
        return
      }
      setUri(uri)
    })
  }, [message.uri])

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Pdf
        trustAllCerts={false}
        source={{
          uri,
          cache: true,
          headers: {
            'Cache-Control': 'no-cache',
          },
        }}
        onLoadComplete={(numberOfPages: number, filePath: string) => {
          console.log(`Number of pages: ${numberOfPages}`)
        }}
        onPageChanged={(page: number, numberOfPages: number) => {
          console.log(`Current page: ${page}`)
        }}
        onError={(error: any) => {
          console.log('PDF Error:', error)
        }}
        onPressLink={(uri: string) => {
          console.log(`Link pressed: ${uri}`)
        }}
        style={styles.pdf}
        enablePaging={true}
        horizontal={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})

export default PDFView
