import { houseModules } from "@/lib/modules";

const MODULE_KEYS = houseModules.map((module) => module.key);

export function buildGptOpenApiSpec(origin: string) {
  return {
    openapi: "3.0.3",
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
    security: [{ bearerAuth: [] }],
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
                    required: ["totalRecords", "activeModules", "modules", "categories", "recentEntries"],
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
                enum: MODULE_KEYS
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
                    required: ["count", "records"],
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
          bearerFormat: "token"
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
          required: ["module", "label", "count"],
          properties: {
            module: { type: "string", enum: MODULE_KEYS },
            label: { type: "string" },
            count: { type: "integer" }
          }
        },
        CategoryCount: {
          type: "object",
          required: ["category", "count"],
          properties: {
            category: { type: "string" },
            count: { type: "integer" }
          }
        },
        HouseEntry: {
          type: "object",
          required: ["id", "module", "title", "category", "tags", "entry_date", "body", "created_at", "updated_at"],
          properties: {
            id: { type: "string", format: "uuid" },
            module: { type: "string", enum: MODULE_KEYS },
            title: { type: "string" },
            category: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" }
            },
            entry_date: { type: "string", format: "date" },
            body: { type: "string" },
            context: {
              type: "string",
              nullable: true
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        }
      }
    }
  };
}

export function gptOpenApiHeaders() {
  return {
    "Access-Control-Allow-Headers": "Authorization, Content-Type, x-house-os-token",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=60, s-maxage=300",
    "Content-Type": "application/json; charset=utf-8"
  };
}
