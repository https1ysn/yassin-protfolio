"use client";

import { createContext, useContext, ReactNode } from "react";
import { fallbackContent, type SiteContent } from "@/lib/content-fallback";

const ContentContext = createContext<SiteContent>(fallbackContent);

export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

/** All site content, loaded server-side (DB or fallback) and provided once. */
export function useContent() {
  return useContext(ContentContext);
}
