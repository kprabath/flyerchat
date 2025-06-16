import React from "react";
import { View, ViewStyle } from "react-native";

import Dot from "./Dot"
import styles from "./styles";

interface TypingAnimationProps {
  style?: ViewStyle;
  dotStyles?: ViewStyle;
  dotColor?: string;
  dotMargin?: number;
  dotAmplitude?: number;
  dotSpeed?: number;
  show?: boolean;
  dotRadius?: number;
  dotY?: number;
  dotX?: number;
}

interface TypingAnimationState {
  currentAnimationTime: number;
  y1?: number;
  y2?: number;
  y3?: number;
}

class TypingAnimation extends React.Component<TypingAnimationProps, TypingAnimationState> {
  private frameAnimationRequest: number;
  private _animation: () => void = () => {};

  constructor(props: TypingAnimationProps) {
    super(props);

    const { dotAmplitude, dotSpeed, dotY } = props;
    this.state = {
      currentAnimationTime: 0
    };

    this._animation = () => {
      this.setState(prevState => ({
        y1: dotY! + dotAmplitude! * Math.sin(prevState.currentAnimationTime),
        y2: dotY! + dotAmplitude! * Math.sin(prevState.currentAnimationTime - 1),
        y3: dotY! + dotAmplitude! * Math.sin(prevState.currentAnimationTime - 2),
        currentAnimationTime: prevState.currentAnimationTime + dotSpeed!
      }));
      this.frameAnimationRequest = requestAnimationFrame(this._animation);
    };
    this.frameAnimationRequest = requestAnimationFrame(this._animation);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameAnimationRequest);
  }

  render() {
    const { dotStyles, style, show, dotColor, dotMargin, dotRadius, dotX } = this.props;
    if(!show) return null;
    return (
      <View style={[styles.dotContainer, style]}>
        <Dot x={dotX! - dotRadius! - dotMargin!} y={this.state.y1!} radius={dotRadius!} dotStyles={dotStyles} dotColor={dotColor as string} />
        <Dot x={dotX!} y={this.state.y2!} radius={dotRadius!} dotStyles={dotStyles as any} dotColor={dotColor as  string} />
        <Dot x={dotX! + dotRadius! + dotMargin!} y={this.state.y3!} radius={dotRadius!} dotStyles={dotStyles} dotColor={dotColor as string} />
      </View>
    );
  }

  static defaultProps = {
    style: {},
    dotStyles: {},
    dotColor: "black",
    dotMargin: 3,
    dotAmplitude: 3,
    dotSpeed: 0.15,
    show: true,
    dotRadius: 10,
    dotY: 0,
    dotX: 12
  };
}

export default TypingAnimation;