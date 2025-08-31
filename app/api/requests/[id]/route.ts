import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 更新需求状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, assignedToId, notes } = body

    const updatedRequest = await prisma.request.update({
      where: { id: params.id },
      data: {
        status,
        assignedToId,
        notes,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        createdBy: true,
        assignedTo: true,
      },
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
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
    await prisma.request.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '需求已删除' })
  } catch (error) {
    return NextResponse.json(
      { error: '删除需求失败' },
      { status: 500 }
    )
  }
} 