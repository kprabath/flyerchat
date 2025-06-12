import React from "react";
import { Image } from "react-native";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ImageViewHeaderProps {
  onDownloadPress?: () => void;
  onClosePress?: () => void;
  showDownloadButton?: boolean
}

const ImageViewHeader: React.FC<ImageViewHeaderProps> = ({
  onDownloadPress,
  onClosePress,
  showDownloadButton
}) => {
  return (
    <SafeAreaView style={styles.container}>
       {showDownloadButton ? <TouchableOpacity onPress={onDownloadPress} style={styles.button}>
         <Image source={require("../../assets/download.png")} style={styles.imageDownload}/>
      </TouchableOpacity>: null}
      
      <TouchableOpacity onPress={onClosePress} style={styles.button}>
      <Image source={require("../../assets/close.png")} style={styles.imageClose}/>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageDownload:{
    height: 30,
    width: 30
  },
  imageClose:{
    height: 20,
    width: 20
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  button: {
    padding: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ImageViewHeader;