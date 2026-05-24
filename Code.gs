function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .openById('1ZAg9lunpGKTGUAQgbYKJKepI_Ls8KxvMxw5Mz-a_DFg')
      .getActiveSheet();

    // Add header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Side', 'Phone', 'Attendance', 'Guests', 'Dietary']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date().toLocaleString('en-GB'),
      data.name,
      data.side === 'bride' ? "Bride's Side" : "Groom's Side",
      data.phone      || '—',
      data.attendance === 'yes' ? '✅ Accepts' : '❌ Declines',
      data.guests,
      data.dietary    || '—',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
