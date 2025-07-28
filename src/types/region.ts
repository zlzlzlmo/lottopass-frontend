export interface StoreInfo {
  id: number;
  rtlrid: string;
  bplcdorodtladres: string;
  bplclocplc1: string;
  bplclocplc2: string;
  bplclocplc3: string;
  bplclocplc4: string;
  bplcnm: string;
  bplclocplcdtladres: string;
  rtlrstrtelno: string;
  latitude: number | null;
  longitude: number | null;
  distance?: number;
}

export interface UniqueRegion {
  id: number;
  bplclocplc1: string;
  bplclocplc2: string;
  bplclocplc3: string;
}

export interface WinningRegion {
  id: number;
  drwNo: number;
  rank: number;
  no: number;
  bplcdorodtladres: string;
  bplclocplc1: string;
  bplclocplc2: string;
  bplclocplc3: string;
  bplclocplc4: string;
  bplcnm: string;
  rtlrid: string;
  bplclocplcdtladres: string;
  rtlrstrtelno: string;
  latitude: number | null;
  longitude: number | null;
  distance?: number;
}