import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Canvas, Fill, Shader, vec, useValue, useTouchHandler, useClock } from "@shopify/react-native-skia";
import { backgroundEffect } from "@/shaders/background";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

const { width, height } = Dimensions.get('window');

export default function Background() {
  const clock = useClock();
  const center = vec(width / 2, height / 2);
  const pointer = useSharedValue(vec(0, 0));
  const onTouch = useTouchHandler({
    onActive: (e) => {
      pointer.current = e;
    },
  });
  const uniforms = useDerivedValue(
    () => ({ center, pointer: pointer.value, time: clock.value/1000,  resolution: vec(width, height) }),
    [clock]
  );
  
  return (
    <View style={styles.container}>
      {Platform !== 'web' ? 
      <Canvas style={styles.canvas}>
        <Fill>
          <Shader 
            source={backgroundEffect}
            uniforms={uniforms}
          />
        </Fill>
      </Canvas>: null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});