import BlogFormContextProvider from "./context/BlogFormContext";

export default function Layout({ children }) {
  return <BlogFormContextProvider>{children}</BlogFormContextProvider>;
}
