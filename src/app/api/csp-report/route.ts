import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const report = await request.json();
  
  // Log CSP violations for monitoring
  console.error('CSP Violation:', {
    blockedUri: report['csp-report']?.['blocked-uri'],
    violatedDirective: report['csp-report']?.['violated-directive'],
    originalPolicy: report['csp-report']?.['original-policy'],
    documentUri: report['csp-report']?.['document-uri'],
  });

  return NextResponse.json({ status: 'logged' });
}

// Allow OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
