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
  b: ListB,
): [A, B][] {
  return a.map((k: A, i: number) => [k, b[i]]);
}

export function sleep(millis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export function classNameOfScore(score: number): string {
  if (score < 50) {
    return "text-red-700";
  } else if (score < 75) {
    return "text-amber-700";
  } else if (score < 85) {
    return "text-lime-700";
  } else {
    return "text-green-700";
  }
}

export function sec(time: `${number}:${number}`): number {
  const [hours, minutes] = time.split(":", 2).map((s) => Number(s));
  return minutes * 60 + hours * 60 * 60;
}

export function searchParamsToObject(
  searchParams: URLSearchParams,
): Record<string, string> {
  return Array.from(searchParams).reduce(
    (prev, [key, value]) => {
      prev[key] = value;
      return prev;
    },
    {} as Record<string, string>,
  );
}
