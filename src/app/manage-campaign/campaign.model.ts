export interface Campaign {
  id: string,
  localId: string;
  name: string,
  objective: string,
  category: string,
  offerType: string,
  comments?: string,
  locations: string[],
  radius: string,
  startDate: string,
  endDate?: string,
  crt?: number,
  status: string;
}