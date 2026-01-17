# 星瀚插件 (xinghan-plugin)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-TRSS--Yunzai-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

**TRSS-Yunzai 表情包生成插件**

</div>

## 📝 简介

星瀚插件是一个为 TRSS-Yunzai 开发的表情包生成插件，可以根据用户头像生成有趣的动态表情包。

## 📦 安装

### 方式一：Gitee (推荐国内用户)

```bash
cd Yunzai/plugins
git clone https://gitee.com/xialuo03/xinghan-plugin.git
cd xinghan-plugin
pnpm install
```

### 方式二：GitHub

```bash
cd Yunzai/plugins
git clone https://github.com/xialuo0511/xinghan-plugin.git
cd xinghan-plugin
pnpm install
```

### 安装完成后

重启 Yunzai-Bot 即可使用：

```bash
# 如果使用 pm2
pnpm restart

# 或者直接重启
node app
```

## 🎮 使用说明

### 表情包指令

| 指令 | 别名 | 说明 |
|-----|------|-----|
| `#摸头` | 摸、摸摸、rua、petpet | 摸头表情包 |
| `#亲亲` | 亲、热吻、kiss | 亲亲表情包 |
| `#揉` | 揉揉、蹭、rub | 揉揉表情包 |
| `#扔` | throw | 扔出去表情包 |
| `#打` | punch | 打拳表情包 |
| `#拍` | 拍一拍、pat | 拍一拍表情包 |
| `#玩` | 顶、play | 玩耍表情包 |
| `#滚` | roll | 滚动表情包 |
| `#抱` | hold | 抱抱表情包 |
| `#敲` | knock | 敲门表情包 |
| `#文明亲亲` | decent_kiss | 文明亲亲表情包 |
| `#贴贴` | 紧贴、tightly | 贴贴表情包 |
| `#膜拜` | worship | 膜拜表情包 |
| `#举牌` | support | 举牌表情包 |
| `#永远支持` | always | 永远支持表情包 |
| `#出警` | police | 出警表情包 |
| `#捣` | pound | 捣表情包 |
| `#吸` | 嗦、suck | 吸表情包 |
| `#爬` | crawl | 爬表情包 |
| `#吃` | eat | 吃表情包 |
| `#拿` | frieren_take | 拿(芙莉莲)表情包 |
| `#击剑` | fencing | 击剑表情包 |
| `#锤` | hammer | 锤表情包 |
| `#远离` | keep_away | 远离表情包 |
| `#故障` | loading | 故障/加载表情包 |
| `#鹿乃子` | deer | 鹿乃子表情包 |
| `#寻狗` | lost_notice | 寻狗启示表情包 |
| `#开关` | control | 开关表情包 |
| `#陪睡` | coupon | 陪睡表情包 |
| `#虎视子` | deer_show | 虎视子表情包 |
| `#观察` | jerry_hold | 观察表情包 |
| `#么么` | jiujiu | 么么表情包 |
| `#开门` | 汤姆、tom_door | 开门表情包 |
| `#举牌2` | hold_sign | 手持举牌表情包 |


### 使用方式

- **使用自己头像**：`#摸头`
- **使用他人头像**：`#摸头 @某人`

### 管理指令

| 指令 | 说明 | 权限 |
|-----|------|-----|
| `#星瀚帮助` | 显示帮助信息 | 所有人 |
| `#星瀚更新` | 更新插件 | 仅管理员 |

## 🔄 更新

### 手动更新

```bash
cd Yunzai/plugins/xinghan-plugin
git pull
pnpm install
```

### 指令更新 (管理员)

在聊天中发送 `#星瀚更新` 即可自动更新。

## 📋 依赖说明

本插件使用以下依赖：

- `@napi-rs/canvas` - Node.js 图像处理
- `gif-encoder-2` - GIF 编码

这些依赖会在执行 `pnpm install` 时自动安装。

## ❓ 常见问题

### Q: 安装时 canvas 报错？

A: `@napi-rs/canvas` 是预编译的原生模块，不需要本地编译。如果遇到问题，请确保 Node.js 版本 >= 18。

### Q: 表情包模板在哪里？

A: 模板位于 `resources/petpet/` 目录下，每个子目录是一个表情模板。

### Q: 如何添加新模板？

A: 在 `resources/petpet/` 下创建新目录，包含帧图片（0.png, 1.png...）和配置文件（data.json）。

## 📜 开源协议

本项目采用 [MIT](LICENSE) 开源协议。

## 🙏 致谢

- [TRSS-Yunzai](https://github.com/TimeRainStarSky/Yunzai) - 机器人框架
- [petpet](https://github.com/Dituon/petpet) - 表情包模板参考
