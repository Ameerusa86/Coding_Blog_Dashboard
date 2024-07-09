"use client";

import { useState, useEffect, use } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import PostsTable from "@/components/posts/PostsTable";
// import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Folder, MessageCircle, Newspaper, User } from "lucide-react";
import fetchBlogCount from "@/app/api/blog/fetchBlogCount";
import Link from "next/link";
import fetchCategoryCount from "../api/category/fetchCategoryCount";
import CategoriesTable from "@/components/categories/CategoriesTable";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [blogCount, setBlogCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        router.push("/"); // Redirect to dashboard if user is logged in
      } else {
        setLoggedIn(false);
        router.push("/auth"); // Redirect to login page if user is not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const getBlogCount = async () => {
      const count = await fetchBlogCount();
      setBlogCount(count);
      setLoading(false);
    };

    getBlogCount();
  }, []);

  useEffect(() => {
    const getCategoryCount = async () => {
      const count = await fetchCategoryCount();
      setCategoryCount(count);
      setLoading(false);
    };

    getCategoryCount();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-5 mb-5">
        <Link href={"/blogs"}>
          <DashboardCard
            title="Blogs"
            count={loading ? 0 : blogCount}
            icon={<Newspaper className="text-slate-500" size={72} />}
          />
        </Link>
        <Link href={"/categories"}>
          <DashboardCard
            title="Categories"
            count={loading ? 0 : categoryCount}
            icon={<Folder className="text-slate-500" size={72} />}
          />
        </Link>
        <DashboardCard
          title="Users"
          count={750}
          icon={<User className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Comments"
          count={1250}
          icon={<MessageCircle className="text-slate-500" size={72} />}
        />
      </div>
      {/* <AnalyticsChart /> */}
      <CategoriesTable title="Latest Categories" limit={5} />
      <PostsTable title="Latest Posts" limit={5} />
    </>
  );
}
