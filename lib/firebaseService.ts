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
  id?: string
  roomNumber?: string
  guestName?: string
  requestType: 'HOUSEKEEPING' | 'MAINTENANCE' | 'AMENITIES' | 'CLEANING' | 'TURNDOWN' | 'OTHER'
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
  async getAllRequests(): Promise<Request[]> {
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
          } as Request
        })
      )
      return requests
    } catch (error) {
      console.error('获取请求列表失败:', error)
      return []
    }
  },

  // 创建请求
  async createRequest(requestData: Partial<Omit<Request, 'id' | 'createdAt' | 'updatedAt'>> & { description: string; requestType: Request['requestType']; priority: Request['priority']; createdById: string }): Promise<Request | null> {
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
      } as Request
    } catch (error) {
      console.error('创建请求失败:', error)
      return null
    }
  },

  // 更新请求
  async updateRequest(id: string, updateData: Partial<Request>): Promise<Request | null> {
    try {
      const docRef = doc(db, 'requests', id)
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
        completedAt: updateData.status === 'COMPLETED' ? serverTimestamp() : updateData.completedAt
      })
      
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()
      const createdBy = data?.createdById ? await userService.getUserById(data.createdById) : null
      const assignedTo = data?.assignedToId ? await userService.getUserById(data.assignedToId) : null
      
      return {
        id: docSnap.id,
        ...data,
        createdBy,
        assignedTo
      } as Request
    } catch (error) {
      console.error('更新请求失败:', error)
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
