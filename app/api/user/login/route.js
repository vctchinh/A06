import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // 7 ngày

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Vui lòng nhập email và mật khẩu",
          code: "MISSING_CREDENTIALS",
        },
        { status: 400 }
      );
    }

    // 2. Tìm user trong Database theo email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "Tài khoản không tồn tại",
          code: "USER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // 3. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Sai mật khẩu",
          code: "WRONG_PASSWORD",
        },
        { status: 401 }
      );
    }

    // 4. Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || "User",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5. Tính thời gian hết hạn (FIXED)
    const expiresIn = JWT_EXPIRES_IN;
    const expiresAt = new Date();

    // Parse thời gian hết hạn
    const timeValue = parseInt(expiresIn);

    if (expiresIn.includes("d")) {
      expiresAt.setDate(expiresAt.getDate() + timeValue);
    } else if (expiresIn.includes("h")) {
      expiresAt.setHours(expiresAt.getHours() + timeValue);
    } else if (expiresIn.includes("m")) {
      expiresAt.setMinutes(expiresAt.getMinutes() + timeValue);
    } else {
      // Mặc định 7 ngày nếu định dạng không hợp lệ
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    // 6. Thành công -> Trả về thông tin user và token
    return NextResponse.json(
      {
        message: "Đăng nhập thành công",
        token,
        expiresAt: expiresAt.toISOString(),
        user: {
          id: user._id,
          email: user.email,
          name: user.name || user.email,
          role: user.role || "User",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      {
        message: "Lỗi Server",
        error: error.message,
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
