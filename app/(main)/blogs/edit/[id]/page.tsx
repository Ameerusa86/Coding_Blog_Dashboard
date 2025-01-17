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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Blog } from "@/types/blogs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  updatedAt: z.string().min(1, { message: "Updated date is required" }),
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
      updatedAt: post ? new Date().toISOString().split("T")[0] : "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        body: post.body,
        author: post.author,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }
  }, [post, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!post) return;
    try {
      const postDoc = doc(db, "blogs", post.id);
      await updateDoc(postDoc, { ...data, updatedAt: new Date() });
      toast({
        title: "Blog updated successfully",
        description: `Updated by ${data.author} on ${data.updatedAt}`,
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

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ font: [] as string[] }],
      [{ size: [] as string[] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["code-block"],
      [{ align: [] as string[] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "code-block",
    "align",
  ];

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
                  <ReactQuill
                    value={field.value}
                    onChange={field.onChange}
                    modules={modules}
                    formats={formats}
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
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
            name="updatedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Updated Date
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
                    onChange={(date: Date | null) =>
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
