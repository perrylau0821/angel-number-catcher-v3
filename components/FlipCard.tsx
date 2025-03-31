import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  interpolate,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface FlipCardProps {
  isFlipped: boolean;
  cardStyle?: any;
  direction?: 'x' | 'y';
  duration?: number;
  RegularContent: React.ReactNode;
  FlippedContent: React.ReactNode;
  onFlipStart?: (isFlippingBack: boolean) => void;
}

export function FlipCard({
  isFlipped,
  cardStyle,
  direction = 'y',
  duration = 500,
  RegularContent,
  FlippedContent,
  onFlipStart,
}: FlipCardProps) {
  const isDirectionX = direction === 'x';
  const flipProgress = useSharedValue(0);

  useEffect(() => {
    if (onFlipStart) {
      onFlipStart(!isFlipped);
    }
    flipProgress.value = withTiming(isFlipped ? 1 : 0, { duration });
  }, [isFlipped]);

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [
        isDirectionX ? { rotateX: `${spinValue}deg` } : { rotateY: `${spinValue}deg` },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [
        isDirectionX ? { rotateX: `${spinValue}deg` } : { rotateY: `${spinValue}deg` },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <View style={[styles.container, cardStyle]}>
      <Animated.View
        style={[
          styles.card,
          styles.regularCard,
          regularCardAnimatedStyle,
        ]}>
        {RegularContent}
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          styles.flippedCard,
          flippedCardAnimatedStyle,
        ]}>
        {FlippedContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  regularCard: {
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 0,
  },
});