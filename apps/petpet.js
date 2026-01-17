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
                    reg: '^#?(亲亲|亲|kiss|热吻)\\s*',
                    fnc: 'kiss'
                },
                {
                    reg: '^#?(揉|揉揉|rub)\\s*',
                    fnc: 'rub'
                },
                {
                    reg: '^#?(扔|throw)\\s*',
                    fnc: 'throw'
                },
                {
                    reg: '^#?(打|punch)\\s*',
                    fnc: 'punch'
                },
                {
                    reg: '^#?(拍|拍一拍|pat)\\s*',
                    fnc: 'pat'
                },
                {
                    reg: '^#?(玩|play|顶)\\s*',
                    fnc: 'play'
                },
                {
                    reg: '^#?(咬|啃|bite)\\s*',
                    fnc: 'bite'
                },
                {
                    reg: '^#?(滚|roll)\\s*',
                    fnc: 'roll'
                },
                {
                    reg: '^#?(抱|hold)\\s*',
                    fnc: 'hold'
                },
                {
                    reg: '^#?(敲|knock)\\s*',
                    fnc: 'knock'
                },
                {
                    reg: '^#?(文明亲亲|decent_kiss)\\s*',
                    fnc: 'decent_kiss'
                },
                {
                    reg: '^#?(贴贴|紧贴|tightly)\\s*',
                    fnc: 'tightly'
                },
                {
                    reg: '^#?(膜拜|worship)\\s*',
                    fnc: 'worship'
                },
                {
                    reg: '^#?(举牌|support)\\s*',
                    fnc: 'support'
                },
                {
                    reg: '^#?(永远支持|always)\\s*',
                    fnc: 'always'
                },
                {
                    reg: '^#?(出警|police)\\s*',
                    fnc: 'police'
                },
                {
                    reg: '^#?(捣|pound)\\s*',
                    fnc: 'pound'
                },
                {
                    reg: '^#?(吸|嗦|suck)\\s*',
                    fnc: 'suck'
                }
            ]
        })
    }

    /**
     * 通用表情包处理函数
     * @param {object} e - 消息事件
     * @param {string} templateId - 模板ID
     */
    async HandlePetpet(e, templateId) {
        // 获取发送者ID
        const fromUserId = e.user_id

        // 获取目标用户ID（被@的用户，如果没有则使用发送者自己）
        const atTarget = GetAtTarget(e)
        const toUserId = atTarget || fromUserId

        try {
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
        return this.HandlePetpet(e, 'petpet')
    }

    /** 亲亲表情包 */
    async kiss(e) {
        return this.HandlePetpet(e, 'kiss')
    }

    /** 揉揉表情包 */
    async rub(e) {
        return this.HandlePetpet(e, 'rub')
    }

    /** 扔表情包 */
    async throw(e) {
        return this.HandlePetpet(e, 'throw')
    }

    /** 打表情包 */
    async punch(e) {
        return this.HandlePetpet(e, 'punch')
    }

    /** 拍一拍表情包 */
    async pat(e) {
        return this.HandlePetpet(e, 'pat')
    }

    /** 玩表情包 */
    async play(e) {
        return this.HandlePetpet(e, 'play')
    }

    /** 咬表情包 */
    async bite(e) {
        return this.HandlePetpet(e, 'bite')
    }

    /** 滚表情包 */
    async roll(e) {
        return this.HandlePetpet(e, 'roll')
    }

    /** 抱表情包 */
    async hold(e) {
        return this.HandlePetpet(e, 'hold')
    }

    /** 敲表情包 */
    async knock(e) {
        return this.HandlePetpet(e, 'knock')
    }

    /** 文明亲亲表情包 */
    async decent_kiss(e) {
        return this.HandlePetpet(e, 'decent_kiss')
    }

    /** 贴贴表情包 */
    async tightly(e) {
        return this.HandlePetpet(e, 'tightly')
    }

    /** 膜拜表情包 */
    async worship(e) {
        return this.HandlePetpet(e, 'worship')
    }

    /** 举牌表情包 */
    async support(e) {
        return this.HandlePetpet(e, 'support')
    }

    /** 永远支持表情包 */
    async always(e) {
        return this.HandlePetpet(e, 'always')
    }

    /** 出警表情包 */
    async police(e) {
        return this.HandlePetpet(e, 'police')
    }

    /** 捣表情包 */
    async pound(e) {
        return this.HandlePetpet(e, 'pound')
    }

    /** 吸表情包 */
    async suck(e) {
        return this.HandlePetpet(e, 'suck')
    }
}
