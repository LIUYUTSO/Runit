# Firebase 设置指南

## 🚀 快速开始

### 1. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "创建项目"
3. 输入项目名称（例如：`runit-hotel`）
4. 选择是否启用 Google Analytics（可选）
5. 点击 "创建项目"

### 2. 启用 Firestore 数据库

1. 在 Firebase Console 中，点击左侧菜单的 "Firestore Database"
2. 点击 "创建数据库"
3. 选择 "以测试模式开始"（稍后可以调整安全规则）
4. 选择数据库位置（建议选择离您最近的区域）
5. 点击 "完成"

### 3. 获取 Firebase 配置

1. 在 Firebase Console 中，点击项目设置（齿轮图标）
2. 在 "常规" 标签页中，滚动到 "您的应用" 部分
3. 点击 "Web" 图标（</>）
4. 输入应用昵称（例如：`runit-web`）
5. 点击 "注册应用"
6. 复制配置对象

### 4. 设置环境变量

创建 `.env.local` 文件并添加以下配置：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 5. 创建种子数据

运行以下命令创建测试数据：

```bash
npm run seed:firebase
```

## 🔒 安全规则设置

在 Firestore 中设置以下安全规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许读写所有文档（仅用于开发）
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**注意**：生产环境中应该设置更严格的规则。

## 📱 在 Vercel 上部署

1. 在 Vercel 项目设置中添加环境变量
2. 确保所有 Firebase 配置变量都已设置
3. 重新部署项目

## 🔧 故障排除

### 常见问题

1. **Firebase 未初始化错误**
   - 检查环境变量是否正确设置
   - 确保 Firebase 项目已创建

2. **权限错误**
   - 检查 Firestore 安全规则
   - 确保数据库已启用

3. **数据不显示**
   - 运行 `npm run seed:firebase` 创建测试数据
   - 检查浏览器控制台是否有错误

### 调试技巧

1. 在浏览器控制台中检查 Firebase 连接
2. 使用 Firebase Console 查看数据
3. 检查网络请求是否成功

## 📚 更多资源

- [Firebase 文档](https://firebase.google.com/docs)
- [Firestore 文档](https://firebase.google.com/docs/firestore)
- [Next.js Firebase 集成](https://nextjs.org/docs/authentication#firebase)
