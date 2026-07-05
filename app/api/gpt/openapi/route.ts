import { NextRequest, NextResponse } from "next/server";
import { houseModules } from "@/lib/modules";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const moduleKeys = houseModules.map((module) => module.key);

  return NextResponse.json({
    openapi: "3.1.0",
    info: {
      title: "House OS GPT Access",
      description:
        "Read-only access to House OS institutional memory for the private GPT owned by The House of Amey Marathe.",
      version: "0.1.0"
    },
    servers: [
      {
        url: origin,
        description: "House OS production server"
      }
    ],
    paths: {
      "/api/gpt/summary": {
        get: {
          operationId: "getHouseOsSummary",
          summary: "Get House OS dashboard summary",
          description:
            "Returns total records, active modules, module counts, category counts, and recent records from the private House OS archive.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "House OS summary",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalRecords: { type: "integer" },
                      activeModules: { type: "integer" },
                      modules: {
                        type: "array",
                        items: { $ref: "#/components/schemas/ModuleCount" }
                      },
                      categories: {
                        type: "array",
                        items: { $ref: "#/components/schemas/CategoryCount" }
                      },
                      recentEntries: {
                        type: "array",
                        items: { $ref: "#/components/schemas/HouseEntry" }
                      }
                    }
                  }
                }
              }
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "503": { $ref: "#/components/responses/NotConfigured" }
          }
        }
      },
      "/api/gpt/entries": {
        get: {
          operationId: "searchHouseRecords",
          summary: "Search House OS records",
          description:
            "Searches private House OS records by module, keyword, category, tag, and limit. Use this for founder memory retrieval with citations back to record titles and dates.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "q",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Keyword search across title, category, tags, body, context, and module."
            },
            {
              name: "module",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: moduleKeys
              },
              description: "Limit results to one House OS module."
            },
            {
              name: "category",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Filter by a category name or partial category name."
            },
            {
              name: "tag",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Filter by exact tag."
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 25
              },
              description: "Maximum number of records to return."
            }
          ],
          responses: {
            "200": {
              description: "Matching House OS records",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      count: { type: "integer" },
                      records: {
                        type: "array",
                        items: { $ref: "#/components/schemas/HouseEntry" }
                      }
                    }
                  }
                }
              }
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "503": { $ref: "#/components/responses/NotConfigured" }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "House OS GPT token"
        }
      },
      responses: {
        Unauthorized: {
          description: "Missing or invalid House OS GPT bearer token."
        },
        NotConfigured: {
          description: "House OS GPT access environment variables are missing."
        }
      },
      schemas: {
        ModuleCount: {
          type: "object",
          properties: {
            module: { type: "string", enum: moduleKeys },
            label: { type: "string" },
            count: { type: "integer" }
          }
        },
        CategoryCount: {
          type: "object",
          properties: {
            category: { type: "string" },
            count: { type: "integer" }
          }
        },
        HouseEntry: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            module: { type: "string", enum: moduleKeys },
            title: { type: "string" },
            category: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" }
            },
            entry_date: { type: "string", format: "date" },
            body: { type: "string" },
            context: {
              type: ["string", "null"]
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        }
      }
    }
  });
}
