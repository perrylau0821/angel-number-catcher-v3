import { View, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme';
import { mockData, type ProcessedRecord } from '@/data/mock';
import { RecordCard } from '@/components/records/RecordCard';

export default function RecordsScreen() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 80; // Approximate height of our custom tab bar

  const renderItem = ({ item }: { item: ProcessedRecord }) => (
    <RecordCard record={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockData.processedViews.recordsList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
});