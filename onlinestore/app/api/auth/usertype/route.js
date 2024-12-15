// app/api/auth/usertype/route.js

import prisma from '@/prisma/prisma';

export async function POST(request) {
  try {

    const {email} = await request.json();

    // Find the user by email
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
      return new Response(JSON.stringify({error: 'Invalid email or password'}), {
        status: 401,
        headers: {'Content-Type': 'application/json'},
      });
    }
    // Returns status of if user is an admin
    return new Response(
      JSON.stringify({isAdmin: user.isAdmin }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error finding user:', error);
    return new Response(JSON.stringify({error: 'Something went wrong.'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
