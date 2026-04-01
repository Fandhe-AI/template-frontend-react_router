import { afterEach, describe, expect, it, vi } from "vitest";

const mockCreateBrowserClient = vi.fn((_url: string, _key: string) => ({
  from: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: (...args: [string, string]) =>
    mockCreateBrowserClient(...args),
}));

describe("createSupabaseBrowserClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    mockCreateBrowserClient.mockClear();
  });

  it("calls createBrowserClient with env vars when set", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-anon-key");

    const { createSupabaseBrowserClient } = await import("./client");
    createSupabaseBrowserClient();

    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
    );
  });

  it("throws when env vars are missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    const { createSupabaseBrowserClient } = await import("./client");

    expect(() => createSupabaseBrowserClient()).toThrow(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables",
    );
  });
});
