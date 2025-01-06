import { useEffect, useState } from "react";

interface UseRangeSelectorProps<T> {
  data: T[];
  defaultMinRange: number;
  getDrawNumber: (item: T) => number;
}

export const useRangeSelector = <T>({
  data,
  defaultMinRange,
  getDrawNumber,
}: UseRangeSelectorProps<T>) => {
  const [range, setRange] = useState<[number, number] | null>(null);

  const drawNumbers = data.map(getDrawNumber);
  const maxDraw = drawNumbers.length > 0 ? Math.max(...drawNumbers) : 0;
  const minDraw = drawNumbers.length > 0 ? Math.min(...drawNumbers) : 0;

  useEffect(() => {
    if (data.length > 0 && range === null) {
      setRange([Math.max(minDraw, maxDraw - defaultMinRange), maxDraw]);
    }
  }, [data, range, minDraw, maxDraw]);

  const filteredDraws = range
    ? data.filter(
        (item) =>
          getDrawNumber(item) >= range[0] && getDrawNumber(item) <= range[1]
      )
    : [];

  const handleRangeChange = (value: [number, number]) => {
    setRange(value);
  };

  return {
    filteredDraws,
    range,
    setRange,
    minDraw,
    maxDraw,
    handleRangeChange,
  };
};
