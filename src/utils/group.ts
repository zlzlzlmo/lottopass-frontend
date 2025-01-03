export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> =>
  array.reduce((result, current) => {
    const groupKey = String(current[key]);
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(current);
    return result;
  }, {} as Record<string, T[]>);
