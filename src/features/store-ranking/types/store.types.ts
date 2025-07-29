export interface StoreRanking {
  rank: number;
  storeId: string;
  storeName: string;
  address: string;
  city: string;
  district: string;
  firstPrizeCount: number;
  secondPrizeCount: number;
  totalPrizeCount: number;
  totalPrizeAmount: number;
  lastWinDate?: string;
  lastWinRound?: number;
  latitude?: number;
  longitude?: number;
  distance?: number; // km from user
}

export interface StoreReview {
  id: string;
  storeId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  helpful: number; // 도움이 됨 count
}

export interface StoreDetail extends StoreRanking {
  businessHours?: string;
  phoneNumber?: string;
  imageUrl?: string;
  rating: number; // average rating
  reviewCount: number;
  isFavorite: boolean;
  monthlyWins: { month: string; count: number }[];
}

export interface StoreFilters {
  city?: string;
  district?: string;
  minWins?: number;
  maxDistance?: number; // km
  sortBy: 'totalWins' | 'recentWins' | 'distance' | 'rating';
  onlyFavorites?: boolean;
}

export interface StoreStats {
  totalStores: number;
  totalFirstPrizes: number;
  totalPrizeAmount: number;
  topCity: { name: string; wins: number };
  averageWinsPerStore: number;
}