// Repository interfaces for data layer abstraction

export interface DrawResult {
  drwNo: number;
  drwNoDate: string;
  totSellamnt: number;
  firstWinamnt: number;
  firstPrzwnerCo: number;
  firstAccumamnt: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  returnValue: string;
}

export interface LotteryRepository {
  // Draw operations
  getLatestDraw(): Promise<DrawResult>;
  getDrawByNumber(drwNo: number): Promise<DrawResult | null>;
  getDrawHistory(limit: number, offset?: number): Promise<DrawResult[]>;
  getDrawsInRange(startDate: Date, endDate: Date): Promise<DrawResult[]>;
  
  // Cache operations
  invalidateCache(): void;
  getCacheStatus(): { size: number; hits: number; misses: number };
}

export interface UserRepository {
  // User preferences
  saveUserNumbers(userId: string, numbers: number[]): Promise<void>;
  getUserNumbers(userId: string): Promise<number[][]>;
  deleteUserNumbers(userId: string, numbersId: string): Promise<void>;
  
  // User statistics
  getUserStatistics(userId: string): Promise<UserStats>;
  updateUserStatistics(userId: string, stats: Partial<UserStats>): Promise<void>;
}

export interface UserStats {
  totalPlays: number;
  totalWins: number;
  favoriteNumbers: number[];
  lastPlayDate: string;
  winRate: number;
}

export interface StoreRepository {
  // Store operations
  getWinningStores(region: string): Promise<Store[]>;
  getStoreById(storeId: string): Promise<Store | null>;
  searchStores(query: string): Promise<Store[]>;
  getNearbyStores(lat: number, lng: number, radius: number): Promise<Store[]>;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  region: string;
  winCount: number;
  lastWinDate?: string;
  latitude?: number;
  longitude?: number;
}

// Repository factory interface
export interface RepositoryFactory {
  createLotteryRepository(): LotteryRepository;
  createUserRepository(): UserRepository;
  createStoreRepository(): StoreRepository;
}