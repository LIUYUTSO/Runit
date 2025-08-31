import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// 类型定义
export interface User {
  id?: string
  name: string
  role: 'SUPERVISOR' | 'HOUSE_PERSON' | 'RUNNER'
  email?: string
  phone?: string
  createdAt?: any
  updatedAt?: any
}

export interface Request {
  id: string // 改为必需的
  roomNumber?: string
  guestName?: string
  requestType: string // 改为string以支持所有酒店物品类型
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  description: string
  notes?: string
  location?: string
  createdById: string
  assignedToId?: string | null
  createdAt?: any
  updatedAt?: any
  completedAt?: any
}

// 扩展的Request类型，包含关联的用户信息
export interface RequestWithUsers extends Request {
  createdBy: User | null
  assignedTo: User | null
}

// 用户相关操作
export const userService = {
  // 获取所有用户
  async getAllUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, 'users'), orderBy('name', 'asc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[]
    } catch (error) {
      console.error('获取用户列表失败:', error)
      return []
    }
  },

  // 创建用户
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      const docSnap = await getDoc(docRef)
      return {
        id: docRef.id,
        ...docSnap.data()
      } as User
    } catch (error) {
      console.error('创建用户失败:', error)
      return null
    }
  },

  // 获取单个用户
  async getUserById(id: string): Promise<User | null> {
    try {
      const docSnap = await getDoc(doc(db, 'users', id))
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as User
      }
      return null
    } catch (error) {
      console.error('获取用户失败:', error)
      return null
    }
  }
}

// 请求相关操作
export const requestService = {
  // 获取所有请求
  async getAllRequests(): Promise<RequestWithUsers[]> {
    try {
      const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const requests = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data()
          const createdBy = data.createdById ? await userService.getUserById(data.createdById) : null
          const assignedTo = data.assignedToId ? await userService.getUserById(data.assignedToId) : null
          
          return {
            id: doc.id,
            ...data,
            createdBy,
            assignedTo
          } as RequestWithUsers
        })
      )
      return requests
    } catch (error) {
      console.error('获取请求列表失败:', error)
      return []
    }
  },

  // 创建请求
  async createRequest(requestData: Partial<Omit<Request, 'id' | 'createdAt' | 'updatedAt'>> & { description: string; requestType: Request['requestType']; priority: Request['priority']; createdById: string }): Promise<RequestWithUsers | null> {
    try {
      // 设置默认值
      const dataWithDefaults = {
        status: 'PENDING' as const,
        ...requestData
      }
      
      // 过滤掉 undefined 值，保留 null 值
      const cleanData = Object.fromEntries(
        Object.entries(dataWithDefaults).filter(([_, value]) => value !== undefined)
      )
      
      const docRef = await addDoc(collection(db, 'requests'), {
        ...cleanData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()
      const createdBy = data?.createdById ? await userService.getUserById(data.createdById) : null
      const assignedTo = data?.assignedToId ? await userService.getUserById(data.assignedToId) : null
      
      return {
        id: docRef.id,
        ...data,
        createdBy,
        assignedTo
      } as RequestWithUsers
    } catch (error) {
      console.error('创建请求失败:', error)
      return null
    }
  },

  // 更新请求
  async updateRequest(id: string, updateData: Partial<Request>): Promise<RequestWithUsers | null> {
    try {
      console.log('=== FIREBASE UPDATE REQUEST ===')
      console.log('Document ID:', id)
      console.log('Update data:', updateData)
      
      const docRef = doc(db, 'requests', id)
      
      // 检查文档是否存在
      const docSnapBefore = await getDoc(docRef)
      if (!docSnapBefore.exists()) {
        console.error('Document does not exist:', id)
        return null
      }
      
      console.log('Document exists, current data:', docSnapBefore.data())
      
      // 准备更新数据
      const updatePayload = {
        ...updateData,
        updatedAt: serverTimestamp(),
      }
      
      // 如果状态是COMPLETED，添加completedAt时间戳
      if (updateData.status === 'COMPLETED') {
        updatePayload.completedAt = serverTimestamp()
      }
      
      console.log('Update payload:', updatePayload)
      
      // 执行更新
      await updateDoc(docRef, updatePayload)
      console.log('Update operation completed')
      
      // 获取更新后的文档
      const docSnapAfter = await getDoc(docRef)
      if (!docSnapAfter.exists()) {
        console.error('Document not found after update:', id)
        return null
      }
      
      const data = docSnapAfter.data()
      console.log('Updated document data:', data)
      
      // 获取关联的用户信息
      const createdBy = data?.createdById ? await userService.getUserById(data.createdById) : null
      const assignedTo = data?.assignedToId ? await userService.getUserById(data.assignedToId) : null
      
      const result = {
        id: docSnapAfter.id,
        ...data,
        createdBy,
        assignedTo
      } as RequestWithUsers
      
      console.log('Final result:', result)
      return result
    } catch (error) {
      console.error('Firebase update error:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
      }
      return null
    }
  },

  // 删除请求
  async deleteRequest(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'requests', id))
      return true
    } catch (error) {
      console.error('删除请求失败:', error)
      return false
    }
  }
}
