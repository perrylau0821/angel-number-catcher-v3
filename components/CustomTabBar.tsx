import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Map, Backpack, Book as BookDiary, User } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  interpolateColor,
  useDerivedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { Video as LucideIcon } from 'lucide-react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface Tab {
  name: string;
  icon: LucideIcon;
  label: string;
}

interface TabContentProps {
  tab: Tab;
  index: number;
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  const tabs = [
    { name: 'index', icon: Map, label: 'Records' },
    { name: 'collection', icon: Backpack, label: 'Collection' },
    { name: 'statistics', icon: BookDiary, label: 'Statistics' },
    { name: 'settings', icon: User, label: 'Settings' }
  ];
 
  const TabContent = ({ tab, index }: TabContentProps) => {
    const Icon = tab.icon;
    const isActive = state.index === index;
    
    const animation = useDerivedValue(() => {
      return isActive ? 1 : 0;
    }, [isActive]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: withSpring(isActive ? 1 : 0.7),
      };
    });

    return (
      <AnimatedTouchable
        style={[styles.tab, animatedStyles]}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: tab.name,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        }}
      >
        <Icon
          size={18}
          color={isActive ? colors.text.primary : colors.text.secondary}
          style={[
            styles.icon,
            isActive && styles.activeIcon
          ]}
        />
        <Text style={[
          styles.label,
          { color: isActive ? colors.text.primary : colors.text.secondary },
          isActive && styles.activeLabel
        ]}>
          {tab.label}
        </Text>
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
    gap: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.md,
  },
  icon: {
    marginBottom: 2,
  },
  activeIcon: {
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 10px #e0e5d8dd)',
      }
    })
  },
  label: {
    fontSize: 10,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },
  activeLabel: {
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
      }
    })
  }
});