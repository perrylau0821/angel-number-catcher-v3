import { Text, StyleSheet, Platform } from 'react-native';
import { Canvas, Group, Path, Skia, useFont, Fill, Mask, TextBlob, DashPathEffect } from '@shopify/react-native-skia';
import { colors } from '@/theme';

interface OutlinedTextProps {
  text: string;
  fontSize: number;
  fontFamily: string;
  style?: any;
  strokeWidth?: number;
  dashed?: boolean;
}

export function OutlinedText({ 
  text, 
  fontSize, 
  fontFamily, 
  style,
  strokeWidth = 1,
  dashed = false 
}: OutlinedTextProps) {
  // Map the font family to the correct font file
  const getFontSource = () => {
    switch (fontFamily) {
      case 'ClashDisplay-Medium':
        return require('../assets/fonts/ClashDisplay-Medium.otf');
      case 'PPEditorialOld-Italic':
        return require('../assets/fonts/PPEditorialOld-Italic.otf');
      default:
        return require('../assets/fonts/ClashDisplay-Regular.otf');
    }
  };

  const font = useFont(getFontSource(), fontSize);
  
  if (!font || Platform.OS === 'web') {
    // Fallback to regular text while font loads or on web platform
    return <Text style={[{ fontSize, fontFamily, textAlign: 'right' }, style]}>{text}</Text>;
  }

  // Text blob and canvas properties
  const blob = Skia.TextBlob.MakeFromText(text, font);
  
  if (!blob) {
    return <Text style={[{ fontSize, fontFamily, textAlign: 'right' }, style]}>{text}</Text>;
  }

  // Calculate text dimensions
  const textWidth = font.getTextWidth(text);
  const textHeight = fontSize * 1.2; // Increase the multiplier to ensure enough height
  const textOffset = fontFamily === 'PPEditorialOld-Italic' ? 4 : 0;
  const rightPadding = fontFamily === 'PPEditorialOld-Italic' ? fontSize * 0.2 : 0; // Add extra padding for italic fonts

  return (
    <Canvas style={[
      styles.canvas, 
      { 
        width: textWidth + textOffset + strokeWidth * 2 + rightPadding, // Add right padding
        height: textHeight + strokeWidth * 2 // Add padding for stroke
      }, 
      style
    ]}>
      <Mask
        mode="luminance"
        mask={
          <Group>
            <Fill color="white" />
            <TextBlob
              y={textHeight - fontSize * 0.2} // Adjust vertical position
              x={textOffset}
              blob={blob}
              color="black"
            />
          </Group>
        }
      >
        <Group
          style="stroke"
          strokeWidth={strokeWidth}
        >
          <TextBlob
            y={textHeight - fontSize * 0.2} // Match the mask position
            x={textOffset}
            blob={blob}
            color={colors.text.primary}
          />
          {dashed && <DashPathEffect intervals={[4, 4]} />}
        </Group>
      </Mask>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignSelf: 'flex-end',
  },
});