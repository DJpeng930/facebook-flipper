export interface FBMarketListing {
  id: string;
  title: string;
  curreny: string;
  age: string;
  description: string;
  price: number;
  location: string;
  photo: string;
  exactLocation: {
    radius: number;
    latitude: number;
    longitude: number;
    vanityPageId: string;
  };
}
