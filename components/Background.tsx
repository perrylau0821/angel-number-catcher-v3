import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CIRCLE_SIZE = Math.min(width, height) * 0.6;

export default function Background() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#01579b']}
        style={styles.gradient}
      >
        <View style={[styles.circle, styles.topLeft]} />
        <View style={[styles.circle, styles.bottomRight]} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  topLeft: {
    top: -CIRCLE_SIZE * 0.3,
    left: -CIRCLE_SIZE * 0.3,
  },
  bottomRight: {
    bottom: -CIRCLE_SIZE * 0.3,
    right: -CIRCLE_SIZE * 0.3,
  },
});