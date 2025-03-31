import { View, Text, StyleSheet, useWindowDimensions, Platform, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing, typography } from '@/theme';
import { ProcessedRecord } from '@/data/mock';
import { getPatternLabel } from '@/utils/patterns';
import { Star } from '@/assets/svg';
import { OutlinedText } from '@/components/OutlinedText';
import { FlipCard } from '@/components/FlipCard';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { useState } from 'react';
import MarqueeText from 'react-native-marquee';
import * as Haptics from 'expo-haptics';

interface RecordCardProps {
  record: ProcessedRecord;
}

// Pre-load all images
const cardBackground = require('@/assets/images/card-background-dark.png');
const cardGrain = require('@/assets/images/card-grain.png');
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const TitleComponent = ({ text, style, containerWidth }) => {
  return (
    <View style={styles.titleContainer}>
      <MarqueeText
        style={style}
        speed={0.2}
        numberOfLines={1}
        marqueeOnStart={true}
        loop={true}
        delay={0}
      >
        {text}
      </MarqueeText>
    </View>
  );
};

export function RecordCard({ record }: RecordCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth - (spacing.xl * 2);
  const cardHeight = (cardWidth * 149) / 371;
  const [isFlipped, setIsFlipped] = useState(false);
  const titleContainerWidth = cardWidth - spacing.lg * 2 - 80; // Subtract padding and number width

  const handleFlipStart = (isFlippingBack: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const containerStyle = [
    styles.container,
    { 
      width: cardWidth, 
      height: cardHeight,
      ...(Platform.OS === 'ios' && {
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowOffset: {height:-10}
      })
    },
  ];

  const webGlowStyle = Platform.OS === 'web' ? {
    filter: `drop-shadow(0 0 20px ${colors.shadow.light})`
  } : {};

  const RegularContent = (
    <View style={[styles.cardSide, styles.face]}>
      <Image 
        source={cardBackground}
        style={styles.backgroundImage}
        contentFit="cover"
        transition={200}
        placeholder={blurhash}
        cachePolicy="memory-disk"
      />
      <Image 
        source={cardGrain}
        style={styles.backgroundImageGrain}
        contentFit="cover"
        transition={200}
        placeholder={blurhash}
        cachePolicy="memory-disk"
      />
      <View style={styles.faceContent}>
        <View style={styles.header}>
          <TitleComponent 
            text={record.title} 
            style={styles.title} 
            containerWidth={titleContainerWidth}
          />
          <OutlinedText
            text={record.angelNumber}
            fontSize={22}
            fontFamily="ClashDisplay-Medium"
            style={styles.headerNumber}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.footerNumberWrapper}>
              <Text style={styles.footerNumber}>{record.angelNumber}</Text>
              <View style={styles.starContainer}>
                <Star fill={colors.text.primary} strokeWidth={0.5} glow />
              </View>
            </View>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.countContainer}>
              <OutlinedText
                text={`×${record.count}`}
                fontSize={24}
                fontFamily="PPEditorialOld-Italic"
                style={styles.count}
              />
            </View>
            <View style={styles.patternContainer}>
              <Text style={styles.pattern}>{getPatternLabel(record.pattern)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const FlippedContent = (
    <View style={[styles.cardSide, styles.back]}>
      <Image 
        source={cardBackground}
        style={styles.backgroundImage}
        contentFit="cover"
        transition={200}
        placeholder={blurhash}
        cachePolicy="memory-disk"
      />
      <Image 
        source={cardGrain}
        style={styles.backgroundImageGrain}
        contentFit="cover"
        transition={200}
        placeholder={blurhash}
        cachePolicy="memory-disk"
      />
      <View style={styles.backContent}>
        <View style={styles.backgroundNumber}>
          <OutlinedText
            text={record.angelNumber}
            fontSize={140}
            fontFamily="ClashDisplay-Medium"
            strokeWidth={1}
          />
        </View>

        <View style={styles.backHeader}>
          <TitleComponent 
            text={record.title} 
            style={styles.backTitle} 
            containerWidth={titleContainerWidth}
          />
          {record.isProved && (
            <View style={styles.proofContainer}>
              <CheckCircle2 
                size={20} 
                color={colors.text.primary}
              />
            </View>
          )}
        </View>
        
        <Text style={styles.description}>{record.description}</Text>
      </View>
    </View>
  );

  return (
    <Pressable 
      style={[containerStyle, webGlowStyle]}
      onPress={() => setIsFlipped(!isFlipped)}
    >
      <FlipCard
        isFlipped={isFlipped}
        duration={500}
        direction="y"
        onFlipStart={handleFlipStart}
        RegularContent={RegularContent}
        FlippedContent={FlippedContent}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  cardSide: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.background.glass.dark,
  },
  face: {
    backfaceVisibility: 'hidden',
  },
  back: {
    backfaceVisibility: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  backgroundImageGrain: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  faceContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingTop: spacing.sm,
    justifyContent: 'space-between',
  },
  backContent: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontFamily: typography.family.editorialUltralightItalic,
    fontSize: 20,
    color: colors.text.primary,
  },
  headerNumber: {
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  footerNumberWrapper: {
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 0
  },
  footerNumber: {
    fontFamily: typography.family.displayMedium,
    fontSize: 74,
    color: colors.text.primary,
    lineHeight: 74,
    top: 18
  },
  starContainer: {
    left: -24,
    top: 14,
  },
  footerRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  countContainer: {
    marginBottom: spacing.sm,
  },
  count: {
    alignSelf: 'flex-end',
  },
  patternContainer: {
    borderWidth: 0.3,
    borderColor: colors.text.primary,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
  },
  pattern: {
    fontFamily: typography.family.displayRegular,
    fontSize: 8,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  backgroundNumber: {
    position: 'absolute',
    right: -12 -0,
    bottom: -24 -36,
    opacity: 0.6
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backTitle: {
    fontFamily: typography.family.editorialUltralightItalic,
    fontSize: 24,
    color: colors.text.primary,
    lineHeight: 28,
  },
  proofContainer: {
    marginTop: spacing.xs,
  },
  description: {
    fontFamily: typography.family.condensedLight,
    fontSize: 12,
    color: colors.text.primary,
    lineHeight: 14,
  },
});