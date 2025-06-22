// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

async function main() {
    try {
        console.log('Seed başlatılıyor...');

        // Admin kullanıcısının var olup olmadığını kontrol et
        const existingAdmin = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL.toLowerCase() }
        });

        if (!existingAdmin) {
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
        } else {
            console.log('Admin kullanıcısı zaten mevcut:', existingAdmin.email);
        }

        // Test kullanıcısının var olup olmadığını kontrol et
        const existingTestUser = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        });

        if (!existingTestUser) {
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
        } else {
            console.log('Test kullanıcısı zaten mevcut:', existingTestUser.email);
        }

        // Kategorileri oluştur
        console.log('Kategoriler kontrol ediliyor...');
        const categories = ['Teknoloji', 'Yazılım', 'Yapay Zeka', 'Web Geliştirme', 'Mobil Uygulama', 'Oyun', 'Eğitim'];
        
        for (const categoryName of categories) {
            const existingCategory = await prisma.category.findUnique({
                where: { name: categoryName }
            });
            
            if (!existingCategory) {
                await prisma.category.create({
                    data: { name: categoryName }
                });
                console.log(`Kategori oluşturuldu: ${categoryName}`);
            } else {
                console.log(`Kategori zaten mevcut: ${categoryName}`);
            }
        }

        // Mevcut kullanıcıları listele
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                name: true
            }
        });
        console.log('Mevcut kullanıcılar:');
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - ${user.role}`);
        });

        console.log('Seed başarıyla tamamlandı!');
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
