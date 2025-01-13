import { BaseApiService } from "./baseAPI";
import { User } from "./userService";

export interface CreateRecord {
  drawNumber: number;
  combinations: number[][];
  purchaseDate: string;
  transactionId: string;
  memo?: string;
}

export interface Record {
  id: string;
  user: User;
  drawNumber: number;
  combinations: number[][];
  purchaseDate: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
  transactionId: string;
}

export class RecordService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/record`);
  }

  async createRecord(body: CreateRecord) {
    const response = await this.handleResponse(
      this.post<Record>("/create", body)
    );

    return response;
  }

  async getAll() {
    const response = await this.handleResponse(this.get<Record[]>("/all"));
    return response;
  }

  async deleteOne(id: string) {
    const response = await this.handleResponse(
      this.delete<boolean>("/delete", { id })
    );
    return response;
  }
}
