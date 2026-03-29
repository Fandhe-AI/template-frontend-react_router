import fsdConfig from "@repo/shared-config-syncpack/fsd-dependency-direction" with { type: "json" };
import strictConfig from "@repo/shared-config-syncpack/strict" with { type: "json" };
import typesOnlyDevConfig from "@repo/shared-config-syncpack/types-only-dev" with { type: "json" };
import type { RcFile } from "syncpack";

const config = {
  ...(strictConfig as RcFile),
  versionGroups: [
    ...((fsdConfig as RcFile).versionGroups ?? []),
    ...((typesOnlyDevConfig as RcFile).versionGroups ?? []),
  ],
} satisfies RcFile;

export default config;
