export type Role = 'admin' | 'hotel' | 'ngo';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type FoodStatus = 'available' | 'requested' | 'picked' | 'expired' | 'cancelled';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'picking_up' | 'picked' | 'served' | 'cancelled';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  whatsappNumber?: string;
  address: string;
  city: string;
  pincode: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  registrationDoc?: string;
  createdAt: string;
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  description?: string;
}

export interface FoodListing {
  _id: string;
  hotel: string;
  hotelName: string;
  hotelCity: string;
  hotelAddress: string;
  hotelPhone: string;
  foodItems: FoodItem[];
  totalServings: number;
  preparedAt: string;
  expiresAt: string;
  status: FoodStatus;
  images?: string[];
  notes?: string;
  createdAt: string;
}

export interface FoodRequest {
  _id: string;
  foodListing: FoodListing | string;
  ngo: string;
  ngoName: string;
  ngoPhone: string;
  hotel: string;
  hotelName: string;
  status: RequestStatus;
  servingsCollected?: number;
  peopleServed?: number;
  pickupTime?: string;
  servedAt?: string;
  ngoNotes?: string;
  hotelNotes?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}

export interface DashboardStats {
  totalHotels?: number;
  totalNGOs?: number;
  pendingVerifications?: number;
  totalListings?: number;
  totalRequests?: number;
  totalPeopleServed?: number;
  totalServingsServed?: number;
  totalDonations?: number;
  activeListings?: number;
  totalServed?: number;
  pendingRequests?: number;
  totalPeople?: number;
  totalServings?: number;
}

export interface MonthlyData {
  _id: { month: number; year: number };
  count?: number;
  servings?: number;
  people?: number;
}