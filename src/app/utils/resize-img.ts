export function resizeImg(images: any[], config: string) {
  return images.map((img: any) => {
    return {
      ...img,
      shortURL: replaceAt(img.imageURL, config),
    };
  });
}

export function replaceAt(url: string, replacement) {
  const index = url.indexOf('/upload');
  return url.slice(0, index + 7) + replacement + url.slice(index + 7);
}

