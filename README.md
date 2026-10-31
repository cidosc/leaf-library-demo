# 叶间书库 · 图书检索与协作演示

基于 Next.js、React 和 PostgreSQL，展示内容目录、作品与作者详情、搜索任务、收藏、图片上传与社区鉴定。Web 与 REST API 共用业务服务，后台任务使用数据库队列与 Worker。

全部初始作品、作者、热度及社区记录为合成示例，封面与品牌为自制素材。当前仅注册本地目录和本地答案库检索；外部资料库、邮件、消息及 AI 服务未连接。图片检索没有外部识别能力，不将本地匹配包装成 AI 识别。

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

另开终端执行 `npm run worker`。访问 http://127.0.0.1:3100 。本地实例使用 55439 端口、`leaf_demo` 数据库以及独立 `.runtime/` 和 `data/`；凭据随机生成在忽略的 `.env.local` 中。种子仅允许写入空目录。

本地副本仅允许连接回环地址的 `leaf_demo` 数据库，不接入其他数据库。不要导入真实站点数据。访客会话可体验收藏与社区，邮件注册和外部绑定未连接。

停止 Web/Worker 可使用各自终端的 Ctrl+C。数据库可使用同一 PostgreSQL bin 目录的 `pg_ctl -D .runtime/pgdata stop -m fast` 停止，数据保留。

## 最低验证

`npm run typecheck`、`npm run build`，以及首页、目录、作品详情、社区和收藏的本地冒烟检查。
