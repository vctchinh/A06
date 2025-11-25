// FILE: app/api/user/register/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. Validate
    if (!email || !password) {
      return NextResponse.json(
        { message: "Thiếu email hoặc mật khẩu" },
        { status: 400 }
      );
    }

    // 2. Kiểm tra user đã tồn tại chưa (Logic Đăng ký)
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // ❌ Nếu TÌM THẤY user -> Báo lỗi "Email đã tồn tại"
      return NextResponse.json(
        { message: "Email này đã được đăng ký" },
        { status: 409 }
      );
    }

    // 3. Nếu KHÔNG tìm thấy -> Tạo mới (Đây là phần code bạn đang thiếu/sai)
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Đăng ký thành công" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi Server", error: error.message },
      { status: 500 }
    );
  }
}
