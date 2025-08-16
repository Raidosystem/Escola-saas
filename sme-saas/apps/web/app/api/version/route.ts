import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    version: process.env.APP_VERSION || 'dev',
    buildTime: process.env.BUILD_TIME || null,
  });
}
