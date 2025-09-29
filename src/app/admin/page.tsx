import { SectionCardAdmin } from '@/components/section-card-admin'

export default function AdminPage() {
  // In a real app, this would come from Firebase auth context
  const userId = 'demo-user-123' // Replace with actual user ID from Firebase auth

  return (
    <div className="container mx-auto py-8">
      <SectionCardAdmin userId={userId} />
    </div>
  )
}
