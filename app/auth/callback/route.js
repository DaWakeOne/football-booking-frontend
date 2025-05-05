import { NextResponse } from "next/server"

export async function GET(request) {
  // Simplified callback handler
  return NextResponse.redirect(new URL("/", request.url))
}
