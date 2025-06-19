// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

async function main() {
    try {
        console.log('Seed başlatılıyor...');
        
        // Önce tüm kullanıcıları temizle
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [ADMIN_EMAIL, 'test@example.com']
                }
            }
        });
        console.log('Eski kullanıcılar temizlendi');

        // Admin kullanıcısını oluştur
        console.log('Admin kullanıcısı oluşturuluyor...');
        const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);
        
        const admin = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: ADMIN_EMAIL.toLowerCase(),
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('Admin oluşturuldu:', { id: admin.id, email: admin.email });

        // Test kullanıcısı oluştur
        console.log('Test kullanıcısı oluşturuluyor...');
        const testHashedPassword = await bcryptjs.hash('test123', 10);
        const testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                password: testHashedPassword,
                role: 'USER',
            },
        });
        console.log('Test kullanıcısı oluşturuldu:', { id: testUser.id, email: testUser.email });

        // Oluşturulan kullanıcıları kontrol et
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                password: true
            }
        });
        console.log('Mevcut kullanıcılar:', users);

        console.log('Seed tamamlandı!');
    } catch (error) {
        console.error('Seed hatası:', error);
        throw error;
    }
}

main()
    .then(async () => {
        console.log('Veritabanı bağlantısı kapatılıyor...');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Seed hatası:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
