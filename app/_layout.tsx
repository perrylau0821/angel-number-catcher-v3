import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import Background from '@/components/Background';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
  },
};

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider value={customDarkTheme}>
      <View style={styles.container}>
        <Background />
        <Stack theme={customDarkTheme} screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});