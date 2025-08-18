export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  areaSqFt: number;
  landType: 'residential' | 'commercial' | 'agricultural';
  location: {
    lat: number;
    lng: number;
  };
  image: string;
  address: string;
};
