import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { renderToString as _renderToString } from "react-dom/server";
import { createEmotionCache } from "./emotion-cache";

export function createEmotion() {
  const cache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);

  function injectStyles(html: string): string {
    const chunks = extractCriticalToChunks(html);
    const styles = constructStyleTagsFromChunks(chunks);
    return html.replace(
      '<meta name="emotion-insertion-point" content="emotion-insertion-point"/>',
      `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${styles}`,
    );
  }

  function renderToString(element: React.ReactElement): string {
    return _renderToString(
      <CacheProvider value={cache}>
        <ChakraProvider value={defaultSystem}>{element}</ChakraProvider>
      </CacheProvider>,
    );
  }

  return { cache, injectStyles, renderToString };
}
