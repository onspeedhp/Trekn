export interface IDrop {
  id?: number;
  name: string;
  image: any;
  location_name: string;
  location: string;
  description: string;
  creator_addess: string;
  lat: number;
  lng: number;
  symbol?: any;
  sig?: any;
  distance?: number;
  author_id?: number;
  reaction_counts?: any;
  imageArray?: any;
  minted?: any;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  address: string;
  profileImage: string;
  point: number;
}
