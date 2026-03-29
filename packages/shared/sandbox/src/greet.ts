/**
 * Options for the {@link greet} function.
 *
 * @example
 * ```ts
 * const options: GreetOptions = { name: "World", greeting: "Hello" };
 * ```
 */
export interface GreetOptions {
  /** The name to greet. */
  name: string;
  /**
   * A custom greeting prefix.
   *
   * @defaultValue `"Hello"`
   */
  greeting?: string;
}

/**
 * Returns a greeting message.
 *
 * @param options - The greeting options.
 * @returns A formatted greeting string.
 *
 * @example
 * ```ts
 * greet({ name: "World" });
 * // => "Hello, World!"
 *
 * greet({ name: "Portal", greeting: "Welcome" });
 * // => "Welcome, Portal!"
 * ```
 */
export function greet(options: GreetOptions): string {
  const { name, greeting = "Hello" } = options;
  return `${greeting}, ${name}!`;
}
