'use client'

import { SimpleSolanaPayment } from '@/components/simple-solana-payment'
import { SimpleSolanaDashboard } from '@/components/simple-solana-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SolanaPaymentsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Solana Payment Processor</h1>
        <p className="text-muted-foreground text-lg">
          Send and receive payments on the Solana blockchain
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="send">Send Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <SimpleSolanaDashboard />
        </TabsContent>
        
        <TabsContent value="send" className="mt-6">
          <div className="flex justify-center">
            <SimpleSolanaPayment 
              onPaymentSuccess={(signature) => {
                console.log('Payment successful:', signature)
                // You can add toast notifications here
              }}
              onPaymentError={(error) => {
                console.error('Payment failed:', error)
                // You can add error handling here
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
