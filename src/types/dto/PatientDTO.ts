export interface SocialMedia {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  [key: string]: string | undefined; // Para extensibilidade, caso haja outras redes sociais
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
  socialMedia: SocialMedia | string; // Pode ser objeto ou string JSON
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
