import { StoreRepository, Store } from './interfaces';
import axios from 'axios';

export class HttpStoreRepository implements StoreRepository {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

  async getWinningStores(region: string): Promise<Store[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/stores/winners`, {
        params: { region },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch winning stores:', error);
      return [];
    }
  }

  async getStoreById(storeId: string): Promise<Store | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/stores/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch store:', error);
      return null;
    }
  }

  async searchStores(query: string): Promise<Store[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/stores/search`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search stores:', error);
      return [];
    }
  }

  async getNearbyStores(lat: number, lng: number, radius: number): Promise<Store[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/stores/nearby`, {
        params: { lat, lng, radius },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch nearby stores:', error);
      return [];
    }
  }
}

// Mock implementation for testing
export class MockStoreRepository implements StoreRepository {
  private stores: Store[] = [
    {
      id: '1',
      name: '행운마트',
      address: '서울시 강남구 역삼동 123-45',
      region: '서울',
      winCount: 5,
      lastWinDate: '2024-01-15',
      latitude: 37.5012743,
      longitude: 127.0396196,
    },
    {
      id: '2',
      name: '대박편의점',
      address: '서울시 송파구 잠실동 67-89',
      region: '서울',
      winCount: 3,
      lastWinDate: '2023-12-20',
      latitude: 37.5138936,
      longitude: 127.1051045,
    },
    {
      id: '3',
      name: '로또명당',
      address: '부산시 해운대구 우동 12-34',
      region: '부산',
      winCount: 8,
      lastWinDate: '2024-02-01',
      latitude: 35.1628946,
      longitude: 129.1638723,
    },
  ];

  async getWinningStores(region: string): Promise<Store[]> {
    return this.stores.filter(store => store.region === region);
  }

  async getStoreById(storeId: string): Promise<Store | null> {
    return this.stores.find(store => store.id === storeId) || null;
  }

  async searchStores(query: string): Promise<Store[]> {
    const lowerQuery = query.toLowerCase();
    return this.stores.filter(store => 
      store.name.toLowerCase().includes(lowerQuery) ||
      store.address.toLowerCase().includes(lowerQuery)
    );
  }

  async getNearbyStores(lat: number, lng: number, radius: number): Promise<Store[]> {
    // Simple distance calculation (not accurate for real use)
    return this.stores.filter(store => {
      if (!store.latitude || !store.longitude) return false;
      
      const distance = Math.sqrt(
        Math.pow(store.latitude - lat, 2) + 
        Math.pow(store.longitude - lng, 2)
      ) * 111; // Rough conversion to km
      
      return distance <= radius;
    });
  }

  // Test helpers
  addStore(store: Store): void {
    this.stores.push(store);
  }

  clearStores(): void {
    this.stores = [];
  }
}