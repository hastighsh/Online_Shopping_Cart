import prisma from "@/prisma/prisma"

export async function POST(request) {
    const result = await prisma.user.findUnique({
        select: {
            email: request.body.email,
            password: request.body.password
        }
    })
    return Response.json(result)
}