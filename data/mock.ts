// Base database types
export interface DBRecord {
  id: string;
  angel_number: string;
  title: string;
  description: string;
  pattern: 'alternative' | 'repeating' | 'custom';
  count: number;
  created_at: string;
  photo_url: string | null;
  is_proved: boolean;
}

// Raw database mock data
const angelNumberDescriptions = [
  {
    number: "111",
    title: "Manifestation, Alignment, Opportunity",
    description: "A powerful sign of manifestation and alignment. Your thoughts are materializing rapidly, stay focused on your goals.",
    pattern: "repeating" as const
  },
  {
    number: "123",
    title: "Progress, Growth, Forward Movement",
    description: "A sign of natural progression and positive movement in your life. Trust the journey ahead.",
    pattern: "alternative" as const
  },
  {
    number: "333",
    title: "Creativity, Growth, Expansion",
    description: "The Ascended Masters are with you, supporting your creative endeavors and personal growth.",
    pattern: "repeating" as const
  },
  {
    number: "1221",
    title: "Balance, Mirror, Reflection",
    description: "A mirror number indicating balance between the material and spiritual worlds.",
    pattern: "alternative" as const
  },
  {
    number: "777",
    title: "Spiritual, Wisdom, Inner-Knowing",
    description: "A deeply spiritual number signifying divine wisdom and spiritual awakening.",
    pattern: "repeating" as const
  },
  {
    number: "1234",
    title: "Sequence, Order, Progression",
    description: "Natural progression and divine timing in your life path.",
    pattern: "alternative" as const
  },
  {
    number: "911",
    title: "Lightwork, Service, Awakening",
    description: "A call to spiritual service and awakening to your soul's mission.",
    pattern: "custom" as const
  }
];

// Sample photo URLs from Unsplash (angel number related images)
const samplePhotoUrls = [
  'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1920&auto=format&fit=crop',
];

// Generate mock records with realistic angel number data
const dbRecords: DBRecord[] = Array.from({ length: 50 }, (_, i) => {
  const randomAngelData = angelNumberDescriptions[Math.floor(Math.random() * angelNumberDescriptions.length)];
  const hasPhoto = i % 2 === 0;
  return {
    id: i.toString(),
    angel_number: randomAngelData.number,
    title: randomAngelData.title,
    description: randomAngelData.description,
    pattern: randomAngelData.pattern,
    count: Math.floor(Math.random() * 10) + 1, // Random occurrence count between 1-10
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    photo_url: hasPhoto ? samplePhotoUrls[i % samplePhotoUrls.length] : null,
    is_proved: hasPhoto, // If there's a photo, it's proved
  };
});

// Processed data types
export interface ProcessedRecord {
  id: string;
  angelNumber: string;
  title: string;
  description: string;
  pattern: 'alternative' | 'repeating' | 'custom';
  count: number;
  timestamp: string;
  photoUrl: string | null;
  isProved: boolean;
}

export interface CollectionItem {
  id: string;
  angelNumber: string;
  title: string;
  pattern: 'alternative' | 'repeating' | 'custom';
  discoveredAt: string;
  rarity: 'common' | 'rare' | 'legendary';
  totalOccurrences: number;
  provedSightings: number;
}

export interface StatisticEntry {
  date: string;
  totalSightings: number;
  uniqueNumbers: number;
  mostFrequentNumber: string;
  mostFrequentCount: number;
  provedSightings: number;
}

// Data processors
const processRecordsForList = (records: DBRecord[]): ProcessedRecord[] => {
  return records.map(record => ({
    id: record.id,
    angelNumber: record.angel_number,
    title: record.title,
    description: record.description,
    pattern: record.pattern,
    count: record.count,
    timestamp: record.created_at,
    photoUrl: record.photo_url,
    isProved: record.is_proved,
  }));
};

const processRecordsForCollection = (records: DBRecord[]): CollectionItem[] => {
  // Group numbers and count their frequency
  const numberFrequency = records.reduce((acc, record) => {
    if (!acc[record.angel_number]) {
      acc[record.angel_number] = {
        count: 0,
        provedCount: 0,
        title: record.title,
        pattern: record.pattern,
        firstSeen: record.created_at,
      };
    }
    acc[record.angel_number].count += record.count;
    if (record.is_proved) {
      acc[record.angel_number].provedCount += record.count;
    }
    if (new Date(record.created_at) < new Date(acc[record.angel_number].firstSeen)) {
      acc[record.angel_number].firstSeen = record.created_at;
    }
    return acc;
  }, {} as Record<string, { 
    count: number; 
    provedCount: number;
    title: string; 
    pattern: 'alternative' | 'repeating' | 'custom'; 
    firstSeen: string; 
  }>);

  // Convert to collection items
  return Object.entries(numberFrequency).map(([number, data], index) => ({
    id: index.toString(),
    angelNumber: number,
    title: data.title,
    pattern: data.pattern,
    discoveredAt: data.firstSeen,
    rarity: data.count <= 5 ? 'legendary' : data.count <= 15 ? 'rare' : 'common',
    totalOccurrences: data.count,
    provedSightings: data.provedCount,
  }));
};

const processRecordsForStatistics = (records: DBRecord[]): StatisticEntry[] => {
  // Group records by date
  const groupedByDate = records.reduce((acc, record) => {
    const date = record.created_at.split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        numbers: new Map<string, number>(),
        totalSightings: 0,
        provedSightings: 0,
      };
    }
    const currentCount = acc[date].numbers.get(record.angel_number) || 0;
    acc[date].numbers.set(record.angel_number, currentCount + record.count);
    acc[date].totalSightings += record.count;
    if (record.is_proved) {
      acc[date].provedSightings += record.count;
    }
    return acc;
  }, {} as Record<string, { 
    numbers: Map<string, number>; 
    totalSightings: number;
    provedSightings: number;
  }>);

  // Convert to statistics entries
  return Object.entries(groupedByDate).map(([date, data]) => {
    let mostFrequentNumber = '';
    let mostFrequentCount = 0;
    
    data.numbers.forEach((count, number) => {
      if (count > mostFrequentCount) {
        mostFrequentCount = count;
        mostFrequentNumber = number;
      }
    });

    return {
      date,
      totalSightings: data.totalSightings,
      uniqueNumbers: data.numbers.size,
      mostFrequentNumber,
      mostFrequentCount,
      provedSightings: data.provedSightings,
    };
  });
};

// Export processed mock data
export const mockData = {
  // Raw data
  records: dbRecords,
  
  // Processed views
  processedViews: {
    recordsList: processRecordsForList(dbRecords),
    collection: processRecordsForCollection(dbRecords),
    statistics: processRecordsForStatistics(dbRecords),
  }
} as const;