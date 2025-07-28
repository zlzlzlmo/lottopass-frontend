import { z } from 'zod';

export const lottoNumberSchema = z
  .number()
  .int('정수여야 합니다')
  .min(1, '1 이상이어야 합니다')
  .max(45, '45 이하여야 합니다');

export const lottoNumbersSchema = z
  .array(lottoNumberSchema)
  .length(6, '6개의 번호를 선택해야 합니다')
  .refine(
    numbers => new Set(numbers).size === numbers.length,
    '중복된 번호가 있습니다'
  );

export const generateNumbersSchema = z.object({
  method: z.enum([
    'random',
    'statistical',
    'pattern',
    'ai',
    'custom',
    'evenOdd',
    'highLow',
    'consecutive'
  ]),
  options: z.object({
    includeNumbers: z.array(lottoNumberSchema).optional(),
    excludeNumbers: z.array(lottoNumberSchema).optional(),
    evenCount: z.number().int().min(0).max(6).optional(),
    oddCount: z.number().int().min(0).max(6).optional(),
    highCount: z.number().int().min(0).max(6).optional(),
    lowCount: z.number().int().min(0).max(6).optional(),
    consecutiveAllowed: z.boolean().optional(),
    sumRange: z.object({
      min: z.number().int().min(21).max(255),
      max: z.number().int().min(21).max(255),
    }).optional(),
  }).optional(),
});

export const saveCombinationSchema = z.object({
  numbers: lottoNumbersSchema,
  name: z.string().max(50, '이름은 최대 50자까지 가능합니다').optional(),
});

export type GenerateNumbersInput = z.infer<typeof generateNumbersSchema>;
export type SaveCombinationInput = z.infer<typeof saveCombinationSchema>;