import { NextRequest } from "next/server";

// this looks really stupid, but it is how it is. There is barely any library to be able to test
// edge-function-style route handles.
export function createMockRequest({
  method,
  searchParams,
  json,
  headers,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  searchParams?: URLSearchParams;
  json?: any;
  headers?: Record<string, string>;
}): NextRequest {
  return {
    method,
    nextUrl: {
      searchParams: searchParams,
    },
    json: () => new Promise((resolve) => resolve(json)),
    headers: new Headers(headers), // thank god the class Headers is very simple
  } as unknown as NextRequest;
}

export function zip<A, B, ListA extends A[] = A[], ListB extends B[] = B[]>(
  a: ListA,
  b: ListB
): [A, B][] {
  return a.map((k: A, i: number) => [k, b[i]]);
}

export function sleep(millis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
