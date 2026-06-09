import { useState } from "react"
import { SmilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Each option is one or more emojis added together.
// 😭 + 🙏 always come as a pair.
const OPTIONS: string[][] = [["💀"], ["😭", "🙏"], ["🥀"]]

export function ReactionPicker({
  onPick,
}: {
  onPick: (emoji: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          aria-label="Add reaction"
        >
          <SmilePlus className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex gap-1">
          {OPTIONS.map((option) => (
            <button
              key={option.join("")}
              className="flex items-center gap-0.5 rounded-md px-2 py-1 text-lg leading-none transition-transform hover:scale-110 hover:bg-accent"
              onClick={() => {
                option.forEach(onPick)
                setOpen(false)
              }}
            >
              {option.join("")}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
