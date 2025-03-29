import { View, Text, Image, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import { ProcessedRecord } from '@/data/mock';
import { getPatternLabel } from '@/utils/patterns';

interface RecordCardProps {
  record: ProcessedRecord;
}

export function RecordCard({ record }: RecordCardProps) {
  return (
    <View style={styles.container}>
      <RecordHeader 
        angelNumber={record.angelNumber} 
        isProved={record.isProved} 
      />
      {record.photoUrl && (
        <RecordImage photoUrl={record.photoUrl} />
      )}
      <RecordContent 
        title={record.title}
        description={record.description}
        pattern={record.pattern}
      />
      <RecordFooter 
        count={record.count}
        timestamp={record.timestamp}
      />
    </View>
  );
}

interface RecordHeaderProps {
  angelNumber: string;
  isProved: boolean;
}

function RecordHeader({ angelNumber, isProved }: RecordHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Angel Number {angelNumber}</Text>
        {isProved && (
          <CheckCircle2 
            size={16} 
            color={colors.text.primary} 
            style={styles.provedIcon}
          />
        )}
      </View>
    </View>
  );
}

interface RecordImageProps {
  photoUrl: string;
}

function RecordImage({ photoUrl }: RecordImageProps) {
  return (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri: photoUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

interface RecordContentProps {
  title: string;
  description: string;
  pattern: 'alternative' | 'repeating' | 'custom';
}

function RecordContent({ title, description, pattern }: RecordContentProps) {
  return (
    <>
      <Text style={styles.keywords}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.pattern}>{getPatternLabel(pattern)}</Text>
    </>
  );
}

interface RecordFooterProps {
  count: number;
  timestamp: string;
}

function RecordFooter({ count, timestamp }: RecordFooterProps) {
  return (
    <View style={styles.footer}>
      <Text style={styles.count}>x {count}</Text>
      <Text style={styles.timestamp}>
        {new Date(timestamp).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.glass.dark,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.size.lg,
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
  },
  provedIcon: {
    marginLeft: spacing.xs,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: spacing.md,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  keywords: {
    fontSize: typography.size.md,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: typography.size.md * 1.4,
  },
  pattern: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  count: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  timestamp: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
});