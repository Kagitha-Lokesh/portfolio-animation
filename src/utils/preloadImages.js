/**
 * Extracts the last numeric sequence from a string to sort numerically.
 * @param {string} path 
 * @returns {number}
 */
const getFrameNumber = (path) => {
  const matches = path.match(/\d+/g);
  return matches ? parseInt(matches[matches.length - 1], 10) : 0;
};

/**
 * Loads a single image using createImageBitmap if supported, falling back to img.decode() or basic onload.
 * @param {string} url 
 * @returns {Promise<ImageBitmap|HTMLImageElement>}
 */
async function loadImage(url) {
  if (typeof window.createImageBitmap === 'function') {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      return await createImageBitmap(blob);
    } catch (error) {
      console.warn(`createImageBitmap failed for ${url}, falling back to Image.decode()`, error);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;

    const handleResolve = () => {
      if (typeof img.decode === 'function') {
        img.decode()
          .then(() => resolve(img))
          .catch((err) => {
            console.warn(`img.decode failed for ${url}, resolving on onload fallback`, err);
            resolve(img);
          });
      } else {
        resolve(img);
      }
    };

    if (img.complete) {
      handleResolve();
    } else {
      img.onload = handleResolve;
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    }
  });
}

/**
 * Discovers and preloads all image assets from /public/frames directory.
 * Reports progress via callback.
 * 
 * @param {function(number, number)} onProgress - Callback receiving (loadedCount, totalCount)
 * @returns {Promise<Array<ImageBitmap|HTMLImageElement>>}
 */
export async function preloadImages(onProgress) {
  // Vite-specific dynamic discovery of all images in public/frames
  const modules = import.meta.glob('/public/frames/*.{jpg,jpeg,png,webp,svg}', { eager: true });
  const paths = Object.keys(modules)
    .map((path) => path.replace('/public', ''))
    .sort((a, b) => getFrameNumber(a) - getFrameNumber(b));

  if (paths.length === 0) {
    throw new Error('No images found in the public/frames directory.');
  }

  const total = paths.length;
  let loaded = 0;

  const promises = paths.map(async (url) => {
    try {
      const img = await loadImage(url);
      loaded += 1;
      if (typeof onProgress === 'function') {
        onProgress(loaded, total);
      }
      return img;
    } catch (err) {
      console.error(`Failed to preload image: ${url}`, err);
      throw err;
    }
  });

  return Promise.all(promises);
}
