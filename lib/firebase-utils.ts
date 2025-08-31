import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// 数据类型定义
export interface FirebaseUser {
  id?: string;
  name: string;
  role: 'SUPERVISOR' | 'HOUSE_PERSON' | 'RUNNER';
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseRequest {
  id?: string;
  roomNumber?: string;
  guestName?: string;
  requestType: 'HOUSEKEEPING' | 'MAINTENANCE' | 'AMENITIES' | 'CLEANING' | 'TURNDOWN' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description: string;
  notes?: string;
  createdById: string;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  location?: string;
}

// 用户相关操作
export const userService = {
  // 创建用户
  async createUser(userData: Omit<FirebaseUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userWithTimestamps = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await addDoc(collection(db, 'users'), userWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // 获取所有用户
  async getAllUsers(): Promise<FirebaseUser[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseUser[];
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // 根据ID获取用户
  async getUserById(id: string): Promise<FirebaseUser | null> {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirebaseUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // 更新用户
  async updateUser(id: string, userData: Partial<FirebaseUser>): Promise<void> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // 删除用户
  async deleteUser(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

// 请求相关操作
export const requestService = {
  // 创建请求
  async createRequest(requestData: Omit<FirebaseRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const requestWithTimestamps = {
        ...requestData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await addDoc(collection(db, 'requests'), requestWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  // 获取所有请求
  async getAllRequests(): Promise<FirebaseRequest[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'requests'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseRequest[];
    } catch (error) {
      console.error('Error getting requests:', error);
      throw error;
    }
  },

  // 根据ID获取请求
  async getRequestById(id: string): Promise<FirebaseRequest | null> {
    try {
      const docRef = doc(db, 'requests', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirebaseRequest;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting request:', error);
      throw error;
    }
  },

  // 更新请求
  async updateRequest(id: string, requestData: Partial<FirebaseRequest>): Promise<void> {
    try {
      const docRef = doc(db, 'requests', id);
      const updateData = {
        ...requestData,
        updatedAt: new Date()
      };
      
      // 如果状态变为完成，添加完成时间
      if (requestData.status === 'COMPLETED' && !requestData.completedAt) {
        updateData.completedAt = new Date();
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  },

  // 删除请求
  async deleteRequest(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'requests', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  },

  // 根据状态获取请求
  async getRequestsByStatus(status: FirebaseRequest['status']): Promise<FirebaseRequest[]> {
    try {
      const q = query(
        collection(db, 'requests'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseRequest[];
    } catch (error) {
      console.error('Error getting requests by status:', error);
      throw error;
    }
  },

  // 根据优先级获取请求
  async getRequestsByPriority(priority: FirebaseRequest['priority']): Promise<FirebaseRequest[]> {
    try {
      const q = query(
        collection(db, 'requests'),
        where('priority', '==', priority),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseRequest[];
    } catch (error) {
      console.error('Error getting requests by priority:', error);
      throw error;
    }
  },

  // 根据分配的用户获取请求
  async getRequestsByAssignedUser(assignedToId: string): Promise<FirebaseRequest[]> {
    try {
      const q = query(
        collection(db, 'requests'),
        where('assignedToId', '==', assignedToId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseRequest[];
    } catch (error) {
      console.error('Error getting requests by assigned user:', error);
      throw error;
    }
  }
};
