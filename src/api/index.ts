import { DrawService } from "./drawService";
import { LocationService } from "./locationService";
import { RegionService } from "./regionService";
import { AuthService } from "./authService";
import { NumberService } from "./numberService";
import { UserService } from "./userService";
import { RecordService } from "./recordService";

export const drawService = new DrawService();
export const locationService = new LocationService();
export const regionService = new RegionService();
export const authService = new AuthService();
export const numberService = new NumberService();
export const userService = new UserService();
export const recordService = new RecordService();
