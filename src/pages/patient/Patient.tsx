import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { findPatient } from "../../service/Patient/patientService";
import { Patient, SocialMedia } from "../../types/dto/PatientDTO";
import FormPatient, { FormData } from "../../components/patient/FormPatient";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate } from 'react-router-dom';

export default function Patients() {
    const [patient, setPatient] = useState<Patient | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatient = async () => {
            if (id) {
                try {
                    const response = await findPatient(id);

                    if (typeof response.socialMedia === "string") {
                        const socialMediaObj: SocialMedia = JSON.parse(response.socialMedia);
                        response.twitter = socialMediaObj.twitter || '';
                        response.instagram = socialMediaObj.instagram || '';
                        response.facebook = socialMediaObj.facebook || '';
                    }

                    setPatient(response);
                } catch (error) {
                    navigate('/patient')
                }
            }
        };

        fetchPatient();
    }, [id]);

    // Converta patient para o formato FormData que o FormPatient espera
    const formPatientData: FormData | undefined = patient
        ? {
            fullName: patient.fullName || "",
            email: patient.email || "",
            birthDate: patient.birthDate || "",
            phone: patient.phone || "",
            address: patient.address || "",
            gender: patient.gender || "",
            twitter: patient.twitter || "",
            instagram: patient.instagram || "",
            facebook: patient.facebook || "",
        }
        : undefined;

    return (
        <>
            <PageMeta
                title="Organizando Pontos — Gerencie Seus Pacientes com Facilidade"
                description="Cadastre e acompanhe seus pacientes de forma prática e eficiente."
            />
            <PageBreadcrumb pageTitle={id ? 'Editar' : 'Cadastro'} previousPage={{ url: '/patient', title: 'Pacientes' }} />
            <div className="space-y-6">
                <FormPatient patient={formPatientData} />
            </div>
        </>
    );
}
