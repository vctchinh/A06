import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. Tìm user trong Database theo email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Tài khoản không tồn tại" },
        { status: 401 }
      );
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Sai mật khẩu" }, { status: 401 });
    }

    // 3. Thành công -> Trả về thông tin user đầy đủ
    return NextResponse.json(
      {
        message: "Đăng nhập thành công",
        user: {
          id: user._id,
          email: user.email,
          name: user.name || user.email, // Fallback to email if name doesn't exist
          role: user.role || "User", // Fallback role
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Lỗi Server", error: error.message },
      { status: 500 }
    );
  }
}
