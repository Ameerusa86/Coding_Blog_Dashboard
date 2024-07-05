import AuthProvider from "@/lib/context/AuthContext";
import SideBar from "./components/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <div className="flex gap-3 ">
          <SideBar />
          {children}
        </div>
      </AuthProvider>
    </>
  );
}
