/**
 * 管理指令模块
 */

import plugin from '../../../lib/plugins/plugin.js'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'
import { GetTemplateHelp } from '../lib/petpet.js'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginPath = path.join(__dirname, '..')

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
                    reg: '^#?星瀚更新$',
                    fnc: 'update'
                }
            ]
        })
    }

    /** 帮助指令 */
    async help(e) {
        const templates = GetTemplateHelp()

        let msg = '【星瀚插件帮助】\n'
        msg += '━━━━━━━━━━━━━━\n'
        msg += '📦 表情包指令\n'
        msg += '━━━━━━━━━━━━━━\n'

        if (templates.length > 0) {
            for (const template of templates) {
                const aliases = template.alias.slice(0, 3).join('、')
                msg += `▸ #${template.alias[0] || template.id}`
                if (aliases) {
                    msg += ` (${aliases})`
                }
                msg += '\n'
            }
        } else {
            msg += '▸ #摸头 (摸、摸摸、rua、petpet)\n'
            msg += '▸ #亲亲 (亲、kiss)\n'
            msg += '▸ #拍 (拍一拍、pat)\n'
            msg += '▸ #揉 (揉揉、rub)\n'
            msg += '▸ #贴贴 (贴、蹭、蹭蹭)\n'
        }

        msg += '\n━━━━━━━━━━━━━━\n'
        msg += '📝 使用方法\n'
        msg += '━━━━━━━━━━━━━━\n'
        msg += '▸ #摸头 - 使用自己头像\n'
        msg += '▸ #摸头 @某人 - 使用对方头像\n'

        msg += '\n━━━━━━━━━━━━━━\n'
        msg += '🔧 管理指令\n'
        msg += '━━━━━━━━━━━━━━\n'
        msg += '▸ #星瀚帮助 - 显示此帮助\n'
        msg += '▸ #星瀚更新 - 更新插件(仅管理员)\n'

        await e.reply(msg)
        return true
    }

    /** 更新插件 */
    async update(e) {
        // 检查是否为管理员
        if (!e.isMaster) {
            await e.reply('只有管理员才能更新插件哦~')
            return false
        }

        await e.reply('开始更新星瀚插件...')

        try {
            // 执行 git pull
            const { stdout, stderr } = await execAsync('git pull', {
                cwd: pluginPath
            })

            let msg = '【星瀚插件更新】\n'

            if (stdout.includes('Already up to date') || stdout.includes('已经是最新')) {
                msg += '当前已是最新版本'
            } else {
                msg += '更新成功！\n'
                msg += stdout.trim()

                // 检查是否有依赖更新
                if (stdout.includes('package.json')) {
                    msg += '\n\n⚠️ 检测到依赖更新，请执行:\ncd plugins/xinghan-plugin && pnpm install'
                }

                msg += '\n\n💡 如需应用更新，请重启 Yunzai'
            }

            await e.reply(msg)
        } catch (err) {
            logger.error('[星瀚插件] 更新失败:', err)
            await e.reply(`更新失败: ${err.message}`)
        }

        return true
    }
}
