export interface Store {
  id: string;
  name: string;
  address: string;
  addressDetail?: string;
  phone?: string;
  latitude: number;
  longitude: number;
  region: Region;
  winningHistory: WinningRecord[];
}

export interface Region {
  sido: string;
  sigungu: string;
}

export interface WinningRecord {
  drawNumber: number;
  rank: 1 | 2 | 3 | 4 | 5;
  date: string;
  amount: number;
}

export interface StoreSearchParams {
  sido?: string;
  sigungu?: string;
  keyword?: string;
  onlyWinners?: boolean;
  limit?: number;
  offset?: number;
}