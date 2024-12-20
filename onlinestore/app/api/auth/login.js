import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export async function POST(request) {
  try {
    // Parse the request body as JSON
    const { email, password } = await request.json();

    // Find the user by email, case sensitive
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate a JWT token
    const token = sign(
        { userId: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Send the token back to the client
    const headers = new Headers();
    headers.append(
        'Set-Cookie',
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
    );

    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}