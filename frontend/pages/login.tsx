import Head from "next/head";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import Button from "../components/Button";
import { Mail, Lock } from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const router = useRouter();

  const { login } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success("Logged in");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <>
      <Head>
        <title>Login - Melkam</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* left promo */}
          <div className="hidden md:flex items-center justify-center bg-[rgb(31,82,78)] rounded-2xl overflow-hidden">
            <img
              src="/images/hero.png"
              alt="Melkam"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute p-8 text-white">
              <h3 className="text-2xl font-semibold">Welcome back</h3>
              <p className="mt-2 max-w-xs">
                Log in to continue your therapy journey. Secure, compassionate
                care — now online.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 bg-white rounded-2xl shadow max-w-md w-full mx-auto"
          >
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Welcome back
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Sign in to your account to continue
            </p>

            <div className="space-y-4">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-3 border rounded-full py-3 px-4"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 12.3c0-.7-.1-1.3-.2-1.9H12v3.6h5.6c-.2 1.2-.9 2.3-1.9 3l3 2.3c1.7-1.6 2.7-3.9 2.7-6.9z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 22c2.7 0 5-0.9 6.7-2.4l-3-2.3c-.8.5-1.8.8-3.7.8-2.9 0-5.3-1.9-6.2-4.5L2.6 16C4.5 19.9 8 22 12 22z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.8 13.1c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L2.6 6.6C1 9 1 12 2.6 14.4l3.2-1.3z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.1c1.5 0 2.9.5 4 1.5l3-3C17 1.7 14.7 1 12 1 8 1 4.5 3.1 2.6 6.6l3.2 1.3C6.7 7 9.1 5.1 12 5.1z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex-1 h-px bg-gray-200" />
                OR CONTINUE WITH EMAIL
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <label className="block relative">
                <span className="text-sm text-gray-700">Email</span>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <Input
                    {...register("email")}
                    type="email"
                    className="pl-10"
                    placeholder="your.email@example.com"
                  />
                </div>
              </label>

              <label className="block relative">
                <span className="text-sm text-gray-700">Password</span>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <Input
                    {...register("password")}
                    type="password"
                    className="pl-10"
                    placeholder="Enter your password"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6">
              <Button
                className="w-full rounded-full bg-[rgb(31,82,78)] text-white hover:opacity-95 transition duration-250"
                type="submit"
              >
                Sign in
              </Button>
            </div>

            <div className="mt-4 text-sm text-center text-gray-600">
              <a href="/forgot-password" className="text-emerald-700">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
