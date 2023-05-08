//
export function convertPath(path) {
  return path.replace(/\\/g, '/').replace(/ /g, '%20');
}

//