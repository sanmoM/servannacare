
import BlogsClient from "@/components/BlogsClient/BlogsClient";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/blogs");
}

export default function Home() {
  return <BlogsClient />;
}
