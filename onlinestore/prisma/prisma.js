import { PrismaClient } from '@prisma/client';

const prismaOptions = {
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
};

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient(prismaOptions);
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient(prismaOptions);
    }

    prisma = global.prisma;
    prisma.$on('query', (e) => {
        console.log('Query: ' + e.query);
        console.log('Param: ' + e.params);
    });
}

export default prisma;