"use server";

import { cookies } from "next/headers";

export async function loginAction(values: { email: string; password: string }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Login failed.",
      };
    }

    // Set httpOnly cookie on Vercel domain — safe and secure
    const cookieStore = await cookies();
    cookieStore.set("access_token", data.data.accessToken, {
      httpOnly: true,                              // JS cannot read it — XSS safe
      secure: true,                               // HTTPS only
      sameSite: "lax",                            // same origin — lax is fine
      maxAge: 24 * 60 * 60,                       // 24 hours
      path: "/",
    });

    return {
      success: true,
      message: data.message,
      user: data.data.user,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token"); // clears cookie on Vercel domain
}