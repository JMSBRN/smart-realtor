export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Apartment {
  id: string;
  objectCode: string;
  region: string;
  districtRB: string;
  settlement: string;
  street: string;
  houseNumber: string;
  houseBlock: string;
  cityDistrict: string;
  cityMicrodistrict: string;
  price: number;
  pricePerM2: number;
  currency: "USD" | "BYN" | "EUR" | string
  buildingType: string;
  roomsCount: number
  floor: number;
  floorsTotal: number
  totalArea: number;
  livingArea: number;
  kitchenArea: number | null
  buildYear: number
  contactPhones: string[];
  contactPerson: string;
  agency: string;
  coordinates: Coordinates;
  createdAt?: string;
  updatedAt?: string;
}
