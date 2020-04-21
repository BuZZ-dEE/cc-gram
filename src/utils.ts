import { FilterSetting } from './filters';

/**
 * Parse setting to style
 * @param {FilterSetting} setting - The filter setting
 */
export const parseSettingToStyle = (setting: FilterSetting | undefined): string => {
  if (!setting) return 'none';

  return Object
    .keys(setting)
    .map((key): string => `${key}(${setting[key]}${
      key === 'hue-rotate'
        ? 'deg'
        : key === 'blur'
          ? 'px'
          : ''
    })`)
    .join(' ');
};

/**
 * Create filter image canvas
 * @param {HTMLImageElement['src']} src - The src of image
 * @param {string} filterStyle - The filter style
 */
export const createFilterImageCanvas = (
  src: HTMLImageElement['src'],
  filterStyle: string,
): Promise<HTMLCanvasElement> => new Promise((resolve, reject): void => {
  const image = new Image();

  image.onload = (): void => {
    const { width, height } = image;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return reject(new Error('The 2d context canvas is not supported.'));

    ctx.filter = filterStyle;
    ctx.drawImage(image, 0, 0);

    return resolve(canvas);
  };

  image.onerror = reject;

  image.crossOrigin = 'anonymous';
  image.src = src;
});
