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

export interface VolunteerApplicationDto {
  eventName: string;
  id: number;
  observations: string;
  phone: string;
  qualifications: string;
  email: string;
  name: string;
}
