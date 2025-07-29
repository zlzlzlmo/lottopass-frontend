import { UserRepository, UserStats } from './interfaces';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export class SupabaseUserRepository implements UserRepository {
  private supabase = createClient(supabaseUrl, supabaseKey);

  async saveUserNumbers(userId: string, numbers: number[]): Promise<void> {
    const { error } = await this.supabase
      .from('user_numbers')
      .insert({
        user_id: userId,
        numbers: numbers,
        created_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to save user numbers: ${error.message}`);
    }
  }

  async getUserNumbers(userId: string): Promise<number[][]> {
    const { data, error } = await this.supabase
      .from('user_numbers')
      .select('numbers')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user numbers: ${error.message}`);
    }

    return data?.map(item => item.numbers) || [];
  }

  async deleteUserNumbers(userId: string, numbersId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_numbers')
      .delete()
      .eq('user_id', userId)
      .eq('id', numbersId);

    if (error) {
      throw new Error(`Failed to delete user numbers: ${error.message}`);
    }
  }

  async getUserStatistics(userId: string): Promise<UserStats> {
    const { data, error } = await this.supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found is ok
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }

    return data || {
      totalPlays: 0,
      totalWins: 0,
      favoriteNumbers: [],
      lastPlayDate: new Date().toISOString(),
      winRate: 0,
    };
  }

  async updateUserStatistics(userId: string, stats: Partial<UserStats>): Promise<void> {
    const { error } = await this.supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        ...stats,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to update user statistics: ${error.message}`);
    }
  }
}

// Mock implementation for testing
export class MockUserRepository implements UserRepository {
  private userNumbers: Map<string, number[][]> = new Map();
  private userStats: Map<string, UserStats> = new Map();

  async saveUserNumbers(userId: string, numbers: number[]): Promise<void> {
    const existing = this.userNumbers.get(userId) || [];
    this.userNumbers.set(userId, [...existing, numbers]);
  }

  async getUserNumbers(userId: string): Promise<number[][]> {
    return this.userNumbers.get(userId) || [];
  }

  async deleteUserNumbers(userId: string, numbersId: string): Promise<void> {
    // Simple implementation - remove by index
    const numbers = this.userNumbers.get(userId) || [];
    const index = parseInt(numbersId);
    if (index >= 0 && index < numbers.length) {
      numbers.splice(index, 1);
      this.userNumbers.set(userId, numbers);
    }
  }

  async getUserStatistics(userId: string): Promise<UserStats> {
    return this.userStats.get(userId) || {
      totalPlays: 0,
      totalWins: 0,
      favoriteNumbers: [],
      lastPlayDate: new Date().toISOString(),
      winRate: 0,
    };
  }

  async updateUserStatistics(userId: string, stats: Partial<UserStats>): Promise<void> {
    const existing = await this.getUserStatistics(userId);
    this.userStats.set(userId, { ...existing, ...stats });
  }

  // Test helpers
  reset(): void {
    this.userNumbers.clear();
    this.userStats.clear();
  }
}