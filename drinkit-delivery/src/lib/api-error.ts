import { NextResponse } from "next/server";

export class ClientError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ClientError";
    this.status = status;
  }
}

export function isClientError(error: unknown): error is ClientError {
  return error instanceof ClientError;
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ClientError("Invalid JSON");
  }
}

export function jsonFromError(error: unknown): NextResponse {
  if (isClientError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : "Server error";
  return NextResponse.json({ error: message }, { status: 500 });
}
