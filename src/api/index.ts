import { DrawService } from "./drawService";
import { LocationService } from "./locationService";
import { RegionService } from "./regionService";
import { AuthService } from "./authService";

export const drawService = new DrawService();
export const locationService = new LocationService();
export const regionService = new RegionService();
export const authService = new AuthService();
