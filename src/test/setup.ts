import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';

// Silencia los avisos de React: "An update to X inside a test was not wrapped in act(...)"
const ACT_WARNING_SNIPPET = 'not wrapped in act';

let errorSpy: ReturnType<typeof vi.spyOn> | undefined;
let warnSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeAll(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : String(args[0]);
    if (msg && msg.includes(ACT_WARNING_SNIPPET)) return;
    // @ts-expect-error spread unknown[]
    // eslint-disable-next-line no-console
    console.__proto__.error.apply(
      console,
      args as unknown as [message?: any, ...optionalParams: any[]]
    );
  });

  warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : String(args[0]);
    if (msg && msg.includes(ACT_WARNING_SNIPPET)) return;
    // @ts-expect-error spread unknown[]
    // eslint-disable-next-line no-console
    console.__proto__.warn.apply(
      console,
      args as unknown as [message?: any, ...optionalParams: any[]]
    );
  });
});

afterAll(() => {
  errorSpy?.mockRestore();
  warnSpy?.mockRestore();
});
