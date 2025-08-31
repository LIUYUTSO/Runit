import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function testFirebaseConnection() {
  try {
    console.log('🔍 测试 Firebase 连接...')
    
    // 尝试连接 Firestore
    const testCollection = collection(db, 'test')
    const querySnapshot = await getDocs(testCollection)
    
    console.log('✅ Firebase 连接成功！')
    console.log('📊 测试集合文档数量:', querySnapshot.size)
    
    return true
  } catch (error) {
    console.error('❌ Firebase 连接失败:', error)
    return false
  }
}

// 如果直接运行此文件
if (require.main === module) {
  testFirebaseConnection()
}
