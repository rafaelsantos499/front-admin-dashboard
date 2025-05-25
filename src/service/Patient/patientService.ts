import { FindAllPatient } from "../../types/dto/PatientDTO";
import { apiPrivate } from "../api";

export const findAllPatient = async () : Promise<FindAllPatient[]> => {
    const { data } = await apiPrivate.get<FindAllPatient[]>('patient/');
    return data;
}