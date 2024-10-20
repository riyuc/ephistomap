"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormSchema } from "@/schema/schema"
import { Input } from "./ui/input"
import { CornerDownLeft } from "lucide-react"

export function GitHubRepoForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="flex-grow flex items-center justify-center ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center space-y-16">
          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-6">
                <FormLabel className="text-4xl">The best way to navigate complex codebases!</FormLabel>
                <div className="flex flex-row items-center justify-center">
                  <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Repo URL..."
                      className="pr-12"
                      {...field}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent shadow-none "
                    >
                      <CornerDownLeft className="h-4 w-4" color="black" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </div>
                  </FormControl>
                </div>
                {/* <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}