export const fetchSheetData = async (sheetId, tabName, apiKey) => {
  const url =
    'https://sheets.googleapis.com/v4/spreadsheets/' +
    sheetId +
    '/values/' +
    tabName +
    '?alt=json&key=' +
    apiKey
  const response = await fetch(url)
  return response.json()
}
