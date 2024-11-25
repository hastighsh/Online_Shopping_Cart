import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  if (!token) {
    throw new Error('Token is required');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function isAdmin(token) {
  const decoded = verifyToken(token);
  if (!decoded.isAdmin) {
    throw new Error('Forbidden');
  }
  return decoded;
}