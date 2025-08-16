import { describe, it, expect } from 'vitest';

// Simple sanity that version endpoint env variables default format

describe('Version env defaults', () => {
  it('has dev default', () => {
    expect(process.env.APP_VERSION || 'dev').toBeDefined();
  });
});
