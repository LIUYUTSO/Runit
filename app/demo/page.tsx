'use client'

import React from 'react'
import Link from 'next/link'
import { Building2, Smartphone, Database, Zap, Shield, BarChart3 } from 'lucide-react'

export default function DemoPage() {
  const features = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Supervisor Management',
      description: 'Complete desktop management interface with request assignment, status tracking and data analysis',
      color: 'text-black',
      bgColor: 'bg-white',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile Optimized',
      description: 'Mobile interface designed for housekeeping staff to quickly record and update task status',
      color: 'text-black',
      bgColor: 'bg-white',
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Data Persistence',
      description: 'Using PostgreSQL database to ensure all data is securely stored and backed up',
      color: 'text-black',
      bgColor: 'bg-white',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Sync',
      description: 'All operations sync in real-time to ensure team members see the latest status',
      color: 'text-black',
      bgColor: 'bg-white',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Built on Next.js and Prisma, providing enterprise-level security and stability',
      color: 'text-black',
      bgColor: 'bg-white',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Data Analytics',
      description: 'Provides detailed statistical reports to help optimize workflows and efficiency',
      color: 'text-black',
      bgColor: 'bg-white',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">
            RUNIT SYSTEM DEMO
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Modern request management platform designed for hotel housekeeping departments
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/supervisor"
              className="bg-white text-black px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              TRY SUPERVISOR
            </Link>
            <Link
              href="/mobile"
              className="bg-white text-black px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              TRY MOBILE
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            SYSTEM FEATURES
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-colors group">
                <div className={`w-16 h-16 border-2 border-black rounded-lg flex items-center justify-center mb-4 group-hover:border-white`}>
                  <div className="text-black group-hover:text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            TECHNICAL ARCHITECTURE
          </h2>
          <div className="bg-white border-2 border-black p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js 14 (App Router)</li>
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Lucide React Icons</li>
                  <li>• React Hot Toast</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Backend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js API Routes</li>
                  <li>• Prisma ORM</li>
                  <li>• PostgreSQL Database</li>
                  <li>• Vercel Deployment</li>
                  <li>• TypeScript Type Safety</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Flow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            USAGE FLOW
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Record Request</h3>
              <p className="text-gray-600">
                Housekeeping staff or supervisors quickly record room requests with detailed information and priority
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Assign Tasks</h3>
              <p className="text-gray-600">
                Supervisors assign tasks to appropriate housekeeping staff based on workload and skills
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Track Completion</h3>
              <p className="text-gray-600">
                Real-time tracking of task progress to ensure all requests are handled promptly
              </p>
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="text-center">
          <div className="bg-white border-2 border-black p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-4">
              READY TO GET STARTED?
            </h2>
            <p className="text-gray-600 mb-6">
              Experience the RUNIT system and improve hotel housekeeping efficiency
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-white text-black px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                BACK TO HOME
              </Link>
              <Link
                href="/supervisor"
                className="bg-white text-black px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 