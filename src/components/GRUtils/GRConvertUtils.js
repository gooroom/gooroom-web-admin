export const bytesToSize = (bytes, decimal = 2) => {
  if (bytes === 0) return 0;

  const kb = 1000;
  const dec = decimal < 0 ? 0 : decimal;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(kb));

  return parseFloat((bytes / Math.pow(kb, i)).toFixed(dec)) + ' ' + sizes[i];
}