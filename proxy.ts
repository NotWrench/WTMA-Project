import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // biome-ignore lint/complexity/noVoid: why not
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"],
};
