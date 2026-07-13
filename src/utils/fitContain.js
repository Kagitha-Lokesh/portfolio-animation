/**
 * Calculates the bounding box to render an image centered with "object-fit: contain" rules.
 * 
 * @param {number} containerWidth - The width of the container canvas
 * @param {number} containerHeight - The height of the container canvas
 * @param {number} imageWidth - The intrinsic width of the image
 * @param {number} imageHeight - The intrinsic height of the image
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function fitContain(containerWidth, containerHeight, imageWidth, imageHeight) {
  const containerRatio = containerWidth / containerHeight;
  const imageRatio = imageWidth / imageHeight;

  let drawWidth = containerWidth;
  let drawHeight = containerHeight;

  if (imageRatio > containerRatio) {
    // Image is wider relative to its height than the container
    drawHeight = containerWidth / imageRatio;
  } else {
    // Image is taller relative to its width than the container
    drawWidth = containerHeight * imageRatio;
  }

  const x = (containerWidth - drawWidth) / 2;
  const y = (containerHeight - drawHeight) / 2;

  return { x, y, width: drawWidth, height: drawHeight };
}
