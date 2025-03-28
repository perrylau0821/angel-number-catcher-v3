import { Skia } from "@shopify/react-native-skia";
import meshGradientMorphShader from './meshGradientMorph';
import meshGradient2 from './meshGradient2';
import universeTrip from './universeTrip';
import starDust from './starDust';

// Ensure shader is properly loaded before creating RuntimeEffect
if (!meshGradientMorphShader) {
  throw new Error('Failed to load shader source');
}

export const backgroundEffect = Skia.RuntimeEffect.Make(meshGradientMorphShader)!;