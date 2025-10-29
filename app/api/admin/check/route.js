import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ isAdmin: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ isAdmin: true });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
