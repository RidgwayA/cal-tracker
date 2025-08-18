// backEnd/src/utils/url.ts
import type { Request } from "express";

export function getPublicBaseUrl(req: Request): string {
  const origin = req.get("origin");
  if (origin && /^https?:\/\//i.test(origin)) return origin;

  const xfProto = req.get("x-forwarded-proto");
  const xfHost  = req.get("x-forwarded-host");
  if (xfProto && xfHost) {
    return `${xfProto.split(",")[0].trim()}://${xfHost.split(",")[0].trim()}`;
  }

  const proto = req.protocol;        
  const host  = req.get("host");     
  if (proto && host) return `${proto}://${host}`;

  return "http://localhost:4001";
}

export function buildResetLinkFromRequest(req: Request, token: string): string {
  const base = getPublicBaseUrl(req);
  const url  = new URL(base); // validate
  const basePath = url.pathname.replace(/\/+$/, "");
  url.pathname = `${basePath}/reset-password/${encodeURIComponent(token)}`;
  return url.toString();
}
