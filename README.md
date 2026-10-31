# 叶间书库 · 图书检索与协作演示

基于现有 Next.js、React 和 PostgreSQL 框架的纯本地演示，保留图书目录、作者与作品详情、关键词/编号检索、本地收藏及后台任务队列。采用青绿与石墨色界面，适配桌面和手机。

全部图书、作者和目录信息均为合成示例，封面与品牌为自制素材。已删除外部适配器、来源同步、外部 Cookie 导入、邮件、消息、识图和 AI 调用的实现、路由与相关配置，不是仅隐藏入口。仅保留本站生成的本地访客会话，用于关联当前浏览器的检索与收藏；无需真实账号、邮箱或密码。

## 本地运行

需要 Node.js 22.13+ 或 24+、npm，以及已经安装的 PostgreSQL 18。首次准备依赖使用 `npm ci`。

Windows 可指定已有 PostgreSQL 的 bin 目录初始化独立实例（该命令不会安装软件）：

```powershell
pwsh -File scripts/local-demo.ps1 -PgBin '<PostgreSQL bin directory>'
npm run db:migrate
npm run db:seed
npm run build
npm start
```

另开终端执行 `npm run worker`。访问 http://127.0.0.1:3100 。本地实例使用 55439 端口和 `leaf_demo` 数据库，演示表以 `demo_` 为前缀；凭据随机生成在忽略的 `.env.local` 中，运行文件放在忽略的 `.runtime/`。合成目录种子可重复执行。

本地副本仅允许连接回环地址的 `leaf_demo` 数据库，不接入其他数据库，也不导入真实站点数据。清除浏览器 Cookie 会失去访客身份。前端只请求本站 `/api/v1`；服务端没有对外 HTTP 调用。架构页说明页面、API、PostgreSQL 与 Worker 的流程并显示本地任务状态。

停止 Web/Worker 可使用各自终端的 Ctrl+C。数据库可使用同一 PostgreSQL bin 目录的 `pg_ctl -D .runtime/pgdata stop -m fast` 停止，数据保留。

## 最低验证

`npm run typecheck`、`npm run build`，以及首页、目录、作品详情、检索任务、收藏和移动布局的本地检查。本项目不包含自动部署配置。
