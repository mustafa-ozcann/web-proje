// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminExists = await prisma.user.findUnique({
        where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('Admin oluşturuldu.');
    } else {
        console.log('Admin zaten var.');
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });
