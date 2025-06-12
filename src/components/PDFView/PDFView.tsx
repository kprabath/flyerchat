import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native';
import Pdf from 'react-native-pdf';


import { MessageType } from '../../types';

interface PDFViewProps {
  message: MessageType.File;
  onClose: () => void;
}

const PDFView: React.FC<PDFViewProps> = ({ message, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
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
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page: number, numberOfPages: number) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error: any) => {
          console.log('PDF Error:', error);
        }}
        onPressLink={(uri: string) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
        enablePaging={true}
        horizontal={false}
      />
    </View>
  );
};

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
});

export default PDFView;
