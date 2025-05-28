import { FindAllPatient, Patient } from "../../types/dto/PatientDTO";
import { apiPrivate } from "../api";

export const findAllPatient = async () : Promise<FindAllPatient[]> => {
    const { data } = await apiPrivate.get<FindAllPatient[]>('patient/');
    return data;
}

export const findPatient = async (id: string) : Promise<Patient> => {
    const { data } = await apiPrivate.get<Patient>(`patient/${id}`);
    return data;
}