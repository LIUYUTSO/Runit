import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/lib/firebaseService'

// 获取所有用户
export async function GET() {
  try {
    const users = await userService.getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('获取用户列表失败:', error)
    // 返回空数组而不是错误对象，这样前端不会崩溃
    return NextResponse.json([])
  }
}

// 创建新用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, email, phone } = body

    const newUser = await userService.createUser({
      name,
      role,
      email,
      phone,
    })

    if (newUser) {
      return NextResponse.json(newUser, { status: 201 })
    } else {
      return NextResponse.json(
        { error: '创建用户失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    )
  }
} 