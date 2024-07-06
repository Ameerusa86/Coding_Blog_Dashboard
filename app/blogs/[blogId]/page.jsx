import { getBlog } from "@/lib/firebase/blogs/read_server";

export default async function SinglePage({ params }) {
  const { blogId } = params;
  const blog = await getBlog(blogId);
  return (
    <div>
      <h1>{blog.name}</h1>
      <h1>{blog.slug}</h1>
    </div>
  );
}
