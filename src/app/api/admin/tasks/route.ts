import { NextResponse } from 'next/server';

// Temporary memory storage (In production, connect to a database)
let tasks: any[] = [];

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  tasks.push(body);
  return NextResponse.json({ success: true });
}

// 🚨 THIS IS THE FIX FOR REMOVING TASKS
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id !== null) {
    tasks.splice(parseInt(id), 1); // Removes the task from the array
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "No ID provided" }, { status: 400 });
}