"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setFocus,
  } = useForm();
  const router = useRouter();
  const { login } = useAuth();

  // Quản lý ẩn/hiện mật khẩu
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorData, setErrorData] = useState({
    title: "",
    message: "",
    type: "",
    suggestions: [],
  });

  const mutation = useMutation({
    mutationFn: (loginData) => axios.post("/api/user/login", loginData),
    onSuccess: (response) => {
      const { user, token, expiresAt, message } = response.data;
      toast.success(message);

      // Đóng modal lỗi nếu đang mở
      setShowErrorModal(false);

      // Lưu thông tin user và token vào context
      login({ user, token, expiresAt });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      const code = error.response?.data?.code || "GENERAL_ERROR";
      const status = error.response?.status;

      if (code === "USER_NOT_FOUND" || status === 404) {
        setErrorData({
          title: "Tài khoản không tồn tại",
          message: "Email bạn nhập không tồn tại trong hệ thống.",
          type: "not_found",
          suggestions: [
            "Kiểm tra lại địa chỉ email",
            "Đảm bảo email được viết đúng chính tả",
            "Bạn có thể đăng ký tài khoản mới nếu chưa có",
          ],
        });
        setShowErrorModal(true);
        setFocus("email");
      } else if (code === "WRONG_PASSWORD" || status === 401) {
        setErrorData({
          title: "Mật khẩu không chính xác",
          message: "Mật khẩu bạn nhập không khớp với tài khoản này.",
          type: "wrong_password",
          suggestions: [
            "Kiểm tra xem Caps Lock có đang bật không",
            "Nhập lại mật khẩu cẩn thận",
            "Sử dụng tính năng 'Quên mật khẩu' nếu cần",
          ],
        });
        setShowErrorModal(true);
        setFocus("password");
      } else {
        setErrorData({
          title: "Lỗi đăng nhập",
          message: message,
          type: "general",
          suggestions: [
            "Thử lại sau vài phút",
            "Kiểm tra kết nối mạng",
            "Liên hệ quản trị viên nếu lỗi tiếp diễn",
          ],
        });
        setShowErrorModal(true);
      }

      if (code === "USER_NOT_FOUND") {
        setError("email", {
          type: "manual",
          message: "Tài khoản không tồn tại",
        });
      } else if (code === "WRONG_PASSWORD") {
        setError("password", {
          type: "manual",
          message: "Mật khẩu không chính xác",
        });
      }
    },
  });

  const loading = mutation.isPending;

  const onSubmit = (data) => {
    setShowErrorModal(false);
    clearErrors();
    mutation.mutate(data);
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    clearErrors();
  };

  useEffect(() => {
    if (showErrorModal) {
      if (errorData.type === "not_found") {
        setFocus("email");
      } else if (errorData.type === "wrong_password") {
        setFocus("password");
      }
    }
  }, [showErrorModal, errorData.type, setFocus]);

  const getInputErrorStyle = (fieldName) => {
    if (
      (errorData.type === "not_found" && fieldName === "email") ||
      (errorData.type === "wrong_password" && fieldName === "password")
    ) {
      return "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_1px_#ef4444,_0_0_0_3px_rgba(239,68,68,0.2)]";
    }
    return "";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101922] font-[Work_Sans] w-full relative">
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="relative w-full max-w-md animate-fadeIn">
            <div className="rounded-xl bg-[#1A202C] border border-[#2D3748] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#2D3748]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg mr-3 ${
                        errorData.type === "not_found"
                          ? "bg-red-900/30"
                          : errorData.type === "wrong_password"
                          ? "bg-orange-900/30"
                          : "bg-gray-700/30"
                      }`}
                    >
                      {errorData.type === "not_found" ? (
                        <svg
                          className="w-6 h-6 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                      ) : errorData.type === "wrong_password" ? (
                        <svg
                          className="w-6 h-6 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-6a3 3 0 110-6 3 3 0 010 6z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {errorData.title}
                      </h3>
                      <p className="text-sm text-[#9dabb9] mt-1">
                        {errorData.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="ml-4 p-2 hover:bg-[#2D3748] rounded-lg transition-colors"
                    aria-label="Đóng"
                  >
                    <svg
                      className="w-5 h-5 text-[#9dabb9]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[#9dabb9] mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Gợi ý khắc phục:
                  </h4>
                  <ul className="space-y-2">
                    {errorData.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-[#CBD5E0]">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#2D3748] text-white font-medium hover:bg-[#374151] transition-colors"
                  >
                    Đóng
                  </button>
                  {errorData.type === "not_found" && (
                    <Link
                      href="/register"
                      className="flex-1 py-2.5 px-4 rounded-lg bg-[#137fec] text-white font-medium hover:bg-blue-600 transition-colors text-center"
                      onClick={handleCloseModal}
                    >
                      Đăng ký ngay
                    </Link>
                  )}
                  {errorData.type === "wrong_password" && (
                    <Link
                      href="/forgot-password"
                      className="flex-1 py-2.5 px-4 rounded-lg bg-[#137fec] text-white font-medium hover:bg-blue-600 transition-colors text-center"
                      onClick={handleCloseModal}
                    >
                      Quên mật khẩu
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full max-w-md flex-col items-center z-10">
        <div className="w-full rounded-xl bg-[#1A202C] p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Đăng nhập</h2>
            <p className="text-sm text-[#9dabb9] mt-2">
              Đăng nhập để tiếp tục vào hệ thống
            </p>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#9dabb9]"
                >
                  Email
                </label>
                {errors.email?.type === "manual" && (
                  <span className="text-xs text-red-400 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-[#9dabb9]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  {...register("email", {
                    required: "Vui lòng nhập email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                  className={`w-full h-12 rounded-lg bg-[#2D3748] border ${
                    errors.email ? "border-red-500" : "border-transparent"
                  } text-white placeholder:text-[#9dabb9] outline-none text-base pl-10 pr-4 transition-all ${
                    errors.email ? "animate-shake" : ""
                  }`}
                  id="email"
                  placeholder="Nhập email của bạn"
                  type="email"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {errors.email && errors.email.type !== "manual" && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#9dabb9]"
                >
                  Mật khẩu
                </label>
                {errors.password?.type === "manual" && (
                  <span className="text-xs text-red-400 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-[#9dabb9]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                  className={`w-full h-12 rounded-lg bg-[#2D3748] border ${
                    errors.password ? "border-red-500" : "border-transparent"
                  } text-white placeholder:text-[#9dabb9] outline-none text-base pl-10 pr-10 transition-all ${
                    errors.password ? "animate-shake" : ""
                  }`}
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  type={passwordVisible ? "text" : "password"}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white transition-colors border-none bg-transparent p-0 cursor-pointer flex items-center justify-center"
                  type="button"
                  title={passwordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
              {errors.password && errors.password.type !== "manual" && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              className={`flex h-12 w-full items-center justify-center rounded-lg bg-[#137fec] text-base font-bold text-white transition-all hover:bg-blue-600/90 border-none cursor-pointer shadow-lg hover:shadow-xl ${
                loading ? "opacity-70 cursor-wait" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
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
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-[#9dabb9]">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-[#137fec] font-medium hover:text-white transition-colors underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
