import BackButton from "@/components/BackButton";
import PostsPagination from "@/components/posts/PostsPagination";
import CategoriesTable from "@/components/categories/CategoriesTable";

const BlogsPage = () => {
  return (
    <>
      <BackButton text="Go Back" link="/" />
      <CategoriesTable />
      <PostsPagination />
    </>
  );
};

export default BlogsPage;
