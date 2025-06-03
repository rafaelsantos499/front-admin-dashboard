import { FindAllPatient, Patient, PatientDto } from "../../types/dto/PatientDTO";
import { apiPrivate } from "../api";

export const findAllPatient = async () : Promise<FindAllPatient[]> => {
    const { data } = await apiPrivate.get<FindAllPatient[]>('patient/');
    return data;
}

export const findPatient = async (id: string) : Promise<Patient> => {
    const { data } = await apiPrivate.get<Patient>(`patient/${id}`);
    return data;
}

export const createPatient = async (payload : PatientDto) : Promise<Patient> => {
    const { data } = await apiPrivate.post<Patient>(`patient`,payload);
    return data;
}

export const updatePatient = async (payload : PatientDto, id: string) : Promise<Patient> => {
    const { data } = await apiPrivate.patch<Patient>(`patient/${id}`,payload);
    return data;
}