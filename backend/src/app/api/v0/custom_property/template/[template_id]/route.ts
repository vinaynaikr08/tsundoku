const sdk = require("node-appwrite");

import { NextRequest, NextResponse } from "next/server";

import { client } from "@/app/appwrite";
import {
  construct_development_api_response,
  handle_error,
} from "@/app/api/v0/dev_api_response";
import Constants from "@/app/Constants";
import {
  checkUserToken,
  getUserContextDBAccount,
} from "@/app/api/v0/userContext";
import { Query } from "node-appwrite";
import { getOrFailAuthTokens } from "../../../helpers";

const database = new sdk.Databases(client);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { template_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const { userDB } = getUserContextDBAccount(authToken);

  const data = await request.json();
  const template_id = params.template_id;
  const name = data.name;
  const type = data.type;

  if (!name && !type) {
    return NextResponse.json(
      {
        message:
          "Warning: you're attempting to edit the template, but didn't supply any of the parameters.",
      },
      { status: 400 },
    );
  }

  let db_query: any;
  try {
    db_query = await userDB.getDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
      template_id,
    );
  } catch (error: any) {
    return handle_error(error);
  }

  if (db_query.total == 0) {
    return construct_development_api_response({
      message:
        "The specified ID does not have an associated custom property template!",
      status_code: 404,
    });
  } else {
    try {
      await userDB.updateDocument(
        Constants.MAIN_DB_ID,
        Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
        template_id,
        Object.assign({}, name ? { name } : null, type ? { type } : null),
      );
    } catch (error: any) {
      return handle_error(error);
    }
  }

  return construct_development_api_response({
    message: `The custom property template was updated.`,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { template_id: string } },
) {
  const authToken = getOrFailAuthTokens();
  if (authToken instanceof NextResponse) return authToken;

  const user_id = await checkUserToken(authToken);
  if (user_id instanceof NextResponse) return user_id;

  const template_id = params.template_id;

  let db_query: any;
  try {
    db_query = await database.getDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
      template_id,
    );
  } catch (error) {
    return handle_error(error);
  }

  try {
    // Check if user is the owner of the template
    if (db_query.user_id !== user_id) {
      return construct_development_api_response({
        message: "You are not the owner of ths custom property template.",
        status_code: 401,
      });
    }

    // Get all associated category documents and delete them
    const category_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_CATEGORY_COL_ID,
      [Query.equal("template_id", template_id)],
    );

    for (const category_id of category_query.documents.map((item: any) => {
      return item.$id;
    })) {
      await database.deleteDocument(
        Constants.MAIN_DB_ID,
        Constants.CUSTOM_PROP_CATEGORY_COL_ID,
        category_id,
      );
    }

    // Get all associated data documents and delete them
    const data_query = await database.listDocuments(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_DATA_COL_ID,
      [Query.equal("template_id", template_id)],
    );

    for (const data_id of data_query.documents.map((item: any) => {
      return item.$id;
    })) {
      await database.deleteDocument(
        Constants.MAIN_DB_ID,
        Constants.CUSTOM_PROP_DATA_COL_ID,
        data_id,
      );
    }
  } catch (error) {
    return handle_error(error);
  }

  try {
    await database.deleteDocument(
      Constants.MAIN_DB_ID,
      Constants.CUSTOM_PROP_TEMPLATE_COL_ID,
      template_id,
    );
  } catch (error: any) {
    return handle_error(error);
  }

  return construct_development_api_response({
    message: `The custom property template was deleted.`,
  });
}
