import Head from "next/head";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { verifyEmail } from "../lib/api";
import { Input } from "@/components/ui/input";
import Button from "../components/Button";

type VerifyForm = {
  email: string;
  otp: string;
};

export default function VerifyEmailPage() {
  const { register, handleSubmit, setValue } = useForm<VerifyForm>();
  const router = useRouter();

  // Prefill email if present in query (e.g. redirected from register)
  useEffect(() => {
    if (router.query.email && typeof router.query.email === "string") {
      setValue("email", router.query.email);
    }
  }, [router.query.email, setValue]);

  const onSubmit = async (data: VerifyForm) => {
    try {
      await verifyEmail(data.email, data.otp);
      toast.success("Email verified — you can now log in");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || err?.message || "Verification failed"
      );
    }
  };

  return (
    <>
      <Head>
        <title>Verify Email - Melkam</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Verify your email
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Enter the verification code sent to your email to complete
            registration.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Email</span>
              <Input
                {...register("email")}
                type="email"
                placeholder="your.email@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">
                Verification code (OTP)
              </span>
              <Input {...register("otp")} placeholder="123456" />
            </label>

            <div className="mt-4">
              <Button
                className="w-full rounded-full bg-emerald-700 text-white"
                type="submit"
              >
                Verify Email
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
