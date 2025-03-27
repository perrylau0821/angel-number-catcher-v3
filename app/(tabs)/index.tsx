import { View, Text, StyleSheet } from 'react-native';

export default function RecordsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Records List</Text>
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
    fontSize: 18,
    color: 'white'
  },
});