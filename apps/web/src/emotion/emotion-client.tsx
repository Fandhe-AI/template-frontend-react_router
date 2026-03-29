import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createEmotionCache } from "./emotion-cache";

interface ClientStyleContextData {
  reset: () => void;
}

const ClientStyleContext = createContext<ClientStyleContextData>({
  reset: () => {},
});

const useClientStyleContext = () => useContext(ClientStyleContext);

export function ClientCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache, setCache] = useState(createEmotionCache);

  const context = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    [],
  );

  return (
    <ClientStyleContext.Provider value={context}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

const useSafeLayoutEffect =
  typeof window === "undefined" ? () => {} : useLayoutEffect;

export function useInjectStyles(cache: EmotionCache) {
  const styles = useClientStyleContext();
  const injectRef = useRef(true);

  useSafeLayoutEffect(() => {
    if (!injectRef.current) return;

    cache.sheet.container = document.head;
    const tags = cache.sheet.tags;
    cache.sheet.flush();
    for (const tag of tags) {
      (
        cache.sheet as unknown as {
          _insertTag: (tag: HTMLStyleElement) => void;
        }
      )._insertTag(tag);
    }

    styles.reset();
    injectRef.current = false;
  }, []);
}
