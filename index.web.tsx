import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

// Function to check if WASM is supported
const isWasmSupported = () => {
  try {
    if (typeof WebAssembly === 'object' && 
        typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(new Uint8Array([
        0x0, 0x61, 0x73, 0x6d, 0x1, 0x0, 0x0, 0x0
      ]));
      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    }
  } catch (e) {
    return false;
  }
  return false;
};

// Initialize Skia with error handling
const initializeSkia = async () => {
  if (!isWasmSupported()) {
    console.error('WebAssembly is not supported in this browser');
    // Fallback to a non-Skia version or show an error message
    renderRootComponent(App);
    return;
  }

  try {
    console.log('Loading Skia WebAssembly...');
    await LoadSkiaWeb();
    console.log('Skia WebAssembly loaded successfully');
    renderRootComponent(App);
  } catch (error) {
    console.error('Failed to load Skia WebAssembly:', error);
    // Log additional details if available
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    // Still render the app, but without Skia functionality
    renderRootComponent(App);
  }
};

// Start initialization
initializeSkia().catch(error => {
  console.error('Critical error during Skia initialization:', error);
  // Ensure the app renders even if initialization completely fails
  renderRootComponent(App);
});