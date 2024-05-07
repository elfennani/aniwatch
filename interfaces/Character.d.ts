export default interface Character {
  id: number;
  fullName: string;
  role: string;
  image?: string;
  actors?: {
    id: number;
    role?: string;
    name: string;
    image?: string
  }[]
}