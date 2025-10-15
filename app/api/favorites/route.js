import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

// ✅ POST: Add a favorite song
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    if (!session.user?.id) {
      console.error("User ID missing from session:", session);
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const { song } = await req.json();

    if (!song || song.trim() === "") {
      return NextResponse.json({ error: "Song name is required" }, { status: 400 });
    }

    const newFavorite = await prisma.favorite.create({
      data: {
        song: song.trim(),
        userId: session.user.id,
      },
    });

    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error("POST /favorites error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ GET: Get all favorites for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    if (!session.user?.id) {
      console.error("User ID missing from session:", session);
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("GET /favorites error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


// ✅ DELETE: Remove a favorite song
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Song ID is required" }, { status: 400 });
    }

    // Ensure the song belongs to the logged-in user
    const existing = await prisma.favorite.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.favorite.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /favorites error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


  
