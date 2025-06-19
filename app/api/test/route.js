import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    console.log('Test API çağrıldı');
    
    // Basit bir count sorgusu
    const userCount = await prisma.user.count();
    console.log('Kullanıcı sayısı:', userCount);
    
    // Tüm kullanıcıları getir
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
    
    console.log('Kullanıcılar:', users);
    
    return NextResponse.json({ 
      success: true,
      userCount,
      users
    });
    
  } catch (error) {
    console.error('Test API hatası:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 