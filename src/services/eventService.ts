const API_URL = `${process.env.API_URL}`;

export type Attendees = {
  email: string;
  name: string;
  phone: string;
  qualifications: string;
  observations: string;
};

export type VolunteerApplication = {
  email: string;
  name: string;
  phone: string;
  qualifications: string;
  observations: string;
};

export type EventDto = {
  id: number;
  name: string;
  description: string;
  location: string;
  date: Date;
  image: string;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  ong: {
    id: number;
    name: string;
    email: string;
  };
  volunteers: Attendees[];
  causas: string[];
  vagas: number;
  applications: {
    user: {
      email: string;
      name: string;
    };
    phone: string;
    qualifications: string;
    observations: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEventDto = {
  name: string;
  description: string;
  location: string;
  date: string;
  vagas: number; // Garantindo que vagas seja number
  image: File;
};

export const eventService = {
  async getAllEvents(limit?: number, search?: string): Promise<EventDto[]> {
    const res = await fetch(
      API_URL + `/events?limit=${limit}&search=${search}`,
    );
    return res.json();
  },

  async getEventsByUser(token: string, userMail: string): Promise<EventDto[]> {
    const res = await fetch(`${API_URL}/events/user/${userMail}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  async getEvent(id: number): Promise<EventDto> {
    const res = await fetch(`${API_URL}/events/${id}`);
    return res.json();
  },

  async createEvent(data: FormData, token: string) {
    // Debug
    console.log("Enviando FormData para o backend:");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Importante: NÃO defina Content-Type aqui
        // O navegador vai definir automaticamente com o boundary correto para o FormData
      },
      body: data,
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Erro da API:", error); // Debug
      throw new Error(error.message || "Erro ao criar evento");
    }

    return res.json();
  },

  async updateEvent(id: number, data: FormData, token: string) {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return res.json();
  },

  async deleteEvent(id: number, token: string) {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  async toggleAttendance(eventId: number, userMail: string, token: string) {
    const res = await fetch(
      `${API_URL}/events/${eventId}/toggle-attendance/${userMail}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.json();
  },

  async applyForEvent(
    eventId: number,
    data: VolunteerApplication,
    token: string,
  ) {
    const res = await fetch(`${API_URL}/events/${eventId}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
