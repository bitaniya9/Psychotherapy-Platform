import Head from "next/head";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { forgotPassword } from "../lib/api";
import { Input } from "@/components/ui/input";
import Button from "../components/Button";
import { Mail } from "lucide-react";

type Form = { email: string };

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm<Form>();
  const router = useRouter();

  const onSubmit = async (data: Form) => {
    try {
      await forgotPassword(data.email);
      toast.success(
        "If an account exists we sent password reset instructions to the email"
      );
      // Optionally navigate to a confirmation page or back to login
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      const serverMessage = err?.response?.data?.message || err?.message;
      toast.error(serverMessage || "Failed to request password reset");
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Melkam</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Forgot password
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Enter your account email and we'll send you instructions to reset
            your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div>
              <Button
                className="w-full rounded-full bg-[rgb(31,82,78)] text-white"
                type="submit"
              >
                Send reset email
              </Button>
            </div>

            <div className="mt-4 text-sm text-center text-gray-600">
              Remembered your password?{" "}
              <a href="/login" className="text-emerald-700">
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
