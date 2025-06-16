import React from "react";
import { View, ViewStyle } from "react-native";

import styles from "./styles";

interface DotProps {
  x: number;
  y: number;
  radius: number;
  dotStyles?: ViewStyle;
  dotColor: string;
}

const getStyles = ({ x, y, radius, dotColor }: DotProps): ViewStyle => ({
  // left: x,
  top: y,
  width: radius * 2,
  height: radius * 2,
  borderRadius: radius,
  backgroundColor: dotColor,
  marginRight: 5
});

const Dot: React.FC<DotProps> = (props) => (
  <View style={[styles.container, props.dotStyles, getStyles(props)]} />
);

export default Dot;