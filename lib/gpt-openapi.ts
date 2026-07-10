import { houseModules } from "@/lib/modules";

const MODULE_KEYS = houseModules.map((module) => module.key);

export function buildGptOpenApiSpec(origin: string) {
  return {
    openapi: "3.1.0",
    info: {
      title: "House OS GPT Access",
      description:
        "Secure read and write access to House OS institutional memory for the private GPT owned by The House of Amey Marathe.",
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
        },
        post: {
          operationId: "createHouseRecord",
          summary: "Create a House OS record",
          description:
            "Creates a new House OS record for the pinned founder account. Use this only when the founder explicitly asks you to preserve a decision, principle, project update, relationship note, wealth framework, codex entry, or prophetic record.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HouseEntryCreate" }
              }
            }
          },
          responses: {
            "201": {
              description: "Created House OS record",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["record"],
                    properties: {
                      record: { $ref: "#/components/schemas/HouseEntry" }
                    }
                  }
                }
              }
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "503": { $ref: "#/components/responses/NotConfigured" }
          }
        }
      },
      "/api/gpt/entries/{id}": {
        get: {
          operationId: "getHouseRecord",
          summary: "Get one House OS record",
          description: "Retrieves one House OS record by id from the pinned founder account.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "House OS record id."
            }
          ],
          responses: {
            "200": {
              description: "House OS record",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["record"],
                    properties: {
                      record: { $ref: "#/components/schemas/HouseEntry" }
                    }
                  }
                }
              }
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { $ref: "#/components/responses/NotFound" },
            "503": { $ref: "#/components/responses/NotConfigured" }
          }
        },
        patch: {
          operationId: "updateHouseRecord",
          summary: "Update a House OS record",
          description:
            "Updates a specific House OS record by id. Use this to keep an existing record current; do not overwrite founder context unless the founder asks for the edit.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "House OS record id."
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HouseEntryUpdate" }
              }
            }
          },
          responses: {
            "200": {
              description: "Updated House OS record",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["record"],
                    properties: {
                      record: { $ref: "#/components/schemas/HouseEntry" }
                    }
                  }
                }
              }
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { $ref: "#/components/responses/NotFound" },
            "503": { $ref: "#/components/responses/NotConfigured" }
          }
        }
      },
      "/api/gpt/daily-update": {
        post: {
          operationId: "upsertDailyHouseUpdate",
          summary: "Create or update the daily House OS operating update",
          description:
            "Creates or updates one daily operating update for the pinned founder account. Use this once per day to preserve the day's decisions, progress, risks, relationship notes, wealth observations, and founder-level context.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DailyUpdateInput" }
              }
            }
          },
          responses: {
            "200": {
              description: "Updated existing daily House OS record",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DailyUpdateResult" }
                }
              }
            },
            "201": {
              description: "Created new daily House OS record",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DailyUpdateResult" }
                }
              }
            },
            "400": { $ref: "#/components/responses/BadRequest" },
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
        BadRequest: {
          description: "The request body is malformed or missing required House OS fields."
        },
        Unauthorized: {
          description: "Missing or invalid House OS GPT bearer token."
        },
        NotFound: {
          description: "The requested House OS record was not found for the pinned founder account."
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
              type: ["string", "null"]
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        HouseEntryCreate: {
          type: "object",
          required: ["module", "title", "category", "entry_date", "body"],
          properties: {
            module: { type: "string", enum: MODULE_KEYS },
            title: { type: "string", maxLength: 180 },
            category: { type: "string", maxLength: 120 },
            tags: {
              type: "array",
              items: { type: "string", maxLength: 48 },
              maxItems: 24,
              default: []
            },
            entry_date: { type: "string", format: "date" },
            body: { type: "string", maxLength: 20000 },
            context: {
              type: ["string", "null"],
              maxLength: 8000
            }
          }
        },
        HouseEntryUpdate: {
          type: "object",
          minProperties: 1,
          properties: {
            module: { type: "string", enum: MODULE_KEYS },
            title: { type: "string", maxLength: 180 },
            category: { type: "string", maxLength: 120 },
            tags: {
              type: "array",
              items: { type: "string", maxLength: 48 },
              maxItems: 24
            },
            entry_date: { type: "string", format: "date" },
            body: { type: "string", maxLength: 20000 },
            context: {
              type: ["string", "null"],
              maxLength: 8000
            }
          }
        },
        DailyUpdateInput: {
          type: "object",
          required: ["body"],
          properties: {
            date: {
              type: "string",
              format: "date",
              description: "Daily update date. Defaults to the current Asia/Kolkata date when omitted."
            },
            module: {
              type: "string",
              enum: MODULE_KEYS,
              default: "projects"
            },
            title: {
              type: "string",
              maxLength: 180,
              description: "Defaults to Daily House OS Update - YYYY-MM-DD."
            },
            category: {
              type: "string",
              maxLength: 120,
              default: "Daily Operating Update"
            },
            tags: {
              type: "array",
              items: { type: "string", maxLength: 48 },
              maxItems: 24
            },
            body: {
              type: "string",
              maxLength: 20000,
              description: "Daily operating update content to preserve in House OS."
            },
            context: {
              type: ["string", "null"],
              maxLength: 8000
            }
          }
        },
        DailyUpdateResult: {
          type: "object",
          required: ["action", "record"],
          properties: {
            action: {
              type: "string",
              enum: ["created", "updated"]
            },
            record: { $ref: "#/components/schemas/HouseEntry" }
          }
        }
      }
    }
  };
}

export function gptOpenApiHeaders() {
  return {
    "Access-Control-Allow-Headers": "Authorization, Content-Type, x-house-os-token",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=60, s-maxage=300",
    "Content-Type": "application/json; charset=utf-8"
  };
}
