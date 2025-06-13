
export interface ChurchInfo {
  name: string;
  addressLine1: string;
  addressLine2: string;
  neighborhood: string;
  cityCode: string;
  stateCode: string;
  stateName: string;
  countryCode: string;
  zipCode: string;
  documentType: 'passport' | 'cnpj' | 'cpf';
  documentNumber: string;
  imagePath: File | null;
  imagePreview: string | null;
}

export interface AdminInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date | null;
  genderId: 'male' | 'female';
  phonePrefix: string;
  phoneNumber: string;
  documentNumber: string;
}
