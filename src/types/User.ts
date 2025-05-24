interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  maxPatients: number;
  duration: number;
  features: string[];  // converti de string JSON para array
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string;
}

interface Subscription {
  id: string;
  professionalId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentMethod: string | null;
  autoRenew: boolean;
  plan: Plan;
}

interface Profile {
  id: string;
  userId: string;
  fullName: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  address: string | null;
  bio: string | null;
  photo: string | null;
  socialMedia: string | null;
  defaultConsultPrice: number | null;
  subscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
  subscription: Subscription;
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
}
