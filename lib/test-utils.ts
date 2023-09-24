import { NextRequest } from "next/server";

// this looks really stupid, but it is how it is. There is barely any library to be able to test
// edge-function-style route handles.
export function createMockRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  json: any,
  headers: Record<string, string> = {}
): NextRequest {
  return {
    method,
    json: () => new Promise((resolve) => resolve(json)),
    headers: new Headers(headers), // thank god the class Headers is very simple
  } as unknown as NextRequest;
}

export function zip<A, B, ListA extends A[], ListB extends B[]>(
  a: ListA,
  b: ListB
): [A, B][] {
  return a.map((k: A, i: number) => [k, b[i]]);
}
