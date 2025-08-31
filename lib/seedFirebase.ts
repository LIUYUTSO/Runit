import { userService, requestService } from './firebaseService'

async function seedFirebase() {
  try {
    console.log('🌱 开始创建Firebase种子数据...')

    // 创建测试用户
    const supervisor = await userService.createUser({
      name: '張主管',
      email: 'supervisor@hotel.com',
      role: 'SUPERVISOR',
      phone: '0912345678',
    })

    const housePerson1 = await userService.createUser({
      name: '李房務員',
      email: 'houseperson1@hotel.com',
      role: 'HOUSE_PERSON',
      phone: '0923456789',
    })

    const housePerson2 = await userService.createUser({
      name: '王房務員',
      email: 'houseperson2@hotel.com',
      role: 'HOUSE_PERSON',
      phone: '0934567890',
    })

    const runner = await userService.createUser({
      name: '陳跑腿',
      email: 'runner@hotel.com',
      role: 'RUNNER',
      phone: '0945678901',
    })

    console.log('✅ 用户创建完成')

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
        createdById: supervisor?.id || '',
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
        createdById: supervisor?.id || '',
        assignedToId: housePerson1?.id || null,
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
        createdById: supervisor?.id || '',
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
        createdById: supervisor?.id || '',
        assignedToId: housePerson2?.id || null,
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
        createdById: supervisor?.id || '',
      },
    ]

    for (const request of requests) {
      // 过滤掉 undefined 值
      const cleanRequest = Object.fromEntries(
        Object.entries(request).filter(([_, value]) => value !== undefined)
      )
      await requestService.createRequest(cleanRequest as any)
    }

    console.log('✅ 需求创建完成')
    console.log('🎉 Firebase种子数据创建成功！')
    console.log('👥 用户数量:', 4)
    console.log('📋 需求数量:', requests.length)

  } catch (error) {
    console.error('❌ 创建种子数据失败:', error)
  }
}

// 如果直接运行此文件
if (require.main === module) {
  seedFirebase()
}

export default seedFirebase
