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
    
    console.log('PATCH request received:', { id: params.id, body })

    if (!params.id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const updatedRequest = await requestService.updateRequest(params.id, {
      status,
      assignedToId,
      notes,
    })

    console.log('Update result:', updatedRequest)

    if (updatedRequest) {
      return NextResponse.json(updatedRequest)
    } else {
      return NextResponse.json(
        { error: 'Failed to update request' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Update request error:', error)
    return NextResponse.json(
      { error: 'Failed to update request' },
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
      return NextResponse.json({ message: 'Request deleted successfully' })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete request' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Delete request error:', error)
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    )
  }
} 