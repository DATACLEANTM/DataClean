'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { cn } from '@/lib/utils'

interface SummaryCardProps {
  title: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function SummaryCard({ title, children, className, icon }: SummaryCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
