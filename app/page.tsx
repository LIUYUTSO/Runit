'use client'

import React from 'react'
import Link from 'next/link'
import { Building2, Users, Smartphone, Scissors } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-black mb-4">
            RUNIT
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Hotel Housekeeping Request Management System
          </p>
          <div className="w-24 h-0.5 bg-black mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Supervisor Management Interface */}
          <Link href="/supervisor" className="group">
            <div className="bg-white border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-white transition-colors">
                  <Building2 className="w-8 h-8 text-black group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-4 group-hover:text-white">
                  SUPERVISOR
                </h2>
                <p className="text-gray-600 mb-6 group-hover:text-gray-300">
                  Manage front desk requests, assign tasks, track completion status
                </p>
                <div className="inline-flex items-center font-medium text-black group-hover:text-white">
                  ENTER MANAGEMENT
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Runner Interface */}
          <Link href="/runner" className="group">
            <div className="bg-white border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-white transition-colors">
                  <Smartphone className="w-8 h-8 text-black group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-4 group-hover:text-white">
                  RUNNER
                </h2>
                <p className="text-gray-600 mb-6 group-hover:text-gray-300">
                  Quick room request recording and task status updates
                </p>
                <div className="inline-flex items-center font-medium text-black group-hover:text-white">
                  START WORKING
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Striper Interface */}
          <Link href="/striper" className="group">
            <div className="bg-white border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-white transition-colors">
                  <Scissors className="w-8 h-8 text-black group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-4 group-hover:text-white">
                  STRIPER
                </h2>
                <p className="text-gray-600 mb-6 group-hover:text-gray-300">
                  Room stripping management and cleaning task tracking
                </p>
                <div className="inline-flex items-center font-medium text-black group-hover:text-white">
                  START STRIPPING
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white border-2 border-black p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-black mb-4">
              SYSTEM FEATURES
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                Real-time Sync
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                Mobile Optimized
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                Data Analytics
              </div>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center text-black hover:text-gray-600 font-medium"
            >
              VIEW DEMO
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 