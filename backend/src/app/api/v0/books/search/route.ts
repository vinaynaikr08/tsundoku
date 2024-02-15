import { NextRequest, NextResponse } from "next/server";
import { Databases, Query } from "appwrite";

import { client } from "@/app/appwrite";
const databases = new Databases(client);

// const GOOGLE_BOOKS_API_KEY = "AIzaSyDdeix16-v0urpjbY5x9PMDGgxgMKQrHeU";

export async function GET(request: NextRequest) {
    const title = request.nextUrl.searchParams.get("title");

    let db_query = await databases.listDocuments(
        "65ce2a55036051cbf5fb", // Main
        "65ce2a5a8bea7335ef01", // Books
        [
            Query.equal('title', title as string)
        ]
    );
    console.log(db_query);


    return NextResponse.json({ message: `DB search results for: ${title}`, db_query }, { status: 200 });
}
