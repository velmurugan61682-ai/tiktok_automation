export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  notes?: string;
  lifetimeValue: number;
}
