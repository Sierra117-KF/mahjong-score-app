describe('Sample Test Suite', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello, Vitest!';
    expect(greeting).toContain('Vitest');
  });

  it('should work with arrays', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
  });

  it('should handle objects', () => {
    const user = { name: 'Test User', age: 25 };
    expect(user).toHaveProperty('name');
    expect(user.age).toBeGreaterThan(18);
  });
});
