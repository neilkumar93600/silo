import type OpenAI from "openai";
import { env } from "../env.js";
import { Errors } from "./errors.js";
import * as filesService from "../services/files.service.js";
import * as foldersService from "../services/folders.service.js";
import * as sharesService from "../services/shares.service.js";

export const ASSISTANT_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_storage_usage",
      description:
        "Get comprehensive storage usage statistics, breakdown by media type (images, videos, documents, etc.), list of largest files taking up space, and top folders by size.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_folders",
      description:
        "List all folders in the user's drive, including folder names, IDs, parent folder IDs, and creation dates. Use this to understand folder hierarchy or find a folder ID.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_folder",
      description: "Create a new folder in the user's drive.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name of the folder to create" },
          parentId: {
            type: ["string", "null"],
            description: "Parent folder ID to nest inside, or null for root level",
          },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "rename_folder",
      description: "Rename an existing folder.",
      parameters: {
        type: "object",
        properties: {
          folderId: { type: "string", description: "ID of the folder to rename" },
          name: { type: "string", description: "New name for the folder" },
        },
        required: ["folderId", "name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "move_folder",
      description: "Move a folder into another parent folder or to the root level.",
      parameters: {
        type: "object",
        properties: {
          folderId: { type: "string", description: "ID of the folder to move" },
          parentId: {
            type: ["string", "null"],
            description: "Target parent folder ID, or null for root level",
          },
        },
        required: ["folderId", "parentId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "trash_folder",
      description: "Move a folder and all its contents to the trash. Requires user confirmation.",
      parameters: {
        type: "object",
        properties: {
          folderId: { type: "string", description: "ID of the folder to trash" },
        },
        required: ["folderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "restore_folder",
      description: "Restore a trashed folder and its contents.",
      parameters: {
        type: "object",
        properties: {
          folderId: { type: "string", description: "ID of the folder to restore" },
        },
        required: ["folderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_files",
      description:
        "Search the user's files by name, media type, folder, starred status, or upload date range. Use this to find files the user describes before acting on them.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Substring to match against the filename" },
          type: { type: "string", enum: ["image", "video", "audio"], description: "Restrict to this media type" },
          folderId: {
            type: "string",
            description: 'Restrict to this folder\'s id, or "root" for top-level. Omit to search every folder.',
          },
          starred: { type: "boolean" },
          createdAfter: { type: "string", description: "ISO 8601 date; only files created on/after this" },
          createdBefore: { type: "string", description: "ISO 8601 date; only files created on/before this" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "move_file",
      description: "Move a file into a different folder, or to the top level.",
      parameters: {
        type: "object",
        properties: {
          fileId: { type: "string" },
          folderId: { type: ["string", "null"], description: "Target folder id, or null for the top level." },
        },
        required: ["fileId", "folderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "rename_file",
      description: "Rename a file.",
      parameters: {
        type: "object",
        properties: { fileId: { type: "string" }, name: { type: "string" } },
        required: ["fileId", "name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "star_file",
      description: "Star or unstar a file.",
      parameters: {
        type: "object",
        properties: { fileId: { type: "string" }, starred: { type: "boolean" } },
        required: ["fileId", "starred"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "restore_file",
      description: "Restore a trashed file.",
      parameters: {
        type: "object",
        properties: { fileId: { type: "string" } },
        required: ["fileId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_share_link",
      description: "Get a file's public share link. Only usable if the file is already public.",
      parameters: {
        type: "object",
        properties: { fileId: { type: "string" } },
        required: ["fileId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "trash_file",
      description: "Move a file to trash. Requires the user's confirmation before it runs.",
      parameters: {
        type: "object",
        properties: { fileId: { type: "string" } },
        required: ["fileId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "share_file",
      description: "Share a file with another Silo user by email. Requires the user's confirmation before it runs.",
      parameters: {
        type: "object",
        properties: { fileId: { type: "string" }, email: { type: "string" } },
        required: ["fileId", "email"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_visibility",
      description:
        "Change a file's visibility. Setting it to public requires the user's confirmation before it runs; setting it back to private does not.",
      parameters: {
        type: "object",
        properties: { fileId: { type: "string" }, visibility: { type: "string", enum: ["private", "public"] } },
        required: ["fileId", "visibility"],
      },
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function requiresConfirmation(name: string, args: any): boolean {
  if (name === "trash_file" || name === "share_file" || name === "trash_folder") return true;
  if (name === "set_visibility" && args?.visibility === "public") return true;
  return false;
}

// Some free/small models emit the literal string "none"/"null" instead of
// JSON null for nullable fields (e.g. "move to root"), which a bare `?? null`
// would not catch. Normalize those before they hit the DB layer.
function nullableId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "" || /^(none|null)$/i.test(trimmed)) return null;
  return trimmed;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeTool(name: string, args: any, ownerId: string): Promise<unknown> {
  switch (name) {
    case "get_storage_usage":
      return filesService.getStorageBreakdown(ownerId);
    case "list_folders":
      return foldersService.listAllFolders(ownerId);
    case "create_folder":
      return foldersService.createFolder(ownerId, args.name, nullableId(args.parentId));
    case "rename_folder":
      return foldersService.updateFolder(args.folderId, ownerId, { name: args.name });
    case "move_folder":
      return foldersService.updateFolder(args.folderId, ownerId, { parentId: nullableId(args.parentId) });
    case "trash_folder":
      return foldersService.trashFolder(args.folderId, ownerId);
    case "restore_folder":
      return foldersService.restoreFolder(args.folderId, ownerId);
    case "search_files":
      return filesService.searchFiles(ownerId, args ?? {});
    case "move_file":
      return filesService.updateFile(args.fileId, ownerId, { folderId: nullableId(args.folderId) });
    case "rename_file":
      return filesService.updateFile(args.fileId, ownerId, { originalName: args.name });
    case "star_file":
      return filesService.updateFile(args.fileId, ownerId, { starred: args.starred });
    case "restore_file":
      return filesService.restoreFile(args.fileId, ownerId);
    case "get_share_link": {
      const file = await filesService.getOwnedFileOrThrow(args.fileId, ownerId);
      return { url: `${env.WEB_ORIGIN}/s/${file.shareSlug}`, visibility: file.visibility };
    }
    case "trash_file":
      return filesService.trashFile(args.fileId, ownerId);
    case "share_file":
      return sharesService.addShare(args.fileId, ownerId, args.email);
    case "set_visibility":
      return filesService.updateFile(args.fileId, ownerId, { visibility: args.visibility });
    default:
      throw Errors.badRequest(`Unknown tool: ${name}`);
  }
}

// Best-effort human-readable summary for a confirmation card. Falls back to
// the raw id if the file/folder lookup fails for any reason.
export async function summarizeToolCall(
  call: { function: { name: string; arguments: string } },
  ownerId: string,
): Promise<string> {
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(call.function.arguments || "{}");
  } catch {
    // fall through with empty args
  }

  const fileId = typeof args.fileId === "string" ? args.fileId : undefined;
  const folderId = typeof args.folderId === "string" ? args.folderId : undefined;

  switch (call.function.name) {
    case "trash_file": {
      const fileName = await fileNameOrFallback(fileId, ownerId);
      return `Move file "${fileName}" to trash`;
    }
    case "trash_folder": {
      const folderName = await folderNameOrFallback(folderId, ownerId);
      return `Move folder "${folderName}" and all its contents to trash`;
    }
    case "share_file": {
      const fileName = await fileNameOrFallback(fileId, ownerId);
      return `Share "${fileName}" with ${String(args.email)}`;
    }
    case "set_visibility": {
      const fileName = await fileNameOrFallback(fileId, ownerId);
      return `Make "${fileName}" public`;
    }
    default:
      return `${call.function.name}(${call.function.arguments})`;
  }
}

async function fileNameOrFallback(fileId: string | undefined, ownerId: string): Promise<string> {
  if (!fileId) return "the file";
  try {
    const file = await filesService.getOwnedFileOrThrow(fileId, ownerId);
    return file.originalName;
  } catch {
    return fileId;
  }
}

async function folderNameOrFallback(folderId: string | undefined, ownerId: string): Promise<string> {
  if (!folderId) return "the folder";
  try {
    const folder = await foldersService.getOwnedFolderOrThrow(folderId, ownerId);
    return folder.name;
  } catch {
    return folderId;
  }
}
