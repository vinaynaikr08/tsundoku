import { NextRequest, NextResponse } from "next/server";
import { Databases, Query } from "appwrite";

import { client } from "@/app/appwrite";
const databases = new Databases(client);

// const GOOGLE_BOOKS_API_KEY = "AIzaSyDdeix16-v0urpjbY5x9PMDGgxgMKQrHeU";

export async function GET(request: NextRequest) {
    const name = request.nextUrl.searchParams.get("name");

    let db_query = await databases.listDocuments(
        "65ce2a55036051cbf5fb", // Main
        "65ce2aa3affa7165ee7b", // Authors
        [
            Query.equal('name', name as string)
        ]
    );
    console.log(db_query);


    return NextResponse.json({ message: `DB search results for: ${name}`, db_query }, { status: 200 });
}
