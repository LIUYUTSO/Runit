import { NextRequest, NextResponse } from 'next/server'
import { requestService } from '@/lib/firebaseService'

// 获取所有需求
export async function GET() {
  try {
    const requests = await requestService.getAllRequests()
    return NextResponse.json(requests)
  } catch (error) {
    console.error('获取需求列表失败:', error)
    // 返回空数组而不是错误对象，这样前端不会崩溃
    return NextResponse.json([])
  }
}

// 创建新需求
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      roomNumber,
      guestName,
      requestType,
      priority,
      description,
      notes,
      location,
      createdById,
      assignedToId,
    } = body

    const newRequest = await requestService.createRequest({
      roomNumber,
      guestName,
      requestType,
      priority,
      description,
      notes,
      location,
      createdById,
      assignedToId,
    })

    if (newRequest) {
      return NextResponse.json(newRequest, { status: 201 })
    } else {
      return NextResponse.json(
        { error: '创建需求失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('创建需求失败:', error)
    return NextResponse.json(
      { error: '创建需求失败' },
      { status: 500 }
    )
  }
} 