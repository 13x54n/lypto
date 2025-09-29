'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSectionCards } from '@/hooks/use-dashboard-data'

interface SectionCardAdminProps {
  userId: string
}

export function SectionCardAdmin({ userId }: SectionCardAdminProps) {
  const { data: sectionCards, updateSectionCards, updateSectionCardValue, initializeSectionCards, loading, error } = useSectionCards(userId)
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({
    value: '',
    trend: 0,
    trendLabel: ''
  })

  const handleEdit = (card: any) => {
    setEditingCard(card.title)
    setEditValues({
      value: card.value,
      trend: card.trend,
      trendLabel: card.trendLabel
    })
  }

  const handleSave = async (title: string) => {
    try {
      await updateSectionCardValue(title, editValues.value, editValues.trend, editValues.trendLabel)
      setEditingCard(null)
    } catch (error) {
      console.error('Failed to update section card:', error)
    }
  }

  const handleCancel = () => {
    setEditingCard(null)
    setEditValues({ value: '', trend: 0, trendLabel: '' })
  }

  if (loading) return <div>Loading section cards...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Section Cards Management</h2>
        <div className="flex gap-2">
          <Button onClick={initializeSectionCards} variant="default">
            Initialize for New User
          </Button>
          <Button onClick={updateSectionCards} variant="outline">
            Update Static Values
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionCards.map((card) => (
          <Card key={card.title} className="relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {card.title}
                {editingCard !== card.title && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(card)}
                  >
                    Edit
                  </Button>
                )}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {editingCard === card.title ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      value={editValues.value}
                      onChange={(e) => setEditValues(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Enter value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trend">Trend</Label>
                    <Input
                      id="trend"
                      type="number"
                      value={editValues.trend}
                      onChange={(e) => setEditValues(prev => ({ ...prev, trend: Number(e.target.value) }))}
                      placeholder="Enter trend"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trendLabel">Trend Label</Label>
                    <Input
                      id="trendLabel"
                      value={editValues.trendLabel}
                      onChange={(e) => setEditValues(prev => ({ ...prev, trendLabel: e.target.value }))}
                      placeholder="Enter trend label"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(card.title)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${card.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {card.trendLabel}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({card.dataSource})
                    </span>
                  </div>
                  {card.lastUpdated && (
                    <div className="text-xs text-gray-400">
                      Last updated: {new Date(card.lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
