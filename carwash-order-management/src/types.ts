export interface Order {
  id: number;
  licenseNumber: string;
  name: string;
  phoneNumber: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}