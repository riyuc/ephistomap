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
import { useState } from "react"

export function GitHubRepoForm() {
  const [graphData, setGraphData] = useState(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      repoUrl: '',
    },
  })

  // function onSubmit(data: z.infer<typeof FormSchema>) {
  //   console.log(data)
  //   console.log("submitted")
  //   toast({
  //     title: "You submitted the following values:",
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //       </pre>
  //     ),
  //   })
  // }
  const onSubmit = async (data: { repoUrl: string }) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/generate-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.repoUrl }),
      });
      const graphData = await response.json();
      console.log("Graph data:");
      console.log(graphData);
      setGraphData(graphData);
      // Display toast notification
      toast({
        title: "Graph generated successfully!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(graphData, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Error generating graph:", error);
      toast({
        title: "Error",
        description: "There was an error generating the graph. Please try again.",
      });
    }
  };
  

  return (
    <div className="flex-grow flex justify-center ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-12">
                <FormLabel className="flex flex-col font-marlin-soft justify-center items-center space-y-2 text-6xl leading-10 font-bold font-montserrat">
                  <h1 className="text-slate-800">First day on the job?</h1>
                  <div>
                    <h1 className="bg-gradient-to-r from-pink-400 via-sky-400 to-purple-400 inline-block text-transparent bg-clip-text text-6xl">Ephisto</h1>
                    <span className="text-slate-800">{' '}got you covered</span>
                  </div>
                </FormLabel>
                <div className="flex flex-col items-center justify-center min-w-full">
                  <div className="text-center font-poppins text-lg font-extralight">
                    <p className="">Ephisto provides an intuitive knowledge graph for any GitHub repository,</p>
                    <p>helping you understand and navigate complex codebases effortlessly</p>
                  </div>
                  <FormControl>
                    <div className="relative mt-4 min-w-full">
                      <Input
                        placeholder="Repo URL..."
                        className="pr-12 shadow-none border-gray-500 h-14 rounded-xl"
                        {...field}
                        value={field.value || ''}
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
