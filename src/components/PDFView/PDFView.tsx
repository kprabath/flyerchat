import { MessageType } from '../../types'
import { useTwilio } from '../../utils'
import React, { ReactNode, useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Pressable,
} from 'react-native'
import Pdf from 'react-native-pdf'

interface PDFViewProps {
  message: MessageType.File
  onClose: () => void
  rightIcon?: ({ message }: { message: MessageType.File }) => ReactNode
}

const PDFView: React.FC<PDFViewProps> = ({ message, onClose, rightIcon }) => {


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style = {styles.subHeader}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <View pointerEvents='none' style={styles.pdfName}>
            <Text style={styles.pdfText}>{message.name}</Text>
          </View>
          {rightIcon?.({ message })}
        </View>
      </SafeAreaView>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: message.uri,
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
    backgroundColor: '#EEEEEE',
  },
  pdfText: {
    color: '#0A1446',
    fontSize: 18,
    maxWidth: '80%'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
    backgroundColor: '#EEEEEE',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 16
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#0A1446',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  pdfName: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
})

export default PDFView
