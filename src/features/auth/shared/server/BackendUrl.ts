export class BackendConfigurationError extends Error {
  constructor() {
    super("Backend API URL is not configured.");
    this.name = "BackendConfigurationError";
  }
}

export function buildBackendApiUrl(
  path: string,
  baseUrl = process.env.SIHEDAF_API_BASE_URL,
) {
  if (!baseUrl?.trim()) {
    throw new BackendConfigurationError();
  }

  const trimmedBase = baseUrl.trim().replace(/\/+$/, "");
  const root = trimmedBase.endsWith("/api")
    ? trimmedBase.slice(0, -4)
    : trimmedBase;
  const normalizedPath = path.replace(/^\/+/, "");

  return `${root}/api/v1/${normalizedPath}`;
}
