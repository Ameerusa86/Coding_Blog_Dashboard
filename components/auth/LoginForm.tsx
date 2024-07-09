"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../../lib/firebase";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Please enter a valid email",
    }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch (error) {
      console.error("Error signing in: ", error);
      toast.error("Invalid email or password. Please try again.");
    }
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Error signing in with Google: ", error);
  //     toast.error("Error signing in with Google. Please try again.");
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/"); // Redirect to the dashboard after successful login
    } catch (error) {
      if (
        (error as any).code === "auth/account-exists-with-different-credential"
      ) {
        const email = (error as any).customData.email;
        const pendingCred = GoogleAuthProvider.credentialFromError(
          error as any
        );

        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
          // Existing sign-in method found, handle linking accounts here
          const existingProvider = signInMethods[0]; // e.g., "google.com", "password", etc.

          if (existingProvider === "password") {
            // Handle linking accounts with password
            // Prompt the user to login with their existing account to link
            const password = prompt(`Please enter your password for ${email}`);
            const credential = GoogleAuthProvider.credential(email, password);
            try {
              await linkWithCredential(auth.currentUser, credential);
              // Re-attempt signing in with the original credential
              await signInWithPopup(auth, pendingCred);
              router.push("/");
            } catch (linkError) {
              console.error("Error linking account:", linkError);
            }
          } else {
            // Other providers like Google, GitHub, etc.
            // Prompt the user to log in with the existing provider to link accounts
            alert(`Please log in using ${existingProvider} to link accounts.`);
          }
        }
      } else {
        console.error("Google login failed:", error);
      }
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with GitHub: ", error);
      toast.error("Error signing in with GitHub. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Log into your account with your credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                        placeholder="Enter Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                        placeholder="Enter Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out"
                type="submit"
              >
                Sign In
              </Button>
            </form>
          </Form>
          <div className="flex justify-between space-x-4 mt-4">
            <Button
              className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="mr-2" /> Sign in with Google
            </Button>
            <Button
              className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out"
              onClick={handleGithubSignIn}
            >
              <FaGithub className="mr-2" /> Sign in with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginForm;
