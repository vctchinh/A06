"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch, // 👇 Dùng cái này để xem giá trị password hiện tại
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // API Call
  const mutation = useMutation({
    mutationFn: (newUser) => axios.post("/api/user/register", newUser),
    onSuccess: () => {
      toast.success("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => router.push("/login"), 1500);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Lỗi đăng ký");
    },
  });

  const onSubmit = (data) => {
    // Gửi dữ liệu lên server (chỉ cần email và password, không cần confirmPassword)
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  // Theo dõi giá trị password để so sánh
  const password = watch("password");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101922] font-[Work_Sans] w-full">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Register Card */}
        <div className="w-full rounded-xl bg-[#1A202C] p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Sign Up</h2>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Input */}
            <div className="flex flex-col">
              <label className="mb-1.5 block text-sm font-medium text-[#9dabb9]">
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
                  placeholder="Enter your email"
                  type="email"
                  disabled={mutation.isPending}
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
              <label className="mb-1.5 block text-sm font-medium text-[#9dabb9]">
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
                  placeholder="Enter your password"
                  type={passwordVisible ? "text" : "password"}
                  disabled={mutation.isPending}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white transition-colors border-none bg-transparent p-0 cursor-pointer flex items-center justify-center"
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {/* 👇 Thêm Icon vào đây */}
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

            {/* Confirm Password Input */}
            <div className="flex flex-col">
              <label className="mb-1.5 block text-sm font-medium text-[#9dabb9]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match", // 👇 Validate trực tiếp
                  })}
                  className="w-full h-12 rounded-lg bg-[#2D3748] border border-transparent text-white placeholder:text-[#9dabb9] outline-none text-base pl-10 pr-10 transition-shadow focus:border-[#137fec] focus:shadow-[0_0_0_1px_#137fec,_0_0_0_3px_rgba(19,127,236,0.2)]"
                  placeholder="Confirm your password"
                  type={confirmPasswordVisible ? "text" : "password"}
                  disabled={mutation.isPending}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white transition-colors border-none bg-transparent p-0 cursor-pointer flex items-center justify-center"
                  type="button"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  {/* 👇 Thêm Icon vào đây */}
                  {confirmPasswordVisible ? (
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
              {errors.confirmPassword && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Register Button */}
            <button
              className={`flex h-12 w-full items-center justify-center rounded-lg bg-[#137fec] text-base font-bold text-white transition-colors hover:bg-blue-600/90 border-none cursor-pointer ${
                mutation.isPending ? "opacity-70 cursor-wait" : ""
              }`}
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
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
                "Sign Up"
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-[#9dabb9]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#137fec] font-medium hover:text-white transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
