/**
 * 表情包指令处理模块
 */

import plugin from '../../../lib/plugins/plugin.js'
import { GeneratePetpet, GetTemplates } from '../lib/petpet.js'
import { GetAtTarget } from '../lib/utils.js'

export default class PetpetApp extends plugin {
    constructor() {
        super({
            name: '星瀚表情包',
            dsc: '生成动态表情包',
            event: 'message',
            priority: 500,
            rule: [
                {
                    reg: '^#?(摸头|摸摸|摸|rua|petpet)\\s*',
                    fnc: 'petpet'
                },
                {
                    reg: '^#?(亲亲|亲|kiss)\\s*',
                    fnc: 'kiss'
                },
                {
                    reg: '^#?(拍|拍一拍|pat)\\s*',
                    fnc: 'pat'
                },
                {
                    reg: '^#?(揉|揉揉|rub)\\s*',
                    fnc: 'rub'
                },
                {
                    reg: '^#?(贴|贴贴|蹭|蹭蹭)\\s*',
                    fnc: 'rub'
                }
            ]
        })
    }

    /**
     * 通用表情包处理函数
     * @param {object} e - 消息事件
     * @param {string} templateId - 模板ID
     */
    async handlePetpet(e, templateId) {
        // 获取发送者ID
        const fromUserId = e.user_id

        // 获取目标用户ID（被@的用户，如果没有则使用发送者自己）
        const atTarget = GetAtTarget(e)
        const toUserId = atTarget || fromUserId

        try {
            // 发送处理中提示
            // await e.reply('正在生成表情包...')

            // 生成表情包
            const gifBuffer = await GeneratePetpet(templateId, fromUserId, toUserId)

            // 发送图片
            await e.reply(segment.image(gifBuffer))

            return true
        } catch (err) {
            logger.error(`[星瀚插件] 生成表情包失败:`, err)
            await e.reply(`生成表情包失败: ${err.message}`)
            return false
        }
    }

    /** 摸头表情包 */
    async petpet(e) {
        return this.handlePetpet(e, 'petpet')
    }

    /** 亲亲表情包 */
    async kiss(e) {
        return this.handlePetpet(e, 'kiss')
    }

    /** 拍一拍表情包 */
    async pat(e) {
        return this.handlePetpet(e, 'pat')
    }

    /** 揉揉表情包 */
    async rub(e) {
        return this.handlePetpet(e, 'rub')
    }
}
