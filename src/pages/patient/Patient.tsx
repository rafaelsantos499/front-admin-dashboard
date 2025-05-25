import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PatientTable from "../../components/tables/PatientTable/PatientTable";

export default function Patient(){
    
    return(
        <>
       <PageMeta
        title="Organizando Pontos — Seu Painel de Pacientes Simplificado"
        description="Gerencie seus pacientes com facilidade: crie, organize e edite de forma rápida e prática."
      />
      <PageBreadcrumb pageTitle="Pacientes" />
      <div className="space-y-6">
          <PatientTable />       
      </div>
        </>
    )
}