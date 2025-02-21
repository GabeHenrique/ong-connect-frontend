export interface CreateEventDto {
  name: string;
  description: string;
  location: string;
  date: string;
  image: string;
  vagas?: number;
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  location?: string;
  date?: Date;
  image?: string;
  vagas?: number;
}
