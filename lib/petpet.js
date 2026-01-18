/**
 * Petpet GIF 生成核心模块
 */

import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import GIFEncoder from 'gif-encoder-2'
import { fileURLToPath } from 'url'
import { FetchAvatar, MakeCircleAvatar } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 资源目录
const RESOURCES_PATH = path.join(__dirname, '..', 'resources', 'petpet')

/**
 * 获取所有可用的模板
 * @returns {Map<string, object>} 模板映射 (别名 -> 模板信息)
 */
export function GetTemplates() {
    const templates = new Map()

    if (!fs.existsSync(RESOURCES_PATH)) {
        return templates
    }

    const dirs = fs.readdirSync(RESOURCES_PATH, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    for (const dir of dirs) {
        const dataPath = path.join(RESOURCES_PATH, dir, 'data.json')
        if (fs.existsSync(dataPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
                const templateInfo = {
                    id: dir,
                    path: path.join(RESOURCES_PATH, dir),
                    ...data
                }

                // 使用模板ID作为主键
                templates.set(dir, templateInfo)

                // 使用别名作为额外的键
                if (data.alias && Array.isArray(data.alias)) {
                    for (const alias of data.alias) {
                        templates.set(alias.toLowerCase(), templateInfo)
                    }
                }
            } catch (err) {
                logger.error(`[星瀚插件] 加载模板 ${dir} 失败:`, err)
            }
        }
    }

    return templates
}

/**
 * 生成 Petpet GIF
 * @param {string} templateId - 模板ID或别名
 * @param {string} fromUserId - 发送者用户ID
 * @param {string} toUserId - 目标用户ID（被@的用户）
 * @returns {Promise<Buffer>} GIF 图片 Buffer
 */
export async function GeneratePetpet(templateId, fromUserId, toUserId) {
    const templates = GetTemplates()
    const template = templates.get(templateId.toLowerCase())

    if (!template) {
        throw new Error(`未找到模板: ${templateId}`)
    }

    // 下载头像
    const avatars = {}

    if (template.avatar) {
        for (const avatarConfig of template.avatar) {
            const type = avatarConfig.type.toUpperCase()
            let userId

            if (type === 'FROM') {
                userId = fromUserId
            } else if (type === 'TO') {
                userId = toUserId
            } else {
                continue
            }

            if (!avatars[type]) {
                try {
                    const avatarBuffer = await FetchAvatar(userId)
                    avatars[type] = await loadImage(avatarBuffer)
                } catch (err) {
                    logger.error(`[星瀚插件] 下载头像失败 (${userId}):`, err)
                    throw new Error('下载头像失败')
                }
            }
        }
    }

    // 加载背景帧
    const frames = []
    let frameIndex = 0

    while (true) {
        const framePath = path.join(template.path, `${frameIndex}.png`)
        if (!fs.existsSync(framePath)) {
            break
        }
        frames.push(await loadImage(framePath))
        frameIndex++
    }

    if (frames.length === 0) {
        throw new Error(`模板 ${templateId} 没有帧图片`)
    }

    // 获取画布尺寸
    const width = frames[0].width
    const height = frames[0].height

    // 透明标记色 (使用纯品红 R=255, G=0, B=255，这个颜色在表情包中极少出现)
    const TRANSPARENT_R = 255
    const TRANSPARENT_G = 0
    const TRANSPARENT_B = 255

    // 创建 GIF 编码器 - 使用 octree 算法更精确保留特定颜色
    const encoder = new GIFEncoder(width, height, 'octree', true)
    encoder.setDelay(template.delay || 60)
    encoder.setRepeat(0)
    // 设置透明标记色 (品红)
    encoder.setTransparent(0xFF00FF)
    encoder.start()

    // 渲染每一帧
    for (let i = 0; i < frames.length; i++) {
        // 第一步：在透明画布上渲染内容
        const transparentCanvas = createCanvas(width, height)
        const transparentCtx = transparentCanvas.getContext('2d')

        transparentCtx.imageSmoothingEnabled = true
        transparentCtx.imageSmoothingQuality = 'high'
        transparentCtx.clearRect(0, 0, width, height)

        /**
         * 绘制头像的辅助函数
         * @param {object} avatarConfig 
         */
        const drawAvatar = (avatarConfig) => {
            const type = avatarConfig.type.toUpperCase()
            const avatar = avatars[type]

            if (!avatar) return

            let pos
            if (Array.isArray(avatarConfig.pos[0])) {
                pos = avatarConfig.pos[i % avatarConfig.pos.length]
            } else {
                pos = avatarConfig.pos
            }

            const [x, y, w, h] = pos

            transparentCtx.save()
            if (avatarConfig.rotate) {
                const angle = (2 * Math.PI * i) / frames.length
                transparentCtx.translate(x + w / 2, y + h / 2)
                transparentCtx.rotate(angle)
                transparentCtx.translate(-(x + w / 2), -(y + h / 2))
            }

            const drawImg = (img, dx, dy, dw, dh) => {
                if (avatarConfig.round !== false) {
                    const circleCanvas = MakeCircleAvatar(img, Math.max(dw, dh))
                    transparentCtx.drawImage(circleCanvas, dx, dy, dw, dh)
                } else {
                    transparentCtx.drawImage(img, dx, dy, dw, dh)
                }
            }

            drawImg(avatar, x, y, w, h)
            transparentCtx.restore()
        }

        // 绘制底层头像
        if (template.avatar) {
            for (const avatarConfig of template.avatar) {
                if (!avatarConfig.avatarOnTop) {
                    drawAvatar(avatarConfig)
                }
            }
        }

        // 绘制背景帧
        transparentCtx.drawImage(frames[i], 0, 0)

        // 绘制顶层头像
        if (template.avatar) {
            for (const avatarConfig of template.avatar) {
                if (avatarConfig.avatarOnTop) {
                    drawAvatar(avatarConfig)
                }
            }
        }

        // 第二步：创建最终画布，将透明像素替换为标记色
        const finalCanvas = createCanvas(width, height)
        const finalCtx = finalCanvas.getContext('2d')

        // 先填充标记色作为背景
        finalCtx.fillStyle = `rgb(${TRANSPARENT_R}, ${TRANSPARENT_G}, ${TRANSPARENT_B})`
        finalCtx.fillRect(0, 0, width, height)

        // 将透明画布绘制到最终画布上（透明区域会保留标记色）
        finalCtx.drawImage(transparentCanvas, 0, 0)

        // 添加帧到 GIF
        encoder.addFrame(finalCtx)
    }

    encoder.finish()
    return encoder.out.getData()
}

/**
 * 获取所有模板的帮助信息
 * @returns {Array<object>} 模板信息数组
 */
export function GetTemplateHelp() {
    const templates = GetTemplates()
    const seen = new Set()
    const result = []

    for (const [key, template] of templates) {
        if (seen.has(template.id)) continue
        seen.add(template.id)

        result.push({
            id: template.id,
            alias: template.alias || [],
            description: template.description || ''
        })
    }

    return result
}
