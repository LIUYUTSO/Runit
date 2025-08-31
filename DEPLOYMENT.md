# Runit 部署指南

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 设置环境变量
创建 `.env.local` 文件：
```env
POSTGRES_URL="postgresql://username:password@localhost:5432/runit"
```

### 3. 数据库设置
```bash
# 创建数据库迁移
npx prisma migrate dev --name init

# 生成 Prisma 客户端
npx prisma generate

# 运行种子数据（可选）
npm run seed
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## Vercel 部署

### 1. 准备数据库
- 使用 Vercel Postgres 或外部 PostgreSQL 服务
- 获取数据库连接字符串

### 2. 部署到 Vercel
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量：
   - `POSTGRES_URL`: 数据库连接字符串
4. 部署项目

### 3. 数据库迁移
部署后，在 Vercel 项目设置中运行：
```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. 初始化数据（可选）
```bash
npm run seed
```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `POSTGRES_URL` | PostgreSQL 数据库连接字符串 | `postgresql://user:pass@host:port/db` |

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `POSTGRES_URL` 是否正确
   - 确认数据库服务是否运行
   - 检查防火墙设置

2. **Prisma 错误**
   - 运行 `npx prisma generate` 重新生成客户端
   - 检查数据库 schema 是否正确

3. **构建失败**
   - 检查 TypeScript 类型错误
   - 确认所有依赖已正确安装

### 支持

如有问题，请检查：
- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Vercel 文档](https://vercel.com/docs) 