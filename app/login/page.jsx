"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { login } = useAuth();

  // Quản lý ẩn/hiện mật khẩu
  const [passwordVisible, setPasswordVisible] = useState(false);

  // React Query
  // React Query
  const mutation = useMutation({
    mutationFn: (loginData) => axios.post("/api/user/login", loginData),
    onSuccess: (response) => {
      const { user, token, expiresAt, message } = response.data;
      toast.success(message);

      // Lưu thông tin user và token vào context
      login({ user, token, expiresAt });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      toast.error(message);
    },
  });

  // Biến Loading
  const loading = mutation.isPending;

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101922] font-[Work_Sans] w-full">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Login Card */}
        <div className="w-full rounded-xl bg-[#1A202C] p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Login</h2>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Input */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#9dabb9]"
              >
                Email
              </label>
              <div className="relative">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full h-12 rounded-lg bg-[#2D3748] border border-transparent text-white placeholder:text-[#9dabb9] outline-none text-base pl-10 pr-4 transition-shadow focus:border-[#137fec] focus:shadow-[0_0_0_1px_#137fec,_0_0_0_3px_rgba(19,127,236,0.2)]"
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#9dabb9]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full h-12 rounded-lg bg-[#2D3748] border border-transparent text-white placeholder:text-[#9dabb9] outline-none text-base pl-10 pr-10 transition-shadow focus:border-[#137fec] focus:shadow-[0_0_0_1px_#137fec,_0_0_0_3px_rgba(19,127,236,0.2)]"
                  id="password"
                  placeholder="Enter your password"
                  type={passwordVisible ? "text" : "password"}
                  disabled={loading}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white transition-colors border-none bg-transparent p-0 cursor-pointer flex items-center justify-center"
                  type="button"
                  title="Toggle Password Visibility"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Login Button */}
            <button
              className={`flex h-12 w-full items-center justify-center rounded-lg bg-[#137fec] text-base font-bold text-white transition-colors hover:bg-blue-600/90 border-none cursor-pointer ${
                loading ? "opacity-70 cursor-wait" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-[#9dabb9]">
            Don`t have an account?{" "}
            <Link
              href="/register"
              className="text-[#137fec] font-medium hover:text-white transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
