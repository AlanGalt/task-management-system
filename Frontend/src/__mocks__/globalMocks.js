jest.mock('@dicebear/core', () => ({
  createAvatar: jest.fn(() => 'Mock avatar'),
}));

jest.mock('@dicebear/collection', () => ({
  initials: jest.fn(),
}));
