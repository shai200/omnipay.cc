import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Browser consoles are visible to extensions, screen sharing and support
// sessions, so client code must not log personal data. This scans every
// 'use client' module: only console.error/console.warn are allowed, and their
// arguments must not mention profile, form, wallet or session values.

const APP_DIR = path.join(process.cwd(), 'app');
const SENSITIVE = /\b(profile|payload|form|user|uid|email|wallet|address|dob|session|name|data|body)\w*/i;

function clientModules(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return clientModules(full);
    if (!/\.(tsx?|jsx?)$/.test(entry.name) || /\.test\./.test(entry.name)) return [];
    const source = readFileSync(full, 'utf8');
    return /^\s*['"]use client['"]/.test(source) ? [full] : [];
  });
}

type ConsoleCall = { file: string; method: string; args: string };

function consoleCalls(file: string): ConsoleCall[] {
  const source = readFileSync(file, 'utf8');
  const calls: ConsoleCall[] = [];
  const pattern = /console\.(\w+)\s*\(/g;
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    // Read up to the matching close paren.
    let depth = 1;
    let i = pattern.lastIndex;
    while (i < source.length && depth > 0) {
      if (source[i] === '(') depth += 1;
      if (source[i] === ')') depth -= 1;
      i += 1;
    }
    calls.push({ file: path.relative(process.cwd(), file), method: match[1]!, args: source.slice(pattern.lastIndex, i - 1) });
  }
  return calls;
}

// Removes string literals so wording such as 'Error loading session' is allowed.
function withoutStrings(args: string): string {
  return args.replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, '');
}

describe('client-side logging', () => {
  const modules = clientModules(APP_DIR);
  const calls = modules.flatMap(consoleCalls);

  it('finds the client modules', () => {
    expect(modules.length).toBeGreaterThan(5);
  });

  it('uses only console.error and console.warn in the browser', () => {
    const disallowed = calls.filter((call) => call.method !== 'error' && call.method !== 'warn');
    expect(disallowed).toEqual([]);
  });

  it('never passes profile, form, wallet or session values to the console', () => {
    const leaking = calls.filter((call) => SENSITIVE.test(withoutStrings(call.args)));
    expect(leaking).toEqual([]);
  });
});
