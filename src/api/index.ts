import { DrawService } from "./drawService";
import { LocationService } from "./locationService";
import { RegionService } from "./regionService";
import { AuthService } from "./authService";
import { NumberService } from "./numberService";
import { UserService } from "./userService";
import { RecordService } from "./recordService";

// Supabase services
import { SupabaseAuthService } from "./supabaseAuthService";
import { SupabaseUserService } from "./supabaseUserService";
import { SupabaseRecordService } from "./supabaseRecordService";

// 기존 서비스 (점진적 마이그레이션)
export const drawService = new DrawService();
export const locationService = new LocationService();
export const regionService = new RegionService();
export const authService = new AuthService();
export const numberService = new NumberService();
export const userService = new UserService();
export const recordService = new RecordService();

// Supabase 서비스
export const supabaseAuthService = new SupabaseAuthService();
export const supabaseUserService = new SupabaseUserService();
export const supabaseRecordService = new SupabaseRecordService();

// 환경변수에 따라 사용할 서비스 결정
const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true';

// 조건부 export (점진적 마이그레이션용)
export const activeAuthService = useSupabase ? supabaseAuthService : authService;
export const activeUserService = useSupabase ? supabaseUserService : userService;
export const activeRecordService = useSupabase ? supabaseRecordService : recordService;