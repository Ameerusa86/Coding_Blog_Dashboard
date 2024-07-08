"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Blog } from "@/types/blogs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  date: z.string().min(1, { message: "Date is required" }),
});

interface BlogEditPageProps {
  params: {
    id: string;
  };
}

const BlogEditPage = ({ params }: BlogEditPageProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Blog | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const postDoc = doc(db, "blogs", params.id);
        const postSnapshot = await getDoc(postDoc);
        if (postSnapshot.exists()) {
          setPost(postSnapshot.data() as Blog);
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        setError("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      body: post?.body || "",
      author: post?.author || "",
      date: post?.date || "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset(post);
    }
  }, [post, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!post) return;
    try {
      const postDoc = doc(db, "blogs", post.id);
      await updateDoc(postDoc, data);
      toast({
        title: "Blog updated successfully",
        description: `Updated by ${data.author} on ${data.date}`,
      });
      router.push("/blogs");
    } catch (error) {
      toast({
        title: "Failed to update blog",
        description: "An error occurred while updating the blog",
      });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <BackButton text="Back To Blogs" link="/blogs" />
      <h3 className="text-2xl mb-4">Edit Blog</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Body
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Body"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Author
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Author"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Date
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(new Date().toISOString().split("T")[0])
                    }
                  >
                    <FaCalendarAlt className="ml-2" />
                  </button>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-slate-500 border-0 text-black dark:text-white"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full dark:bg-slate-800 dark:text-white">
            Update Blog
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BlogEditPage;
