import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建测试用户
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@hotel.com' },
    update: {},
    create: {
      name: '張主管',
      email: 'supervisor@hotel.com',
      role: 'SUPERVISOR',
      phone: '0912345678',
    },
  })

  const housePerson1 = await prisma.user.upsert({
    where: { email: 'houseperson1@hotel.com' },
    update: {},
    create: {
      name: '李房務員',
      email: 'houseperson1@hotel.com',
      role: 'HOUSE_PERSON',
      phone: '0923456789',
    },
  })

  const housePerson2 = await prisma.user.upsert({
    where: { email: 'houseperson2@hotel.com' },
    update: {},
    create: {
      name: '王房務員',
      email: 'houseperson2@hotel.com',
      role: 'HOUSE_PERSON',
      phone: '0934567890',
    },
  })

  const runner = await prisma.user.upsert({
    where: { email: 'runner@hotel.com' },
    update: {},
    create: {
      name: '陳跑腿',
      email: 'runner@hotel.com',
      role: 'RUNNER',
      phone: '0945678901',
    },
  })

  // 创建测试需求
  const requests = [
    {
      roomNumber: '101',
      guestName: '陳先生',
      requestType: 'HOUSEKEEPING' as const,
      priority: 'HIGH' as const,
      status: 'PENDING' as const,
      description: '需要額外的毛巾和浴袍',
      notes: '客人明天早上需要',
      location: '1樓',
      createdById: supervisor.id,
    },
    {
      roomNumber: '205',
      guestName: '林小姐',
      requestType: 'AMENITIES' as const,
      priority: 'MEDIUM' as const,
      status: 'IN_PROGRESS' as const,
      description: '需要補充洗髮精和沐浴乳',
      notes: '',
      location: '2樓',
      createdById: supervisor.id,
      assignedToId: housePerson1.id,
    },
    {
      roomNumber: '312',
      guestName: '黃先生',
      requestType: 'MAINTENANCE' as const,
      priority: 'URGENT' as const,
      status: 'PENDING' as const,
      description: '空調不冷，需要維修',
      notes: '客人投訴房間太熱',
      location: '3樓',
      createdById: supervisor.id,
    },
    {
      roomNumber: '',
      guestName: '',
      requestType: 'CLEANING' as const,
      priority: 'LOW' as const,
      status: 'COMPLETED' as const,
      description: '大廳沙發需要清潔',
      notes: '已完成清潔',
      location: '大廳',
      createdById: supervisor.id,
      assignedToId: housePerson2.id,
    },
    {
      roomNumber: '408',
      guestName: '吳太太',
      requestType: 'TURNDOWN' as const,
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
      description: '需要開床服務',
      notes: '客人晚上8點回房',
      location: '4樓',
      createdById: supervisor.id,
    },
  ]

  for (const request of requests) {
    await prisma.request.upsert({
      where: {
        id: `seed-${request.roomNumber || 'public'}-${request.requestType}`,
      },
      update: {},
      create: {
        id: `seed-${request.roomNumber || 'public'}-${request.requestType}`,
        ...request,
      },
    })
  }

  console.log('✅ 測試數據已創建')
  console.log('👥 用戶:', { supervisor, housePerson1, housePerson2, runner })
  console.log('📋 需求數量:', requests.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 