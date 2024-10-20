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
    <div className="flex-grow flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center space-y-16">
          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-6">
                <FormLabel className="text-4xl">The best way to navigate complex codebases! </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Link to GitHub repository"
                    className="resize-none flex w-2/3"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}