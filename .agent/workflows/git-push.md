---
description: 提交代码并推送到 Gitee 和 GitHub 双仓库
---
# Git 双仓库推送工作流

本项目同时维护 Gitee 和 GitHub 两个远程仓库，每次提交后需同步推送到两个平台。

## 远程仓库配置

- **origin (Gitee)**: `https://gitee.com/xialuo03/xinghan-plugin.git`
- **github (GitHub)**: `https://github.com/xialuo0511/xinghan-plugin.git`

## 推送步骤

// turbo-all

1. 查看当前状态
```bash
git status
```

2. 添加所有更改
```bash
git add .
```

3. 提交更改（替换 `<commit-message>` 为实际提交信息）
```bash
git commit -m "<commit-message>"
```

4. 推送到 Gitee (origin)
```bash
git push origin main
```

5. 推送到 GitHub
```bash
git push github main
```

## 注意事项

- 确保两个仓库的分支名称一致（默认为 `main`）
- 如遇冲突，需先拉取最新代码再推送
- PRD 目录不要进行 git 提交和推送操作
