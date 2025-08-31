import { NextRequest, NextResponse } from 'next/server'
import { requestService, userService } from '@/lib/firebaseService'

// Get all assignments for a specific user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const allRequests = await requestService.getAllRequests()
    const userAssignments = allRequests.filter(request => 
      request.assignedToId === userId
    )

    return NextResponse.json(userAssignments)
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}

// Assign a request to a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, assignedToId } = body

    if (!requestId || !assignedToId) {
      return NextResponse.json({ error: 'Request ID and assigned user ID are required' }, { status: 400 })
    }

    // Update the request with assignment
    const updatedRequest = await requestService.updateRequest(requestId, {
      assignedToId,
      status: 'IN_PROGRESS'
    })

    if (updatedRequest) {
      return NextResponse.json(updatedRequest, { status: 200 })
    } else {
      return NextResponse.json({ error: 'Failed to assign request' }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to assign request:', error)
    return NextResponse.json({ error: 'Failed to assign request' }, { status: 500 })
  }
}
