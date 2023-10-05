export interface IDrop {
  id?: number;
  name: string;
  image: string;
  location_name: string;
  location: string;
  description: string;
  creator_addess: string;
  lat: number;
  lng: number;
  attributes?: any;
  symbol?: any;
  sig?: any;
  distance?: number;
  author?: string;
  author_image?: string;
}
