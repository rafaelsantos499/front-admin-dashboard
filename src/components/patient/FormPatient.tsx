import { Controller, useForm } from "react-hook-form";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { At, BoxIcon, CalenderIcon, EnvelopeIcon, TrashBinIcon, UserIcon } from "../../icons";
import Select from "../form/Select";
import Flatpickr from "react-flatpickr";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import { useEffect, useState, useTransition } from "react";
import { useParams } from 'react-router-dom';
import { createPatient, updatePatient } from "../../service/Patient/patientService";
import { EmergencyContacts, PatientDto } from "../../types/dto/PatientDTO";
import Skeleton from 'react-loading-skeleton'
export interface FormData {
    id: string
    fullName: string;
    email: string;
    birthDate: string;
    phone: string;
    address: string;
    gender: string;
    twitter: string;
    instagram: string;
    facebook: string;
    maritalStatus: string | null;
    EmergencyContacts: EmergencyContacts[];
}
interface EmergencyContactForm {
    contactName: string;
    contactPhone: string;
    contactReason: string;
}

interface FormPatientProps {
    patient?: FormData | null;
    isLoading?: boolean
}

const optionsGender = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "nao-binario", label: "Não-binário" },
    { value: "transgenero", label: "Transgênero" },
    { value: "genero-fluido", label: "Gênero fluido" },
    { value: "agenero", label: "Agênero" },
    { value: "intersexo", label: "Intersexo" },
    { value: "prefiro-nao-dizer", label: "Prefiro não dizer" },
    { value: "outro", label: "Outro" }
];
export default function FormPatient({ patient, isLoading }: FormPatientProps) {
    const params = useParams();
    const newPatient = !params.id;
    const [isPending, startTransition] = useState(false)
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContacts[]>(
        patient?.EmergencyContacts || []
    );

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormData>({
        defaultValues: patient || {
            fullName: "",
            email: "",
            birthDate: "",
            phone: "",
            address: "",
            gender: "",
            twitter: "",
            instagram: "",
            facebook: "",
        }
    });

    const {
        register: registerContact,
        handleSubmit: handleContactSubmit,
        formState: { errors: contactErrors },
        reset: resetContact,
    } = useForm<EmergencyContactForm>({
        defaultValues: {
            contactName: "",
            contactPhone: "",
            contactReason: "",
        },
    });

    useEffect(() => {
        if (patient) {
            reset(patient);
            setEmergencyContacts(patient.EmergencyContacts || []);
        }
    }, [patient, reset]);

    const onSubmit = async (data: FormData) => {
        const basePayload = {
            socialMedia: {
                twitter: data.twitter,
                instagram: data.instagram,
                facebook: data.facebook
            },
            birthDate: data.birthDate[0],
            fullName: data.fullName,
            address: data.address,
            gender: data.gender,
            phone: data.phone
        };

        console.log("emergencyContacts:", emergencyContacts);


        const payload: PatientDto = patient && params.id
            ? basePayload
            : { ...basePayload, email: data.email }; // create, com email
        startTransition(true)
        if (newPatient) {
            await createPatient(payload).finally(() => startTransition(false));
        } else {
            await updatePatient(payload, params.id as string).finally(() => startTransition(false));
        }
    };

    const onAddContact = (data: EmergencyContactForm) => {
        const newContact: EmergencyContacts = {
            name: data.contactName,
            phone: data.contactPhone,
            relationship: data.contactReason,
        };
        setEmergencyContacts((prev) => [...prev, newContact]);
        resetContact();
    };

    const handleRemoveContact = (index: number) => {
        setEmergencyContacts((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="space-y-6">
                        <ComponentCard title="Cadastro de paciente">
                            <div className="space-y-6">
                                {!isLoading ?
                                    <>
                                        <Label htmlFor="input" required>Nome</Label>
                                        <div>
                                            <Input
                                                register={register("fullName", {
                                                    required: "Nome obrigatório",
                                                })}
                                                error={!!errors.fullName}
                                                hint={typeof errors.fullName?.message === "string" ? errors.fullName.message : ""}
                                                placeholder="Nome do paciente"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="input" required>Email</Label>
                                            <div className="relative">
                                                <Input
                                                    className="pl-[62px]"
                                                    type="email"
                                                    placeholder="info@gmail.com"
                                                    register={register("email", {
                                                        required: "Email obrigatório",
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: "Email inválido"
                                                        }
                                                    })}
                                                    error={!!errors.email}
                                                    hint={typeof errors.email?.message === "string" ? errors.email.message : ""}
                                                />
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                    <EnvelopeIcon className="size-6" />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="input">Endereço</Label>
                                            <Input
                                                register={register("address")}
                                                error={!!errors.address}
                                                hint={typeof errors.address?.message === "string" ? errors.address.message : ""}
                                                placeholder="Endereço do paciente"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="input" required>Genero</Label>
                                            <Select
                                                options={optionsGender}
                                                placeholder="Selecione uma opção"
                                                register={register("gender", { required: "Tipo é obrigatório" })}
                                                error={!!errors.gender}
                                                hint={errors.gender?.message}
                                            />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                    </>
                                }

                            </div>
                        </ComponentCard>
                        <ComponentCard title="Contatos de emergência">
                            <div className="space-y-6">
                                <form noValidate>
                                    <div>
                                        <Label htmlFor="contactName" required>Nome do Contato</Label>
                                        <Input
                                            register={registerContact("contactName", {
                                                required: "Nome do contato é obrigatório",
                                            })}
                                            error={!!contactErrors.contactName}
                                            hint={typeof contactErrors.contactName?.message === "string" ? contactErrors.contactName.message : ""}
                                            placeholder="Nome do contato"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Label htmlFor="contactPhone" required>Telefone</Label>
                                        <Input
                                            register={registerContact("contactPhone", {
                                                required: "Telefone é obrigatório",
                                                validate: (value) => {
                                                    const numeric = value.replace(/\D/g, "");
                                                    return numeric.length === 11 || "Telefone incompleto";
                                                },
                                            })}
                                            error={!!contactErrors.contactPhone}
                                            hint={typeof contactErrors.contactPhone?.message === "string" ? contactErrors.contactPhone.message : ""}
                                            placeholder="(99) 99999-9999"
                                            mask="(99) 99999-9999"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Label htmlFor="contactReason">Motivo</Label>
                                        <Input
                                            register={registerContact("contactReason")}
                                            error={!!contactErrors.contactReason}
                                            placeholder="Motivo do contato"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="outline"
                                            onClick={handleContactSubmit(onAddContact)}
                                            endIcon={<BoxIcon className="size-5" />}
                                        >
                                            Adicionar Contato
                                        </Button>
                                    </div>
                                </form>
                                {emergencyContacts.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Contatos Adicionados
                                        </h3>
                                        <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                                            {emergencyContacts.map((contact, index) => (
                                                <li
                                                    key={index}
                                                    className="py-2 text-sm text-gray-600 dark:text-gray-400"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="font-medium">Nome:</span> {contact.name} |{" "}
                                                            <span className="font-medium">Telefone:</span> {contact.phone} |{" "}
                                                            <span className="font-medium">Motivo:</span> {contact.relationship}
                                                        </div>
                                                        <div>
                                                            <span className="">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    type="button"
                                                                    onClick={() => handleRemoveContact(index)}
                                                                    startIcon={<TrashBinIcon className="size-5" />}
                                                                >
                                                                </Button>
                                                            </span>
                                                        </div>
                                                    </div>

                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </ComponentCard>
                    </div>
                    <div className="space-y-6">
                        <ComponentCard title="Cadastro de paciente">
                            <div className="space-y-6">
                                {!isLoading ?
                                    <>
                                        <div>
                                            <Label htmlFor="input" required>Telefone</Label>
                                            <Input
                                                register={register("phone", {
                                                    required: "Telefone obrigatório",
                                                    validate: (value) => {
                                                        const numeric = value.replace(/\D/g, "");
                                                        return numeric.length === 11 || "Telefone incompleto";
                                                    },
                                                })}
                                                error={!!errors.phone}
                                                hint={typeof errors.phone?.message === "string" ? errors.phone.message : ""}
                                                placeholder="(99) 99999-9999"
                                                mask="(99) 99999-9999"
                                            />

                                        </div>
                                        <Label htmlFor="datePicker">Aniversario</Label>
                                        <div className="relative w-full flatpickr-wrapper">
                                            <Controller
                                                name="birthDate"
                                                control={control}
                                                rules={{
                                                    required: "Data de nascimento obrigatória",
                                                    validate: (value) =>
                                                        value ? true : "Data de nascimento obrigatória",
                                                }}
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        {...field}
                                                        options={{
                                                            dateFormat: "Y-m-d",
                                                            locale: Portuguese
                                                        }}
                                                        placeholder="Selecione a data"
                                                        className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${errors.birthDate ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500" : ""
                                                            }`}
                                                    />
                                                )}
                                            />
                                            {errors.birthDate && (
                                                <p className="mt-1.5 text-sm text-error-500">
                                                    {errors.birthDate.message}
                                                </p>
                                            )}
                                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                <CalenderIcon className="size-6" />
                                            </span>
                                        </div>
                                        <div>
                                            <Label htmlFor="input">Instagram</Label>
                                            <div className="relative">
                                                <Input
                                                    className="pl-[62px]"
                                                    register={register("instagram",)}
                                                    error={!!errors.instagram}
                                                    hint={typeof errors.instagram?.message === "string" ? errors.instagram.message : ""}
                                                    placeholder="Digite seu @ do Instagram"
                                                />
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                    <At className="size-6" />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="input">Twitter</Label>
                                            <div className="relative">
                                                <Input
                                                    className="pl-[62px]"
                                                    register={register("twitter",)}
                                                    error={!!errors.twitter}
                                                    hint={typeof errors.twitter?.message === "string" ? errors.twitter.message : ""}
                                                    placeholder="Digite seu @ do Twitter"
                                                />
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                    <At className="size-6" />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="input">Facebook</Label>
                                            <div className="relative">
                                                <Input
                                                    className="pl-[150px]"
                                                    register={register("facebook",)}
                                                    error={!!errors.facebook}
                                                    hint={typeof errors.facebook?.message === "string" ? errors.facebook.message : ""}
                                                    placeholder="Nome de usuário do Facebook"
                                                />
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                    <>facebook.com/</>
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                        <Skeleton className="h-10 mb-3 w-full" />
                                    </>
                                }

                            </div>
                        </ComponentCard>
                        <div className="flex justify-end mt-4">
                            <Button
                                size="sm"
                                variant="primary"
                                startIcon={<UserIcon className="size-5" />}
                                disabled={isPending}
                            >
                                {isPending ? "Salvando..." : newPatient ? 'Adicionar' : 'Editar'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}