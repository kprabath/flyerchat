import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import styles from './styles';

interface NewTypingAnimationProps {
  isVisible?: boolean;
  dotSize?: number;
  animationSpeed?: number;
}

const INACTIVE_COLOR = '#5A00FF';
const ACTIVE_COLOR = '#898A8D';

const NewTypingAnimation: React.FC<NewTypingAnimationProps> = React.memo(
  ({ isVisible = true, dotSize = 6, animationSpeed = 800 }) => {
    const animations = useRef([
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ]).current;

    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    const dotStyle = useMemo(
      () => ({
        width: dotSize,
        height: dotSize,
        borderRadius: dotSize / 2,
        marginHorizontal: 2,
      }),
      [dotSize],
    );

    const createSequentialAnimation = useMemo(() => {
      const singleDotDuration = animationSpeed / 3;
      const halfDuration = singleDotDuration / 2;

      const createDotSequence = (animatedValue: Animated.Value) => [
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: halfDuration,
          easing: Easing.bezier(0.2, 0.68, 0.18, 1.08),
          useNativeDriver: false, // Need false for backgroundColor interpolation
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: halfDuration,
          easing: Easing.bezier(0.2, 0.68, 0.18, 1.08),
          useNativeDriver: false,
        }),
      ];

      return Animated.loop(
        Animated.sequence([
          ...createDotSequence(animations[0]),
          ...createDotSequence(animations[1]),
          ...createDotSequence(animations[2]),
        ]),
      );
    }, [animations, animationSpeed]);

    useEffect(() => {
      if (!isVisible) {
        animationRef.current?.stop();
        animations.forEach(anim => anim.setValue(0));
        return;
      }

      animationRef.current = createSequentialAnimation;
      animationRef.current.start();

      return () => {
        animationRef.current?.stop();
      };
    }, [isVisible, createSequentialAnimation, animations]);

    const getAnimatedStyle = useMemo(
      () => (animatedValue: Animated.Value) => ({
        transform: [
          {
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.5],
            }),
          },
        ],
        backgroundColor: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [INACTIVE_COLOR, ACTIVE_COLOR],
        }),
      }),
      [],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <View style={styles.container}>
        {animations.map((animation, index) => (
          <Animated.View key={index} style={[dotStyle, getAnimatedStyle(animation)]} />
        ))}
      </View>
    );
  },
);

export default NewTypingAnimation;
