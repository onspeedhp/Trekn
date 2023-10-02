export interface LocationDetail {
  _id: string;
  collectionId: string;
  collectionName: string;
  nationId: string;
  name: string;
  address: string;
  cityName: string;
  longitude: number;
  latitude: number;
  radius: number;
  description: string;
  shortDescription: string;
  nftMintedCount: number;
  isDeleted: boolean;
  __v?: number;
  createdAt: string;
  updatedAt: string;
  distance?: number;
  locationPhotos: Array<ILocationPhotos>;
}

interface ILocationPhotos {
  photoLink: string;
  rarity: number;
  author: string;
}

export interface IDrop {
  name: string;
  image: string;
  location_name: string;
  location: string;
  description: string;
  creator_addess: string;
  lat: number;
  lng: number;
  attributes?: any;
}
