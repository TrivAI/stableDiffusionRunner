export async function imgToBase64() {
  let blob = await getImage();
  let buffer = Buffer.from(await blob.text())
  return 'data:' + blob.type + ';base64,' + buffer.toString('base64');
}