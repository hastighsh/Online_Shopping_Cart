// app/api/auth/login/route.js

import prisma from '@/prisma/prisma';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const {email, password} = await request.json();

    // Find the user by email
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
      return new Response(JSON.stringify({error: 'Invalid email or password'}), {
        status: 401,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({error: 'Invalid email or password'}), {
        status: 401,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Generate a JWT token with the user's email
    const token = sign(
        {userId: user.id, email: user.email, isAdmin: user.isAdmin},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

    // initialize headers
    const headers = new Headers();
    headers.append(
        'Set-Cookie',
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
    );

    // send token and isAdmin status back to client
    return new Response(
        JSON.stringify({token, isAdmin: user.isAdmin, message: 'Login successful'}),
        {
          status: 200,
          headers,
        }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({error: 'Something went wrong.'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
