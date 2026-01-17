/**
 * 管理指令模块
 */

import plugin from '../../../lib/plugins/plugin.js'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { GetTemplateHelp } from '../lib/petpet.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginPath = path.join(__dirname, '..')

// 尝试导入重启模块
let Restart = null
try {
    Restart = (await import('../../other/restart.js').catch(() => null))?.Restart
    Restart ||= (await import('../../system/apps/restart.ts').catch(() => null))?.Restart
} catch {
    logger.warn('[星瀚插件] 未获取到重启模块，更新后需手动重启')
}

// 是否正在更新中
let updating = false

export default class AdminApp extends plugin {
    constructor() {
        super({
            name: '星瀚管理',
            dsc: '星瀚插件管理功能',
            event: 'message',
            priority: 500,
            rule: [
                {
                    reg: '^#?星瀚帮助$',
                    fnc: 'help'
                },
                {
                    reg: '^#?(星瀚)?(强制)?更新$',
                    fnc: 'update'
                }
            ]
        })
    }

    /** 帮助指令 */
    async help(e) {
        const templates = GetTemplateHelp()

        // 读取 HTML 和 CSS 模板
        const htmlPath = path.join(__dirname, '..', 'resources', 'html', 'help', 'help.html')
        const cssPath = path.join(__dirname, '..', 'resources', 'html', 'help', 'help.css')

        let html = fs.readFileSync(htmlPath, 'utf-8')
        const css = fs.readFileSync(cssPath, 'utf-8')

        // 生成表情包卡片 HTML
        let stickersHtml = ''
        for (const template of templates) {
            const aliases = template.alias.slice(0, 4).join('、')
            stickersHtml += `
                <div class="sticker-card">
                    <div class="sticker-cmd">#${template.alias[0] || template.id}</div>
                    ${aliases ? `<div class="sticker-aliases">${aliases}</div>` : ''}
                    ${template.description ? `<div class="sticker-desc">${template.description}</div>` : ''}
                </div>
            `
        }

        // 替换模板变量
        html = html.replace('{{stickers}}', stickersHtml)

        // 将 CSS 内联到 HTML（替换外部 CSS 链接）
        html = html.replace('<link rel="stylesheet" href="./help.css">', `<style>${css}</style>`)

        // 使用 puppeteer 截图
        const img = await puppeteer.screenshot('星瀚帮助', {
            html: html,
            fileID: 'xinghan-help',
            modelName: 'xinghan',
            SOptions: {
                type: 'png',
                quality: 100
            }
        })

        await e.reply(img)
        return true
    }

    /** 更新插件 */
    async update(e) {
        // 检查是否为管理员
        if (!e.isMaster) {
            await e.reply('只有管理员才能更新插件哦~')
            return false
        }

        // 检查是否正在更新中
        if (updating) {
            await e.reply('已有更新任务进行中，请稍候...')
            return false
        }

        const isForce = e.msg.includes('强制')

        if (isForce) {
            await e.reply('正在执行强制更新，请稍候...')
        } else {
            await e.reply('正在检查更新，请稍候...')
        }

        updating = true
        let needRestart = false

        try {
            // 构建更新命令
            let command = 'git pull --no-rebase'
            if (isForce) {
                command = 'git fetch --all && git reset --hard origin/main'
            }

            // 执行 git pull
            const { stdout, stderr } = await execAsync(command, {
                cwd: pluginPath
            })

            let msg = '【星瀚插件更新】\n'

            if (stdout.includes('Already up to date') || stdout.includes('已经是最新')) {
                msg += '✅ 当前已是最新版本'
                await e.reply(msg)
            } else {
                msg += '✅ 更新成功！\n'

                // 提取更新信息
                const filesChanged = stdout.match(/(\d+) files? changed/)
                if (filesChanged) {
                    msg += `📦 更新了 ${filesChanged[1]} 个文件\n`
                }

                // 检查是否有依赖更新
                if (stdout.includes('package.json')) {
                    msg += '\n⚠️ 检测到依赖更新，正在安装...\n'
                    try {
                        await execAsync('pnpm install', { cwd: pluginPath })
                        msg += '✅ 依赖安装完成\n'
                    } catch (installErr) {
                        msg += '❌ 依赖安装失败，请手动执行 pnpm install\n'
                    }
                }

                needRestart = true

                if (Restart) {
                    msg += '\n🔄 即将自动重启...'
                } else {
                    msg += '\n💡 请手动重启 Yunzai 以应用更新'
                }

                await e.reply(msg)
            }
        } catch (err) {
            logger.error('[星瀚插件] 更新失败:', err)
            await e.reply(`❌ 更新失败: ${err.message}`)
        } finally {
            updating = false
        }

        // 需要重启且有重启模块
        if (needRestart && Restart) {
            setTimeout(() => {
                new Restart(e).restart()
            }, 2000)
        }

        return true
    }
}
