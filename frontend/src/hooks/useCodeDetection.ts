// hooks/useCodeDetection.ts
import { useState, useEffect } from 'react';

/**
 * Code detection configuration
 */
export interface CodeDetectionConfig {
  minLength?: number;
  minMatches?: number;
  customPatterns?: RegExp[];
}

/**
 * Result from code detection
 */
export interface CodeDetectionResult {
  isCode: boolean;
  matchCount: number;
  matchedPatterns: string[];
  segments: Array<{ type: 'code' | 'text'; content: string }>;
  textareaStyles: {
    className: string;
    style: React.CSSProperties;
  };
  badge: {
    show: boolean;
    text: string;
    icon: 'code';
  } | null;
}

/**
 * Default code detection patterns
 */
const DEFAULT_PATTERNS: Array<{ pattern: RegExp; name: string; weight?: number }> = [
  { pattern: /```[\s\S]*```/, name: 'code-blocks', weight: 3 },
  { pattern: /`[^`]+`/, name: 'inline-code', weight: 1 },

  // JS/TS
  {
    pattern: /\b(function|const|let|var|class|import|export|return|if|else|for|while|switch|case|break|continue|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum)\b/,
    name: 'js-keywords',
    weight: 2
  },

  // Python
  {
    pattern: /\b(def|class|import|from|return|if|else|elif|for|while|with|as|try|except|raise|lambda|yield|async|await)\b/,
    name: 'python-keywords',
    weight: 2
  },

  // C# / Java
  {
    pattern: /\b(public|private|protected|static|void|int|string|bool|class|interface|namespace|using|var|new|return|if|else|for|while|foreach|try|catch|throw)\b/,
    name: 'csharp-keywords',
    weight: 2
  },

  // Structural
  { pattern: /[{}\[\]();]/, name: 'brackets', weight: 1 },
  { pattern: /^\s{2,}/m, name: 'indentation', weight: 1 },
  { pattern: /=>/, name: 'arrow-functions', weight: 2 },
  { pattern: /\w+\s*\([^)]*\)\s*{/, name: 'function-definitions', weight: 2 },

  // Comments
  { pattern: /\/\/.+$/m, name: 'single-line-comments', weight: 1 },
  { pattern: /\/\*[\s\S]*?\*\//, name: 'multi-line-comments', weight: 2 },
  { pattern: /#.+$/m, name: 'hash-comments', weight: 1 },

  // Markup
  { pattern: /<\/?[a-z][\s\S]*?>/i, name: 'html-tags', weight: 2 },
  { pattern: /\w+:\s*.+[;,]/, name: 'key-value-pairs', weight: 1 },

  // Operators
  { pattern: /[=+\-*/%&|^~<>!]=?/, name: 'operators', weight: 1 },
  { pattern: /\.\w+/, name: 'dot-notation', weight: 1 }
];

/**
 * INTERNAL segment type — prevents "never"
 */
interface Segment {
  type: 'code' | 'text';
  lines: string[];
}

/**
 * Safely split text into text/code segments
 */
const splitTextSegments = (text: string) => {
  const segments: Array<{ type: 'code' | 'text'; content: string }> = [];
  const lines = text.split('\n');

  let currentSegment: Segment | null = null;

  for (const line of lines) {
    const isCodeLine =
      /^\s{2,}/.test(line) ||
      /^[\s]*[{}\[\]();]/.test(line) ||
      /[=+\-*/%&|^<>!]{2}/.test(line) ||
      /\b(function|const|let|var|class|def|import|export|return)\b/.test(line);

    const isBlankLine = line.trim() === '';

    // FIX: Explicit type avoids implicit-any
    let lineType: 'code' | 'text' =
      isBlankLine
        ? (currentSegment?.type ?? 'text')
        : isCodeLine
          ? 'code'
          : 'text';

    // New segment
    if (!currentSegment || currentSegment.type !== lineType) {
      if (currentSegment) {
        segments.push({
          type: currentSegment.type,
          content: currentSegment.lines.join('\n')
        });
      }

      // FIX: `as Segment` prevents TS collapsing into `never`
      currentSegment = {
        type: lineType,
        lines: [line]
      } as Segment;

    } else {
      currentSegment.lines.push(line);
    }
  }

  if (currentSegment) {
    segments.push({
      type: currentSegment.type,
      content: currentSegment.lines.join('\n')
    });
  }

  return segments;
};

/**
 * Main code detection logic
 */
export const detectCode = (
  text: string,
  config: CodeDetectionConfig = {}
): CodeDetectionResult => {
  const { minLength = 10, minMatches = 2, customPatterns = [] } = config;

  if (!text || text.length < minLength) {
    return {
      isCode: false,
      matchCount: 0,
      matchedPatterns: [],
      segments: [{ type: 'text', content: text }],
      textareaStyles: {
        className: 'font-sans bg-slate-800/50 border border-slate-700/50 text-slate-200',
        style: {}
      },
      badge: null
    };
  }

  const allPatterns = [
    ...DEFAULT_PATTERNS,
    ...customPatterns.map((pattern, i) => ({
      pattern,
      name: `custom-${i}`,
      weight: 1
    }))
  ];

  const matchedPatterns: string[] = [];
  let matchCount = 0;
  let weightedScore = 0;

  for (const { pattern, name, weight = 1 } of allPatterns) {
    if (pattern.test(text)) {
      matchCount++;
      weightedScore += weight;
      matchedPatterns.push(name);
    }
  }

  const isCode = matchCount >= minMatches || weightedScore >= 4;
  const segments = splitTextSegments(text);

  const textareaStyles = isCode
    ? {
        className:
          'font-mono bg-slate-950 text-slate-100 border-2 border-blue-500/30 shadow-lg shadow-blue-500/5',
        style: {
          tabSize: 2,
          whiteSpace: 'pre' as const,
          overflowWrap: 'normal' as const,
          overflowX: 'auto' as const
        }
      }
    : {
        className:
          'font-sans bg-slate-800/50 border border-slate-700/50 text-slate-200',
        style: {}
      };

  const badge = isCode
    ? {
        show: true,
        text: `Code detected (${matchCount} pattern${matchCount !== 1 ? 's' : ''})`,
        icon: 'code' as const
      }
    : null;

  return {
    isCode,
    matchCount,
    matchedPatterns,
    segments,
    textareaStyles,
    badge
  };
};

/**
 * Hook version
 */
export const useCodeDetection = (
  text: string,
  config?: CodeDetectionConfig
): CodeDetectionResult => {
  const [result, setResult] = useState<CodeDetectionResult>(() =>
    detectCode(text, config)
  );

  useEffect(() => {
    setResult(detectCode(text, config));
  }, [text, config?.minLength, config?.minMatches]);

  return result;
};

/**
 * Boolean-only hook
 */
export const useIsCode = (text: string, config?: CodeDetectionConfig): boolean => {
  return useCodeDetection(text, config).isCode;
};

/**
 * Styling-only hook
 */
export const useCodeStyling = (text: string, config?: CodeDetectionConfig) => {
  const { textareaStyles, badge } = useCodeDetection(text, config);
  return { textareaStyles, badge };
};
