import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { userService, User } from './firebaseService'

export interface AuthUser extends User {
  uid: string
  email: string
  lastLoginAt?: any
  loginCount?: number
}

export const authService = {
  // 登入
  async signIn(email: string, password: string): Promise<AuthUser | null> {
    try {
      console.log('=== FIREBASE AUTH SIGN IN ===')
      console.log('Email:', email)
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      console.log('Firebase Auth successful:', firebaseUser.uid)
      
      // 獲取或創建用戶資料
      let userData = await this.getUserData(firebaseUser.uid)
      
      if (!userData) {
        // 如果 Firestore 中沒有用戶資料，創建新記錄
        userData = await this.createUserData(firebaseUser)
      } else {
        // 更新登入資訊
        await this.updateLoginInfo(firebaseUser.uid)
      }
      
      console.log('User data retrieved/created:', userData)
      return userData
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  // 登出
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
      console.log('User signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  // 獲取當前用戶
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  },

  // 監聽認證狀態變化
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await this.getUserData(firebaseUser.uid)
          callback(userData)
        } catch (error) {
          console.error('Error getting user data:', error)
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  },

  // 從 Firestore 獲取用戶資料
  async getUserData(uid: string): Promise<AuthUser | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          id: userDoc.id,
          uid: uid,
          email: data.email || '',
          name: data.name || '',
          role: data.role || 'RUNNER',
          phone: data.phone || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          lastLoginAt: data.lastLoginAt,
          loginCount: data.loginCount || 0
        } as AuthUser
      }
      
      return null
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  },

  // 創建新用戶資料
  async createUserData(firebaseUser: FirebaseUser): Promise<AuthUser | null> {
    try {
      console.log('Creating new user data for:', firebaseUser.uid)
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'RUNNER', // 預設角色
        phone: firebaseUser.phoneNumber || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        loginCount: 1
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      
      return userData as AuthUser
    } catch (error) {
      console.error('Error creating user data:', error)
      return null
    }
  },

  // 更新登入資訊
  async updateLoginInfo(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const currentData = userDoc.data()
        const newLoginCount = (currentData.loginCount || 0) + 1
        
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          loginCount: newLoginCount,
          updatedAt: serverTimestamp()
        })
        
        console.log('Login info updated for user:', uid, 'Login count:', newLoginCount)
      }
    } catch (error) {
      console.error('Error updating login info:', error)
    }
  },

  // 更新用戶資料
  async updateUserData(uid: string, updates: Partial<User>): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Error updating user data:', error)
      return false
    }
  }
}
