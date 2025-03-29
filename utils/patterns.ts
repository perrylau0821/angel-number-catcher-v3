export function getPatternLabel(pattern: 'alternative' | 'repeating' | 'custom') {
  switch (pattern) {
    case 'alternative':
      return 'Alternative Pattern';
    case 'repeating':
      return 'Repeating Pattern';
    case 'custom':
      return 'Custom Pattern';
  }
}