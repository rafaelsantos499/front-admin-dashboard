export interface PatientDto {
  fullName: string;
  email?: string;
  birthDate: string;
  phone: string;
  address: string;
  gender: string;
  socialMedia: SocialMedia;
}


export interface SocialMedia {
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  birthDate: string; // ISO string, pode ser Date se preferir
  phone: string;
  address: string;
  gender: string;
  socialMedia: SocialMedia; // Pode ser objeto ou string JSON
  twitter?: string;
  facebook?: string;
  instagram?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FindAllPatient {
  patientId: string;
  professionalId: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'active' | 'completed' | string; // status flexível, mas pode ajustar
  notes: string;
  patient: Patient;
}

export interface FormDataPatient {
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
  address: string;
  gender: string;
  twitter: string;
  instagram: string;
  facebook: string;
}
