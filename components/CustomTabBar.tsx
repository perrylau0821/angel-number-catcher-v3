import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Map, Backpack, Book as BookDiary, User } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useDerivedValue,
  interpolate,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';
import { Video as LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface Tab {
  name: string;
  icon: LucideIcon;
}

interface TabContentProps {
  tab: Tab;
  index: number;
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  const tabs = [
    { name: 'index', icon: Map },
    { name: 'collection', icon: Backpack },
    { name: 'statistics', icon: BookDiary },
    { name: 'settings', icon: User }
  ];

  const handleTabPress = (tab: Tab, isActive: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: tab.name,
      canPreventDefault: true,
    });

    if (!isActive && !event.defaultPrevented) {
      // Only trigger haptics on non-web platforms
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      navigation.navigate(tab.name);
    }
  };
 
  const TabContent = ({ tab, index }: TabContentProps) => {
    const Icon = tab.icon;
    const isActive = state.index === index;
    
    const animation = useDerivedValue(() => {
      return withSpring(isActive ? 1 : 0, {
        mass: 1,
        damping: 15,
        stiffness: 120,
      });
    }, [isActive]);

    const pulseAnimation = useDerivedValue(() => {
      if (!isActive) return 0;
      return withRepeat(
        withSequence(
          withTiming(1, {
            duration: 1200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          withTiming(0.2, {
            duration: 1200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          })
        ),
        -1,
        true
      );
    }, [isActive]);

    const animatedStyles = useAnimatedStyle(() => {
      const opacity = interpolate(animation.value, [0, 1], [0.7, 1]);
      const scale = interpolate(animation.value, [0, 1], [1, 1.1]);
      
      if (!isActive) {
        return {
          opacity,
          transform: [{ scale }],
        };
      }
      
      const shadowRadius = interpolate(
        pulseAnimation.value,
        [0.2, 0.8],
        [3, 6]  // Increased shadow radius range
      );

      return {
        opacity,
        transform: [{ scale }],
        shadowOpacity : 1,
        shadowRadius,
        shadowColor: colors.shadow.light,
        shadowOffset: { width: 0, height: 4 },
        elevation: shadowRadius, // For Android
      };
    });

    return (
      <AnimatedTouchable
        style={[styles.tab, animatedStyles]}
        onPress={() => handleTabPress(tab, isActive)}
      >
        <Icon
          size={28}
          color={isActive ? colors.text.primary : colors.text.secondary}
          style={styles.icon}
        />
      </AnimatedTouchable>
    );
  };

  const Container = Platform.select({
    ios: BlurView,
    android: BlurView,
    default: View
  });

  const containerProps = Platform.select({
    ios: { intensity: 50, tint: 'dark' },
    android: { intensity: 50, tint: 'dark' },
    default: {}
  });

  return (
    <View style={styles.wrapper}>
      <Container 
        style={[
          styles.container,
          { marginBottom: insets.bottom }
        ]} 
        {...containerProps}
      >
        <View style={styles.innerContainer}>
          {tabs.map((tab, index) => (
            <TabContent
              key={tab.name}
              tab={tab}
              index={index}
            />
          ))}
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    borderRadius: spacing.xl,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backgroundColor: colors.background.glass.dark,
        backdropFilter: 'blur(10px)',
      },
      default: {
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background.glass.dark,
      }
    }),
  },
  innerContainer: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: spacing.md,
  },
  icon: {
    marginBottom: 0,
  }
});