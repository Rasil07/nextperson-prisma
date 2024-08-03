"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export interface Person {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  dateOfBirth: string | null;
}

export const createPerson = async (formData: FormData): Promise<Person> => {
  console.log({ formData });
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const phone = formData.get("phone");
  const dateOfBirth = formData.get("dateOfBirth");

  if (
    typeof firstname !== "string" ||
    typeof lastname !== "string" ||
    typeof phone !== "string" ||
    typeof dateOfBirth !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  const person = await prisma.person.create({
    data: {
      firstname,
      lastname,
      phone,
      dateOfBirth,
    },
  });

  return person;
};

export async function updatePerson(formData: FormData): Promise<Person> {
  const id = formData.get("id") as string;
  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  const phone = formData.get("phone") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;

  if (!id || !firstname || !lastname || !phone) {
    throw new Error("Invalid form data");
  }

  const updatedPerson = await prisma.person.update({
    where: { id: parseInt(id) },
    data: {
      firstname,
      lastname,
      phone,
      dateOfBirth,
    },
  });

  return updatedPerson;
}

export const deletePerson = async (id: string) =>
  prisma.person.delete({ where: { id: parseInt(id) } });
