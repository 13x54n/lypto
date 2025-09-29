'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PaymentFormProps {
  onPaymentSuccess?: (signature: string) => void
  onPaymentError?: (error: string) => void
}

export function SimpleSolanaPayment({ onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [tokenMint, setTokenMint] = useState('')
  const [memo, setMemo] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !recipient) {
      setError('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockSignature = `mock_signature_${Date.now()}`
      setSuccess(`Payment successful! Signature: ${mockSignature}`)
      onPaymentSuccess?.(mockSignature)
      
      // Reset form
      setAmount('')
      setRecipient('')
      setMemo('')
      
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed'
      setError(errorMessage)
      onPaymentError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Solana Payment (Demo)</CardTitle>
        <CardDescription>
          Send SOL or SPL tokens on the Solana blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            This is a demo version. Connect your wallet to enable real payments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="token">Token Type</Label>
            <Select value={tokenMint} onValueChange={setTokenMint}>
              <SelectTrigger>
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">SOL (Native)</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="RAY">RAY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              required
            />
          </div>

          <div>
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana wallet address"
              required
            />
          </div>

          <div>
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment memo"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Send Payment (Demo)'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
