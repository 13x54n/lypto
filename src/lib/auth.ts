import { NextRequest, NextResponse } from 'next/server'

// Authentication utilities for API routes
export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

// Mock authentication - replace with real authentication in production
export class AuthService {
  // Verify JWT token or session
  static async verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
      // In production, implement real authentication:
      // 1. Extract token from Authorization header
      // 2. Verify JWT token
      // 3. Check user permissions
      // 4. Return user data
      
      const authHeader = request.headers.get('authorization')
      
      if (!authHeader) {
        return null
      }

      // Mock authentication for development
      if (authHeader === 'Bearer mock-token') {
        return {
          id: '1',
          email: 'admin@zypto.com',
          name: 'Admin User',
          role: 'admin'
        }
      }

      return null
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  // Check if user has required role
  static hasRole(user: AuthUser | null, requiredRole: string): boolean {
    if (!user) return false
    
    const roleHierarchy = {
      'user': 1,
      'admin': 2
    }

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  // Generate JWT token (for login)
  static async generateToken(user: AuthUser): Promise<string> {
    // In production, use a real JWT library like jsonwebtoken
    // const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET)
    return 'mock-jwt-token'
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<AuthUser | null> {
    // In production, verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // return decoded as AuthUser
    
    if (token === 'mock-jwt-token') {
      return {
        id: '1',
        email: 'admin@zypto.com',
        name: 'Admin User',
        role: 'admin'
      }
    }

    return null
  }
}

// Authentication middleware for API routes
export function withAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const user = await AuthService.verifyAuth(request)
      
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      return handler(request, user)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    }
  }
}

// Role-based authentication middleware
export function withRole(requiredRole: string) {
  return function(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const user = await AuthService.verifyAuth(request)
        
        if (!user) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }

        if (!AuthService.hasRole(user, requiredRole)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }

        return handler(request, user)
      } catch (error) {
        console.error('Role auth middleware error:', error)
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 500 }
        )
      }
    }
  }
}

// CORS configuration for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// CORS middleware
export function withCors(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
      })
    }

    const response = await handler(request)
    
    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }
}
