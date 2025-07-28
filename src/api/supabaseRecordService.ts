import { supabase } from "@/lib/supabase/client";

export interface Record {
  id: string;
  userId: string;
  drawNumber: number;
  numbers: number[];
  createdAt: string;
  isWinner?: boolean;
  matchedCount?: number;
}

export interface CreateRecord {
  drawNumber: number;
  numbers: number[];
}

export class SupabaseRecordService {
  async createRecord(record: CreateRecord): Promise<Record> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('records')
      .insert({
        user_id: user.id,
        draw_number: record.drawNumber,
        numbers: record.numbers,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      drawNumber: data.draw_number,
      numbers: data.numbers,
      createdAt: data.created_at,
      isWinner: data.is_winner || undefined,
      matchedCount: data.matched_count || undefined,
    };
  }

  async getRecordsByUserId(userId: string): Promise<Record[]> {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(record => ({
      id: record.id,
      userId: record.user_id,
      drawNumber: record.draw_number,
      numbers: record.numbers,
      createdAt: record.created_at,
      isWinner: record.is_winner || undefined,
      matchedCount: record.matched_count || undefined,
    }));
  }

  async getRecordById(recordId: string): Promise<Record | null> {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('id', recordId)
      .single();

    if (error) return null;

    return {
      id: data.id,
      userId: data.user_id,
      drawNumber: data.draw_number,
      numbers: data.numbers,
      createdAt: data.created_at,
      isWinner: data.is_winner || undefined,
      matchedCount: data.matched_count || undefined,
    };
  }

  async updateRecord(recordId: string, updates: Partial<Record>): Promise<Record> {
    const { data, error } = await supabase
      .from('records')
      .update({
        is_winner: updates.isWinner,
        matched_count: updates.matchedCount,
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      drawNumber: data.draw_number,
      numbers: data.numbers,
      createdAt: data.created_at,
      isWinner: data.is_winner || undefined,
      matchedCount: data.matched_count || undefined,
    };
  }

  async deleteRecord(recordId: string): Promise<boolean> {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', recordId);

    return !error;
  }
}