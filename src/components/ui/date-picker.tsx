import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'
import { format } from 'date-fns'

export function DateRangePicker({
  date,
  setDate,
}: {
  date: { from?: Date; to?: Date }
  setDate: (date: { from?: Date; to?: Date }) => void
}) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {date.from ? format(date.from, 'MMM dd, yyyy') : 'Pick start date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date.from}
            onSelect={(d) => setDate({ ...date, from: d })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {date.to ? format(date.to, 'MMM dd, yyyy') : 'Pick end date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date.to}
            onSelect={(d) => setDate({ ...date, to: d })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
