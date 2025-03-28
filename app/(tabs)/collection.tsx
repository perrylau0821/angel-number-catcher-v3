import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export default function CollectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Collection Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
});