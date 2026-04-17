const MARKETING_REF = "sammorrispb";
const UTM_SOURCE = "sammorrispb";

export function hubUrl(
  path: string = "/",
  extraParams: Record<string, string> = {},
): string {
  const url = new URL(path, "https://linkanddink.com");
  url.searchParams.set("ref", MARKETING_REF);
  for (const [k, v] of Object.entries(extraParams)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

export function crUrl(target: string): string {
  const url = new URL(target);
  url.searchParams.set("utm_source", UTM_SOURCE);
  return url.toString();
}
