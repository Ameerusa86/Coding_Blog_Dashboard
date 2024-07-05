import { ReactNode } from "react";
import CategoryFormContextProvider from "./context/CategoryFormContext";

export default function Layout({ children }) {
  return <CategoryFormContextProvider>{children}</CategoryFormContextProvider>;
}
