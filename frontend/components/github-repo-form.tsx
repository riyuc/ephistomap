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
    <div className="flex-grow flex justify-center ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-6">
                <FormLabel className="flex flex-col justify-center items-center space-y-6 text-5xl font-bold font-montserrat">
                  <h1 className="text-slate-800">Hi there👋! First day on the job?</h1>
                  <div>
                    <h1 className="bg-gradient-to-r from-pink-400 via-sky-400 to-purple-400 inline-block text-transparent bg-clip-text text-6xl">Ephistomap</h1>
                    <span className="text-slate-800 text-5xl">{' '}got you covered</span>
                  </div>
                </FormLabel>
                <div className="flex flex-col items-center justify-center min-w-full">
                  <div className="text-slate-500 text-center">
                    <div>Ephistomap provides an intuitive knowledge graph for any GitHub repository,</div>
                    <div>helping you understand and navigate complex codebases effortlessly</div>
                  </div>
                  <FormControl>
                    <div className="relative mt-4 min-w-full">
                      <Input
                        placeholder="Repo URL..."
                        className="pr-12 shadow-none border-gray-500 border-2 h-14 rounded-xl"
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
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
