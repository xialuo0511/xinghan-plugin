/**
 * 工具函数模块
 */

import https from 'https'
import http from 'http'
import { createCanvas, loadImage } from '@napi-rs/canvas'

/**
 * 下载 QQ 用户头像
 * @param {string} userId - QQ号
 * @param {number} size - 头像尺寸 (40, 100, 140, 640)
 * @returns {Promise<Buffer>} 头像图片 Buffer
 */
export function FetchAvatar(userId, size = 640) {
    return new Promise((resolve, reject) => {
        const url = `https://q1.qlogo.cn/g?b=qq&nk=${userId}&s=${size}`

        https.get(url, (res) => {
            // 处理重定向
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const redirectUrl = res.headers.location
                const protocol = redirectUrl.startsWith('https') ? https : http
                protocol.get(redirectUrl, (redirectRes) => {
                    const chunks = []
                    redirectRes.on('data', chunk => chunks.push(chunk))
                    redirectRes.on('end', () => resolve(Buffer.concat(chunks)))
                    redirectRes.on('error', reject)
                }).on('error', reject)
                return
            }

            const chunks = []
            res.on('data', chunk => chunks.push(chunk))
            res.on('end', () => resolve(Buffer.concat(chunks)))
            res.on('error', reject)
        }).on('error', reject)
    })
}

/**
 * 将图像裁剪为圆形（高清版本）
 * @param {Image} image - 图像对象
 * @param {number} size - 输出尺寸
 * @returns {Canvas} 圆形头像画布
 */
export function MakeCircleAvatar(image, size) {
    // 使用2倍分辨率绘制以获得更好的抗锯齿效果
    const scale = 2
    const scaledSize = size * scale
    const canvas = createCanvas(scaledSize, scaledSize)
    const ctx = canvas.getContext('2d')

    // 启用高质量图像平滑
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // 创建圆形裁剪路径
    ctx.beginPath()
    ctx.arc(scaledSize / 2, scaledSize / 2, scaledSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    // 绘制高分辨率图像
    ctx.drawImage(image, 0, 0, scaledSize, scaledSize)

    // 缩放回目标尺寸
    const outputCanvas = createCanvas(size, size)
    const outputCtx = outputCanvas.getContext('2d')
    outputCtx.imageSmoothingEnabled = true
    outputCtx.imageSmoothingQuality = 'high'
    outputCtx.drawImage(canvas, 0, 0, size, size)

    return outputCanvas
}

/**
 * 从消息中获取被 @ 的用户 ID
 * @param {object} e - 消息事件对象
 * @returns {string|null} 被 @ 用户的 ID，如果没有则返回 null
 */
export function GetAtTarget(e) {
    if (e.at) {
        return String(e.at)
    }

    // 尝试从消息中解析
    if (e.message) {
        for (const msg of e.message) {
            if (msg.type === 'at' && msg.qq) {
                return String(msg.qq)
            }
        }
    }

    return null
}

/**
 * 加载本地图片
 * @param {string} filePath - 图片路径
 * @returns {Promise<Image>} 图像对象
 */
export async function LoadLocalImage(filePath) {
    return await loadImage(filePath)
}
