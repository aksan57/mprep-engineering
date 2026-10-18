/**
 * MPrep Engineering — log quote-form inquiries to a Google Sheet.
 *
 * The website POSTs each valid inquiry here (fire-and-forget, alongside the FormSubmit email) when
 * NEXT_PUBLIC_SHEET_ENDPOINT is set. Each inquiry becomes one row on the "Inquiries" tab.
 *
 * SETUP
 *  1. Create a Google Sheet (any name).
 *  2. In the sheet: Extensions → Apps Script. Delete the sample code and paste this whole file. Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Click Deploy and authorise when asked.
 *  4. Copy the Web app URL (it ends in /exec).
 *  5. In Vercel: Project → Settings → Environment Variables → add
 *       NEXT_PUBLIC_SHEET_ENDPOINT = <the /exec URL>
 *  6. Redeploy the site (NEXT_PUBLIC_ variables are baked in at build time).
 *
 * EDITING THIS SCRIPT LATER
 *  Saving is not enough. Use Deploy → Manage deployments → (pencil) Edit → Version: "New version" → Deploy.
 *  That keeps the same /exec URL. Creating a *new deployment* instead gives a new URL, which would then
 *  need updating in Vercel.
 *
 * The "Inquiries" tab is created on first use with a bold, frozen header row. The "Status" column
 * starts as "New" — change it by hand (e.g. Replied, Quoted, Won, Lost) to track follow-up.
 */

var SHEET_NAME = 'Inquiries';
var HEADERS = ['Received', 'Status', 'Name', 'Company', 'Email', 'Service', 'Timeline', 'Budget',
  'Reference link', 'Project description', 'Files', 'Page'];
var MAX_CELL = 5000;

function doPost(e) {
  var p = (e && e.parameter) || {};
  // Ignore anything that isn't a real inquiry (the site always sends these three).
  if (!p['Name'] || !p['Email'] || !p['Project description']) return respond('ignored');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet();
    sheet.appendRow([
      new Date(), 'New',
      clean(p['Name']), clean(p['Company']), clean(p['Email']), clean(p['Service']),
      clean(p['Timeline']), clean(p['Budget']), clean(p['Reference link']),
      clean(p['Project description']), clean(p['Files']), clean(p['Page']),
    ]);
  } finally {
    lock.releaseLock();
  }
  return respond('ok');
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  }
  return sheet;
}

/** Caps length and neutralises spreadsheet formula injection (=, +, -, @, tab, CR at the start). */
function clean(v) {
  var s = String(v == null ? '' : v);
  if (s.length > MAX_CELL) s = s.slice(0, MAX_CELL);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function respond(status) {
  return ContentService.createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}
