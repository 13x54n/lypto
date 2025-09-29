'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Transaction {
  signature: string
  amount: number
  token: string
  recipient: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
}

export function SimpleSolanaDashboard() {
  const [balance, setBalance] = useState({ sol: 0, usdc: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demo
  useEffect(() => {
    setBalance({ sol: 2.5, usdc: 150.0 })
    setTransactions([
      {
        signature: 'mock_signature_1',
        amount: 1.5,
        token: 'SOL',
        recipient: 'ABC123...XYZ789',
        timestamp: Date.now() - 3600000,
        status: 'confirmed'
      },
      {
        signature: 'mock_signature_2',
        amount: 50.0,
        token: 'USDC',
        recipient: 'DEF456...UVW012',
        timestamp: Date.now() - 7200000,
        status: 'confirmed'
      }
    ])
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default'
      case 'pending': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Solana Payment Dashboard (Demo)</h1>
        <div className="flex gap-2">
          <Button onClick={() => setLoading(!loading)} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>SOL Balance</CardTitle>
            <CardDescription>Native Solana token</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.sol.toFixed(6)} SOL
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>USDC Balance</CardTitle>
            <CardDescription>USD Coin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.usdc.toFixed(2)} USDC
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
            <CardDescription>Estimated USD value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(balance.sol * 100 + balance.usdc).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest Solana transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.signature} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-sm">
                        {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(tx.timestamp)}
                      </div>
                      <div className="text-sm">
                        {tx.amount} {tx.token} → {tx.recipient}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
