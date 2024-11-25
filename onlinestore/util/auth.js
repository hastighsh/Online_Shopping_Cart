import jwt from 'jsonwebtoken';


//Verifys and decodes token to get info. Typically user details (like email).
export function verifyToken(token) {
  if (!token) {
    throw new Error('Token is required');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}


//Checks boolean isAdmin property to check for admin priviliges. Returns decoded token.
export function isAdmin(token) {
  const decoded = verifyToken(token);
  if (!decoded.isAdmin) {
    throw new Error('Forbidden');
  }
  return decoded;
}