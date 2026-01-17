/**
 * 星瀚插件 - TRSS-Yunzai 表情包生成插件
 * @author xialuo
 * @version 1.0.0
 */

import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 插件信息
const pluginName = '星瀚插件'
const pluginVersion = '1.0.0'

logger.info(`[${pluginName}] 正在加载...`)

// 动态加载 apps 目录下所有应用
const apps = {}
const appsPath = path.join(__dirname, 'apps')

if (fs.existsSync(appsPath)) {
  const files = fs.readdirSync(appsPath).filter(file => file.endsWith('.js') && file !== 'index.js')
  
  for (const file of files) {
    try {
      const module = await import(`./apps/${file}`)
      const appName = file.replace('.js', '')
      if (module.default) {
        apps[appName] = module.default
        logger.info(`[${pluginName}] 加载应用: ${appName}`)
      }
    } catch (err) {
      logger.error(`[${pluginName}] 加载应用 ${file} 失败:`, err)
    }
  }
}

logger.info(`[${pluginName}] v${pluginVersion} 加载完成`)

export { apps }
