import { NextRequest, NextResponse } from 'next/server'
import { requestService } from '@/lib/firebaseService'

// 更新需求状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== PATCH REQUEST RECEIVED ===')
    console.log('URL:', request.url)
    console.log('Params:', params)
    console.log('Request ID from params:', params.id)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { status, assignedToId, notes } = body
    
    console.log('Extracted data:', { status, assignedToId, notes })

    if (!params.id) {
      console.error('Request ID is missing from params')
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    console.log('Calling requestService.updateRequest with:', params.id, { status, assignedToId, notes })
    
    const updatedRequest = await requestService.updateRequest(params.id, {
      status,
      assignedToId,
      notes,
    })

    console.log('Update result from service:', updatedRequest)

    if (updatedRequest) {
      console.log('Returning success response')
      return NextResponse.json(updatedRequest)
    } else {
      console.error('Service returned null/undefined')
      return NextResponse.json(
        { error: 'Failed to update request - service returned null' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Update request error:', error)
    
    let errorMessage = 'Failed to update request'
    let statusCode = 500
    
    if (error instanceof Error) {
      errorMessage = error.message
      if (error.message.includes('permission-denied')) {
        statusCode = 403
      } else if (error.message.includes('not found')) {
        statusCode = 404
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: statusCode }
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