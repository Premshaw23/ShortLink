import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserUrls } from "@/models/Url";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions, req);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user?.email;
  const urls = await getUserUrls(userId);
  return Response.json({ urls });
}
