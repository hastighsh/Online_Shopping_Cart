import prisma from "@/prisma/prisma"

export async function GET(request) {
    const result = await prisma.user.findMany({})
    return Response.json(result)
}