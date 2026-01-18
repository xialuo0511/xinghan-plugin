// 检查 PNG 文件是否有透明通道
import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkTransparency() {
    const templatePath = path.join(__dirname, 'resources/petpet/tom_door');
    const frame0 = path.join(templatePath, '0.png');

    try {
        const img = await loadImage(frame0);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        let totalPixels = img.width * img.height;
        let transparentPixels = 0;
        let semiTransparentPixels = 0;
        let blackPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a === 0) {
                transparentPixels++;
            } else if (a < 255) {
                semiTransparentPixels++;
            }

            if (r < 20 && g < 20 && b < 20 && a === 255) {
                blackPixels++;
            }
        }

        console.log(`图片尺寸: ${img.width}x${img.height}`);
        console.log(`总像素数: ${totalPixels}`);
        console.log(`完全透明像素: ${transparentPixels} (${(transparentPixels / totalPixels * 100).toFixed(2)}%)`);
        console.log(`半透明像素: ${semiTransparentPixels} (${(semiTransparentPixels / totalPixels * 100).toFixed(2)}%)`);
        console.log(`黑色不透明像素: ${blackPixels} (${(blackPixels / totalPixels * 100).toFixed(2)}%)`);

        // 检查中心区域（门洞）的透明度
        const centerX = Math.floor(img.width / 2);
        const centerY = Math.floor(img.height / 2);
        const centerIdx = (centerY * img.width + centerX) * 4;
        console.log(`\n中心点 (${centerX}, ${centerY}) 颜色: R=${data[centerIdx]}, G=${data[centerIdx + 1]}, B=${data[centerIdx + 2]}, A=${data[centerIdx + 3]}`);

    } catch (err) {
        console.error('检查失败:', err);
    }
}

checkTransparency();
