import jwt from 'jsonwebtoken';

export function generateTestToken(userId: string, role: string = 'product_manager'): string {
  const payload = {
    sub: userId,
    email: `${userId}@test.com`,
    role,
    firstName: 'Test',
    lastName: 'User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret');
}

export function generateExpiredToken(userId: string): string {
  const payload = {
    sub: userId,
    email: `${userId}@test.com`,
    role: 'product_manager',
    firstName: 'Test',
    lastName: 'User',
    iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    exp: Math.floor(Date.now() / 1000) - 3600  // 1 hour ago
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret');
}

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'product_manager',
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};