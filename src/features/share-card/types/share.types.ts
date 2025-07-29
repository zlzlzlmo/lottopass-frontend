export interface ShareCardData {
  type: 'result' | 'numbers' | 'stats';
  title: string;
  subtitle?: string;
  date: string;
  content: ShareCardContent;
  backgroundColor?: string;
  textColor?: string;
}

export interface ShareCardContent {
  // For lottery result
  drawNumber?: number;
  numbers?: number[];
  bonusNumber?: number;
  prize?: string;
  rank?: string;
  
  // For generated numbers
  generatedNumbers?: number[][];
  generationMethod?: string;
  
  // For statistics
  stats?: {
    totalSpent?: number;
    totalWon?: number;
    favoriteNumbers?: number[];
    winRate?: number;
  };
}

export interface ShareOptions {
  platform: 'kakao' | 'facebook' | 'twitter' | 'instagram' | 'download';
  message?: string;
}