import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { ClientCacheProvider } from "./emotion/emotion-client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientCacheProvider>
        <ChakraProvider value={defaultSystem}>
          <HydratedRouter />
        </ChakraProvider>
      </ClientCacheProvider>
    </StrictMode>,
  );
});
