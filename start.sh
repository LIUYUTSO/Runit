#!/bin/bash

echo "🚀 启动 Runit 酒店需求管理系统"
echo "================================"

# 检查 Node.js 版本
echo "📋 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 错误: Node.js 版本过低，需要 18+ 版本"
    exit 1
fi

echo "✅ Node.js 版本检查通过"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npx prisma generate

# 检查环境变量
if [ ! -f ".env.local" ]; then
    echo "⚠️  警告: 未找到 .env.local 文件"
    echo "请创建 .env.local 文件并设置数据库连接:"
    echo "POSTGRES_URL=\"postgresql://username:password@localhost:5432/runit\""
    echo ""
    echo "或者使用以下命令创建示例文件:"
    echo "cp .env.example .env.local"
    echo ""
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "访问地址: http://localhost:3000"
echo ""
echo "📱 移动端界面: http://localhost:3000/mobile"
echo "💼 主管界面: http://localhost:3000/supervisor"
echo "📖 演示页面: http://localhost:3000/demo"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"

npm run dev 