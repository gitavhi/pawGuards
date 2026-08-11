export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

const MAX_IMAGE_BYTES = 250 * 1024;

function drawImageToCanvas(img, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

export function resizeImage(file, maxSize = 300, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          const ratio = Math.min(maxSize / width, maxSize / height, 1);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));

          let canvas = drawImageToCanvas(img, width, height);
          let out = canvas.toDataURL("image/jpeg", quality);

          let attempts = 0;
          while (out.length > MAX_IMAGE_BYTES && attempts < 5) {
            width = Math.max(1, Math.round(width * 0.7));
            height = Math.max(1, Math.round(height * 0.7));
            canvas = drawImageToCanvas(img, width, height);
            out = canvas.toDataURL("image/jpeg", Math.max(0.3, quality - attempts * 0.12));
            attempts++;
          }

          if (out.length > MAX_IMAGE_BYTES) {
            reject(new Error("This photo is too large to store. Please choose a smaller image."));
            return;
          }
          resolve(out);
        } catch {
          reject(new Error("Could not process the image. Please try another photo."));
        }
      };
      img.onerror = () => reject(new Error("Could not read the image file. Please try another photo."));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}
