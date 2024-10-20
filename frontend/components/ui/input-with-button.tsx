import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Component() {
  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="text"
        placeholder="Search..."
        className="pr-12"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  )
}