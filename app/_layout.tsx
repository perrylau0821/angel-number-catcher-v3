import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import Background from '@/components/Background';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
  },
};

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
    'Roboto-ThinItalic': require('../assets/fonts/Roboto-ThinItalic.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-LightItalic': require('../assets/fonts/Roboto-LightItalic.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-MediumItalic': require('../assets/fonts/Roboto-MediumItalic.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-BoldItalic': require('../assets/fonts/Roboto-BoldItalic.ttf'),
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
    'Roboto-BlackItalic': require('../assets/fonts/Roboto-BlackItalic.ttf'),
    'RobotoCondensed-Light': require('../assets/fonts/RobotoCondensed-Light.ttf'),
    'RobotoCondensed-LightItalic': require('../assets/fonts/RobotoCondensed-LightItalic.ttf'),
    'RobotoCondensed-Regular': require('../assets/fonts/RobotoCondensed-Regular.ttf'),
    'RobotoCondensed-Italic': require('../assets/fonts/RobotoCondensed-Italic.ttf'),
    'RobotoCondensed-Bold': require('../assets/fonts/RobotoCondensed-Bold.ttf'),
    'RobotoCondensed-BoldItalic': require('../assets/fonts/RobotoCondensed-BoldItalic.ttf'),
    'ClashDisplay-Extralight': require('../assets/fonts/ClashDisplay-Extralight.otf'),
    'ClashDisplay-Light': require('../assets/fonts/ClashDisplay-Light.otf'),
    'ClashDisplay-Regular': require('../assets/fonts/ClashDisplay-Regular.otf'),
    'ClashDisplay-Medium': require('../assets/fonts/ClashDisplay-Medium.otf'),
    'ClashDisplay-Semibold': require('../assets/fonts/ClashDisplay-Semibold.otf'),
    'ClashDisplay-Bold': require('../assets/fonts/ClashDisplay-Bold.otf'),
    'ClashDisplay-Variable': require('../assets/fonts/ClashDisplay-Variable.ttf'),
    'ClashGrotesk-Extralight': require('../assets/fonts/ClashGrotesk-Extralight.otf'),
    'ClashGrotesk-Light': require('../assets/fonts/ClashGrotesk-Light.otf'),
    'ClashGrotesk-Regular': require('../assets/fonts/ClashGrotesk-Regular.otf'),
    'ClashGrotesk-Medium': require('../assets/fonts/ClashGrotesk-Medium.otf'),
    'ClashGrotesk-Semibold': require('../assets/fonts/ClashGrotesk-Semibold.otf'),
    'ClashGrotesk-Variable': require('../assets/fonts/ClashGrotesk-Variable.ttf'),
    'PPEditorialOld-Italic': require('../assets/fonts/PPEditorialOld-Italic.otf'),
    'PPEditorialOld-Regular': require('../assets/fonts/PPEditorialOld-Regular.otf'),
    'PPEditorialOld-Ultrabold': require('../assets/fonts/PPEditorialOld-Ultrabold.otf'),
    'PPEditorialOld-UltraboldItalic': require('../assets/fonts/PPEditorialOld-UltraboldItalic.otf'),
    'PPEditorialOld-Ultralight': require('../assets/fonts/PPEditorialOld-Ultralight.otf'),
    'PPEditorialOld-UltralightItalic': require('../assets/fonts/PPEditorialOld-UltralightItalic.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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