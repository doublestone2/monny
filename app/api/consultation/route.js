import { google } from "googleapis";
import { NextResponse } from "next/server";

function toMultiline(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join("\n");
  }
  return value || "";
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { applicant, diagnosis, privacyAgreed, source } = body || {};

    if (!applicant?.name || !applicant?.phone) {
      return NextResponse.json(
        { ok: false, message: "이름과 연락처는 필수입니다." },
        { status: 400 }
      );
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1";

    const missing = [];
    if (!clientEmail) missing.push("GOOGLE_CLIENT_EMAIL");
    if (!privateKeyRaw) missing.push("GOOGLE_PRIVATE_KEY");
    if (!spreadsheetId) missing.push("GOOGLE_SHEETS_SPREADSHEET_ID");

    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `누락된 환경변수: ${missing.join(", ")}`,
        },
        { status: 500 }
      );
    }

    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // A ~ I 열까지만 저장
    const row = [
      new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }), // A 접수일시
      applicant.name || "",                                           // B 이름
      applicant.phone || "",                                          // C 연락처
      toMultiline(diagnosis?.pressureLevels),                         // D 추심강도
      diagnosis?.loanAmount || 0,                                     // E 대여원금
      diagnosis?.repaidAmount || 0,                                   // F 상환총액
      toMultiline(diagnosis?.evidenceItems),                          // G 증거보유
      diagnosis?.spreadDamage || "",                                  // H 주변인피해
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:I`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("consultation api error", error);

    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "상담 접수 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}