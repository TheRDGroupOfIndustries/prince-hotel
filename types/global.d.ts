interface Window {
  fbq: (
    command: 'track' | 'init' | 'consent' | string,
    eventNameOrId?: string,
    parameters?: Record<string, unknown>
  ) => void;
}
