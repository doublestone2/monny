import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { applicant, diagnosis, privacyAgreed, source } = body || {};

    if (!applicant?.name || !applicant?.phone) {
      return NextResponse.json(
        { ok: false, message: '이름과 연락처는 필수입니다.' },
        { status: 400 }
      );
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return NextResponse.json(
        { ok: false, message: 'Google Sheets 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const row = [
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      applicant.name,
      applicant.phone,
      diagnosis?.damageType || '',
      diagnosis?.pressureLevel || '',
      diagnosis?.loanAmount || 0,
      diagnosis?.repaidAmount || 0,
      diagnosis?.evidence || '',
      diagnosis?.spreadDamage || '',
      (diagnosis?.actionItems || []).join(', '),
      diagnosis?.urgency || '',
      diagnosis?.summary || '',
      source || 'unknown',
      privacyAgreed ? '동의' : '미동의',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:N',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('consultation api error', error);
    return NextResponse.json(
      { ok: false, message: '상담 접수 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
