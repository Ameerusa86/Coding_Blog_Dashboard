import AuthorFormContextProvider from "./context/AuthorFormContext";

export default function Layout({ children }) {
  return <AuthorFormContextProvider>{children}</AuthorFormContextProvider>;
}
