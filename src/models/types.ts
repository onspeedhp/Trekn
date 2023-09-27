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
  image_link: string;
  location: string;
  desc: string;
  creator_addess: string;
}
