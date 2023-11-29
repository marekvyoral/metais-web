import { ATTRIBUTE_NAME, ATTRIBUTE_PROFILE_NAME, PROJECT_STATE_ENUM } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CiType, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const filterProjectSchemaForCreateBasedOnProjectStatus = (projectSchema: CiType | undefined): CiType | undefined => {
    const financeProfilIndex = projectSchema?.attributeProfiles?.findIndex(
        (profile) => profile.technicalName == ATTRIBUTE_PROFILE_NAME.Financny_Profil_Projekt,
    )

    if (financeProfilIndex == null) return projectSchema

    const financeProfil = projectSchema?.attributeProfiles?.at(financeProfilIndex)
    const filteredFinanceProfilAttributes = financeProfil?.attributes?.filter(
        (att) =>
            !(
                att.technicalName == ATTRIBUTE_NAME.Financny_Profil_Projekt_schvalene_rocne_naklady ||
                att.technicalName == ATTRIBUTE_NAME.Financny_Profil_Projekt_schvaleny_rozpocet
            ),
    )
    const filteredFinanceProfil: AttributeProfile = { ...financeProfil, attributes: filteredFinanceProfilAttributes }
    const filteredProjectSchema = {
        ...projectSchema,
        attributeProfiles: [
            ...(projectSchema?.attributeProfiles?.slice(0, financeProfilIndex) ?? []),
            filteredFinanceProfil,
            ...(projectSchema?.attributeProfiles?.slice(financeProfilIndex + 1) ?? []),
        ],
    }

    return filteredProjectSchema
}

const hasRightsToEditProjectApprovedFinanceAttributes = (entityData: ConfigurationItemUi | undefined): boolean => {
    const projectStatus = entityData?.attributes?.[ATTRIBUTE_NAME.EA_Profil_Projekt_status]

    const hasPermissionToEdit = projectStatus == PROJECT_STATE_ENUM.c_stav_projektu_4 || projectStatus == PROJECT_STATE_ENUM.c_stav_projektu_11

    return hasPermissionToEdit
}

export const filterProjectSchemaForEditBasedOnProjectStatus = (
    projectSchema: CiType | undefined,
    projectData: ConfigurationItemUi | undefined,
): CiType | undefined => {
    const hasRightsToEditApprovedFinanceAttributes = hasRightsToEditProjectApprovedFinanceAttributes(projectData)

    if (hasRightsToEditApprovedFinanceAttributes) {
        return projectSchema
    } else {
        const filteredProjectSchema = filterProjectSchemaForCreateBasedOnProjectStatus(projectSchema)
        return filteredProjectSchema
    }
}
