"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect" | "defaultMonth"
> & {
  value?: Date
  onChange?: (date: Date | undefined) => void
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  placeholder?: string
  triggerClassName?: string
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "Pick a date",
  triggerClassName,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!value}
          onBlur={onBlur}
          className={
            triggerClassName ??
            "w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          }
        >
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...props}
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  )
}
