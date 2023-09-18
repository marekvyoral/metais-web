import React from 'react'
import {
    ConfigurationItemUi,
    EnumType,
    GET_ENUM,
    PoWithHierarchyUi,
    useGetEnum,
    useStorePo,
    useStorePoWithHierarchyRel,
} from '@isdd/metais-common/api'

export interface ICreateOrganizationView {
    data: {
        personCategories: EnumType | undefined
        personTypes: EnumType | undefined
        sources: EnumType | undefined
        replications: EnumType | undefined
        organizationData?: ConfigurationItemUi | undefined
    }
    storePO: (formData: PoWithHierarchyUi, poId: string, relId: string) => Promise<void>
    updatePO: (poId: string, formData: ConfigurationItemUi) => Promise<void>
    isError: boolean
    isLoading: boolean
}

interface ICreateOrganization {
    View: React.FC<ICreateOrganizationView>
    organizationId?: string
}

export const CreateOrganizationContainer: React.FC<ICreateOrganization> = ({ View }: ICreateOrganization) => {
    const { data: personTypes, isLoading: personTypesLoading, isError: personTypesError } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const { data: personCategories, isLoading: personCategoriesLoading, isError: personCategoriesError } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const { data: sources, isLoading: sourcesLoading, isError: sourcesError } = useGetEnum(GET_ENUM.ZDROJ)
    const { data: replications, isLoading: replicationsLoading, isError: replicationsError } = useGetEnum(GET_ENUM.TYP_REPLIKACIE)

    const { mutateAsync } = useStorePoWithHierarchyRel()
    const { mutateAsync: updatePOMutation } = useStorePo()

    const storePO = async (formData: PoWithHierarchyUi, poId: string, relId: string) => {
        await mutateAsync({
            poId,
            relId,
            data: {
                ...formData,
            },
        })
    }

    const updatePO = async (poId: string, formData: ConfigurationItemUi) => {
        await updatePOMutation({
            poId,
            data: {
                ...formData,
            },
        })
    }
    const isLoading = personTypesLoading || personCategoriesLoading || sourcesLoading || replicationsLoading
    const isError = personTypesError || personCategoriesError || sourcesError || replicationsError

    return (
        <View
            data={{
                personCategories,
                personTypes,
                sources,
                replications,
            }}
            storePO={storePO}
            updatePO={updatePO}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
