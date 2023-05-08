// this function retreives only the image file name 
export function getFileName(path) {
  // Split the path string by the forward slash separator
  const parts = path.split('/');
  // Get the last part of the split path, which should be the filename
  const filename = parts[parts.length - 1];
  return filename;
}