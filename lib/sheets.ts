import { google } from "googleapis";

type LeadRow = {
  niche: string;
  subNiche: string;
  businessName: string;
  ownerName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  source: string;
};

const spreadsheetId = "1f11p1H19o4ey7O6t-18H1AXKYJP6YSJav9pk_JTFw8o";

export async function appendLeadToSheet(row: LeadRow) {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) return;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Leads!A:I",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          row.niche,
          row.subNiche,
          row.businessName,
          row.ownerName ?? "",
          row.email ?? "",
          row.phone ?? "",
          row.website ?? "",
          row.address ?? "",
          row.source
        ]
      ]
    }
  });
}
