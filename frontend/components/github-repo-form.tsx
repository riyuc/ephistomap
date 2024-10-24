"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormSchema } from "@/schema/schema";
import { Input } from "./ui/input";
import { CornerDownLeft } from "lucide-react";
import axios from "axios";
import { useGraphStore } from "@/store/graphStore";
import { useRouter } from "next/navigation";

export function GitHubRepoForm() {
  const router = useRouter();
  const setGraphData = useGraphStore((state) => state.setGraphData);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      repoUrl: "",
    },
  });

  const onSubmit = async (data: { repoUrl: string }) => {
    console.log("Generating graph for URL:", data.repoUrl);
    try {
      const response = await axios.post("http://localhost:8080/api/v1/generate-graph", {
        url: data.repoUrl,
      });
      const graphData = response.data;

      setGraphData(graphData);

      if(response.status == 200){
        router.push("/graph");
      }

      toast({
        title: "Graph generated successfully!",
        description: "You have been redirected to the graph visualization page.",
      });
    } catch (error: any) {
      console.error("Error generating graph:", error);
      toast({
        title: "Error",
        description: "There was an error generating the graph. Please try again.",
      });
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex justify-center">
          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative mt-4 flex justify-center">
                    <Input
                      placeholder="Repo URL..."
                      className="pr-12 h-14 rounded-xl border-gray-300 w-[70vw] max-w-[600px] min-w-[300px]"
                      {...field}
                      value={field.value || ""}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
                    >
                      <CornerDownLeft className="h-5 w-5" color="black" />
                      <span className="sr-only">Submit</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
