import { NextRequest, NextResponse } from 'next/server'
import { requestService } from '@/lib/firebaseService'

// 更新需求状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, assignedToId, notes } = body

    const updatedRequest = await requestService.updateRequest(params.id, {
      status,
      assignedToId,
      notes,
    })

    if (updatedRequest) {
      return NextResponse.json(updatedRequest)
    } else {
      return NextResponse.json(
        { error: '更新需求失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('更新需求失败:', error)
    return NextResponse.json(
      { error: '更新需求失败' },
      { status: 500 }
    )
  }
}

// 删除需求
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await requestService.deleteRequest(params.id)
    
    if (success) {
      return NextResponse.json({ message: '需求已删除' })
    } else {
      return NextResponse.json(
        { error: '删除需求失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('删除需求失败:', error)
    return NextResponse.json(
      { error: '删除需求失败' },
      { status: 500 }
    )
  }
} 