import { createTabNamesAndValuesMap } from '@isdd/metais-common/hooks/useEntityProfiles'
import { AttributeProfile, Cardinality, CiType, CiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { yupResolver } from '@hookform/resolvers/yup'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { getTabsFromApi } from '@isdd/metais-common/index'

import { EntityDetailViewAttributes } from '../attributes/EntityDetailViewAttributes'

import { generateFormValidationSchema } from './schemas/createGeneralCreateFormSchema'

import { HiddenInputs } from '@/types/inputs'

interface iCreateForm {
    data?: {
        roles?: Role[]
        existingEntityData?: CiType
    }
    hiddenInputs?: Partial<HiddenInputs>
}

interface iCreateFormOutput {
    formMethods: UseFormReturn<
        {
            name: string
            engName: string | undefined
            technicalName: string
            codePrefix: string | undefined
            uriPrefix: string | undefined
            description: string
            engDescription: string | undefined
            attributeProfiles: AttributeProfile[] | undefined
            roleList: (string | undefined)[] | undefined
            type: string
            sources: CiTypePreview[] | undefined
            sourceCardinality?: Cardinality | undefined
            targets: CiTypePreview[] | undefined
            targetCardinality?: Cardinality | undefined
        },
        unknown,
        undefined
    >
    tabsFromForm: {
        id: string
        title: string
        content: JSX.Element
    }[]
    sourcesFromForm?: CiTypePreview[]
    targetsFromForm?: CiTypePreview[]
    selectedRoles?: { value: string; label: string }[]
}

export const useCreateForm = ({ data, hiddenInputs }: iCreateForm): iCreateFormOutput => {
    const { t } = useTranslation()
    const schema = generateFormValidationSchema(t, hiddenInputs)
    const formMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'custom',
            ...data?.existingEntityData,
        },
    })

    const { watch, setValue } = formMethods

    const attributesProfiles = watch('attributeProfiles')
    const keysToDisplay = createTabNamesAndValuesMap(attributesProfiles)

    const removeProfileAttribute = (technicalName: string) => {
        setValue('attributeProfiles', attributesProfiles?.filter((attrProfile) => attrProfile?.technicalName !== technicalName) ?? [])
    }
    const tabsFromForm = getTabsFromApi(keysToDisplay, EntityDetailViewAttributes, undefined, removeProfileAttribute)

    const sourcesFromForm = watch('sources')
    const targetsFromForm = watch('targets')
    const rolesFromForm = watch('roleList')

    const selectedRoles = rolesFromForm?.map((selectedRole) => {
        return {
            value: selectedRole ?? '',
            label: selectedRole ?? '',
        }
    })

    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        formMethods,
        tabsFromForm,
        sourcesFromForm,
        targetsFromForm,
        selectedRoles,
    }
}
