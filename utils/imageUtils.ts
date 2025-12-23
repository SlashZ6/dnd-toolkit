
/**
 * Compresses and resizes a base64 image string.
 * @param base64Str The source base64 string.
 * @param maxWidth The maximum width for the output image.
 * @param quality The JPEG quality (0 to 1).
 * @returns A Promise resolving to the compressed base64 string.
 */
export const compressImage = (base64Str: string, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
        if (!base64Str || !base64Str.startsWith('data:image')) {
            resolve(base64Str); // Return original if invalid or empty
            return;
        }

        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Convert to JPEG for better compression than PNG for photos/art
                resolve(canvas.toDataURL('image/jpeg', quality));
            } else {
                resolve(base64Str); // Fallback
            }
        };
        img.onerror = () => resolve(base64Str); // Fallback
    });
};
