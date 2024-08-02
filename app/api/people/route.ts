import { PrismaClient } from "@prisma/client";
// import prisma from "@/app/lib/prisma.config";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const people = await prisma.person
      .findMany()
      .catch((err) => console.log("Error getting people pgclient", err));

    console.log("Get people", { people });
    return new Response(JSON.stringify(people), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log("Error while fetching peoples", err);

    return new Response(JSON.stringify(err), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { firstname, lastname, phone } = body;
    if (!firstname || !lastname || !phone) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    const person = await prisma.person.create({
      data: {
        firstname,
        lastname,
        phone,
      },
    });

    //return the data record
    return new Response(JSON.stringify(person), {
      status: 202,
    });
  } catch (error) {
    return new Response("Error", {
      status: 500,
    });
  }
}
