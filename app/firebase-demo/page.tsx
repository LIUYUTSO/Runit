'use client';

import { useState, useEffect } from 'react';
import { userService, requestService, FirebaseUser, FirebaseRequest } from '@/lib/firebase-utils';
import toast from 'react-hot-toast';

export default function FirebaseDemo() {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [requests, setRequests] = useState<FirebaseRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // 表单状态
  const [userForm, setUserForm] = useState({
    name: '',
    role: 'RUNNER' as const,
    email: '',
    phone: ''
  });

  const [requestForm, setRequestForm] = useState({
    roomNumber: '',
    guestName: '',
    requestType: 'HOUSEKEEPING' as const,
    priority: 'MEDIUM' as const,
    description: '',
    location: ''
  });

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, requestsData] = await Promise.all([
        userService.getAllUsers(),
        requestService.getAllRequests()
      ]);
      setUsers(usersData);
      setRequests(requestsData);
    } catch (error) {
      toast.error('加载数据失败');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 创建用户
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim()) {
      toast.error('请输入用户名');
      return;
    }

    try {
      await userService.createUser(userForm);
      toast.success('用户创建成功！');
      setUserForm({ name: '', role: 'RUNNER', email: '', phone: '' });
      loadData();
    } catch (error) {
      toast.error('创建用户失败');
      console.error('Error creating user:', error);
    }
  };

  // 创建请求
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.description.trim()) {
      toast.error('请输入请求描述');
      return;
    }

    if (users.length === 0) {
      toast.error('请先创建用户');
      return;
    }

    try {
      const requestData = {
        ...requestForm,
        createdById: users[0].id!, // 使用第一个用户作为创建者
        status: 'PENDING' as const
      };
      
      await requestService.createRequest(requestData);
      toast.success('请求创建成功！');
      setRequestForm({
        roomNumber: '',
        guestName: '',
        requestType: 'HOUSEKEEPING',
        priority: 'MEDIUM',
        description: '',
        location: ''
      });
      loadData();
    } catch (error) {
      toast.error('创建请求失败');
      console.error('Error creating request:', error);
    }
  };

  // 更新请求状态
  const handleUpdateRequestStatus = async (requestId: string, newStatus: FirebaseRequest['status']) => {
    try {
      await requestService.updateRequest(requestId, { status: newStatus });
      toast.success('状态更新成功！');
      loadData();
    } catch (error) {
      toast.error('更新状态失败');
      console.error('Error updating request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Firebase 数据操作演示</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 创建用户表单 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">创建用户</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">姓名 *</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">角色</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="SUPERVISOR">主管</option>
                  <option value="HOUSE_PERSON">客房服务员</option>
                  <option value="RUNNER">跑腿员</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">邮箱</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">电话</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                创建用户
              </button>
            </form>
          </div>

          {/* 创建请求表单 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">创建请求</h2>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">房间号</label>
                  <input
                    type="text"
                    value={requestForm.roomNumber}
                    onChange={(e) => setRequestForm({ ...requestForm, roomNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">客人姓名</label>
                  <input
                    type="text"
                    value={requestForm.guestName}
                    onChange={(e) => setRequestForm({ ...requestForm, guestName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">请求类型</label>
                  <select
                    value={requestForm.requestType}
                    onChange={(e) => setRequestForm({ ...requestForm, requestType: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="HOUSEKEEPING">客房服务</option>
                    <option value="MAINTENANCE">维修</option>
                    <option value="AMENITIES">用品</option>
                    <option value="CLEANING">清洁</option>
                    <option value="TURNDOWN">夜床服务</option>
                    <option value="OTHER">其他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">优先级</label>
                  <select
                    value={requestForm.priority}
                    onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="LOW">低</option>
                    <option value="MEDIUM">中</option>
                    <option value="HIGH">高</option>
                    <option value="URGENT">紧急</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">位置</label>
                <input
                  type="text"
                  value={requestForm.location}
                  onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">描述 *</label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                创建请求
              </button>
            </form>
          </div>
        </div>

        {/* 数据显示 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 用户列表 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">用户列表 ({users.length})</h2>
            {loading ? (
              <div className="text-center py-4">加载中...</div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-3">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">
                      角色: {user.role} | 邮箱: {user.email || '无'} | 电话: {user.phone || '无'}
                    </div>
                    <div className="text-xs text-gray-500">
                      创建时间: {new Date(user.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center text-gray-500 py-4">暂无用户</div>
                )}
              </div>
            )}
          </div>

          {/* 请求列表 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">请求列表 ({requests.length})</h2>
            {loading ? (
              <div className="text-center py-4">加载中...</div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{request.description}</div>
                        <div className="text-sm text-gray-600">
                          房间: {request.roomNumber || '无'} | 客人: {request.guestName || '无'}
                        </div>
                        <div className="text-sm text-gray-600">
                          类型: {request.requestType} | 优先级: {request.priority}
                        </div>
                        <div className="text-xs text-gray-500">
                          创建时间: {new Date(request.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        <select
                          value={request.status}
                          onChange={(e) => handleUpdateRequestStatus(request.id!, e.target.value as any)}
                          className="text-xs border rounded px-1 py-0.5"
                        >
                          <option value="PENDING">待处理</option>
                          <option value="IN_PROGRESS">进行中</option>
                          <option value="COMPLETED">已完成</option>
                          <option value="CANCELLED">已取消</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center text-gray-500 py-4">暂无请求</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
