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
| `#亲亲` | 亲、kiss | 亲亲表情包 |
| `#拍` | 拍一拍、pat | 拍一拍表情包 |
| `#揉` | 揉揉、rub | 揉揉表情包 |
| `#贴贴` | 贴、蹭、蹭蹭 | 贴贴表情包 |

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
