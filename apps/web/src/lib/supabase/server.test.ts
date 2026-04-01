import { afterEach, describe, expect, it, vi } from "vitest";
import { createSupabaseServerClient } from "./server";

interface CookieOptions {
  cookies: {
    getAll: () => { name: string; value: string }[];
    setAll: (
      cookies: { name: string; value: string; options: unknown }[],
    ) => void;
  };
}

let capturedOptions: CookieOptions | undefined;

const mockParseCookieHeader = vi.fn(
  (header: string): { name: string; value: string | null }[] => {
    if (!header) return [];
    return header.split("; ").map((pair) => {
      const [name, ...rest] = pair.split("=");
      return { name: name ?? "", value: rest.join("=") };
    });
  },
);

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: CookieOptions) => {
    capturedOptions = options;
    return { from: vi.fn() };
  },
  parseCookieHeader: (...args: [string]) => mockParseCookieHeader(...args),
  serializeCookieHeader: (name: string, value: string, _options: unknown) =>
    `${name}=${value}; Path=/`,
}));

describe("createSupabaseServerClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    capturedOptions = undefined;
    mockParseCookieHeader.mockClear();
  });

  it("returns { supabase, headers } when env vars are set", () => {
    vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");

    const request = new Request("http://localhost");
    const result = createSupabaseServerClient(request);

    expect(result).toHaveProperty("supabase");
    expect(result).toHaveProperty("headers");
    expect(result.headers).toBeInstanceOf(Headers);
  });

  it("throws when env vars are missing", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");

    const request = new Request("http://localhost");

    expect(() => createSupabaseServerClient(request)).toThrow(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables",
    );
  });

  it("cookie getAll parses request cookies", () => {
    vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");

    const mockHeaders = new Map([["Cookie", "session=abc123; token=xyz"]]);
    const request = {
      headers: { get: (name: string) => mockHeaders.get(name) ?? null },
    } as unknown as Request;
    createSupabaseServerClient(request);

    const cookies = capturedOptions?.cookies.getAll();
    expect(cookies).toEqual([
      { name: "session", value: "abc123" },
      { name: "token", value: "xyz" },
    ]);
  });

  it("cookie getAll filters out cookies with null value", () => {
    vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");

    const request = new Request("http://localhost", {
      headers: { Cookie: "a=1; b" },
    });
    createSupabaseServerClient(request);

    mockParseCookieHeader.mockReturnValueOnce([
      { name: "a", value: "1" },
      { name: "b", value: null },
    ]);

    const cookies = capturedOptions?.cookies.getAll();
    expect(cookies).toEqual([{ name: "a", value: "1" }]);
  });

  it("cookie setAll appends Set-Cookie headers", () => {
    vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");

    const request = new Request("http://localhost");
    const { headers } = createSupabaseServerClient(request);

    capturedOptions?.cookies.setAll([
      { name: "session", value: "new-value", options: { path: "/" } },
    ]);

    expect(headers.get("Set-Cookie")).toBe("session=new-value; Path=/");
  });
});
