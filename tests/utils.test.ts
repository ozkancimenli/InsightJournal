import { describe, it, expect } from 'vitest';
import { moodToEmoji, moodToColor, cn } from '@/lib/utils';

describe('utils', () => {
  it('moodToEmoji returns stable emojis', () => {
    expect(moodToEmoji('Calm')).toBe('😌');
    expect(moodToEmoji('Hopeful')).toBe('🌤️');
  });

  it('moodToColor returns gradient classes', () => {
    expect(moodToColor('Stressed')).toContain('from-red');
  });

  it('cn merges classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });
});


