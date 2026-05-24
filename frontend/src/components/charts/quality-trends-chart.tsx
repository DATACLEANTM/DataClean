'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { qualityTrends } from '@/src/data/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export function QualityTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Records Processed vs Errors Found</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis className="text-xs text-muted-foreground" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
              <Bar dataKey="records" fill="#2563EB" radius={[4, 4, 0, 0]} name="Records" />
              <Bar dataKey="errors" fill="#EF4444" radius={[4, 4, 0, 0]} name="Errors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
