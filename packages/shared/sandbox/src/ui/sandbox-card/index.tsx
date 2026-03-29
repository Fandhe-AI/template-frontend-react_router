/**
 * Props for the {@link SandboxCard} component.
 */
export interface SandboxCardProps {
  /** The card title. */
  title: string;
  /** The card description. */
  description: string;
}

/**
 * A simple card component used to verify Storybook, testing, and TypeDoc integration.
 *
 * @example
 * ```tsx
 * <SandboxCard title="Hello" description="A sandbox component" />
 * ```
 */
export function SandboxCard({ title, description }: SandboxCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "400px",
      }}
    >
      <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>{title}</h2>
      <p style={{ margin: 0, color: "#64748b" }}>{description}</p>
    </div>
  );
}
