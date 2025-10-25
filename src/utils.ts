/**
 * Use to JSON.stringify objects with circular references, such as Node HTTP errors.
 * Make sure to call it to return a new JSON replacer function!
 * @example
 * JSON.stringify({ error: new Error('may contain circular references') }, newErrorReplacer())
 */
export function errorReplacer() {
  const seen = new WeakSet();

  return (key: string, value: unknown) => {
    // Replace circular references with a string to prevent "TypeError: Converting circular structure to JSON"
    if (typeof value === "object" && value) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }

    // Replace Error instances with a plain object. Otherwise, Errors serialize to "{}".
    if (value instanceof Error) {
      const errorObj = { name: value.name };
      Object.getOwnPropertyNames(value).forEach((key) => {
        // @ts-expect-error: c'mon, we know it's a key of value...
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        errorObj[key] = value[key];
      });
      return errorObj;
    }

    return value;
  };
}

export const decimalFormat = new Intl.NumberFormat(undefined, {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const numberFormat = new Intl.NumberFormat(undefined, {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const percentFormat = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatDecimal(number: number): string {
  return decimalFormat.format(number);
}

export function formatNumber(number: number): string {
  return numberFormat.format(number);
}

export function formatPercent(number: number): string {
  return percentFormat.format(number);
}
