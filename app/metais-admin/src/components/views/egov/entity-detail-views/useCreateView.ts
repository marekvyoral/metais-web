import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MutationFeedbackError, getTabsFromApi } from '@isdd/metais-common'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { createTabNamesAndValuesMap } from '@isdd/metais-common/hooks/useEntityProfiles'
import { CiType, Role } from '@isdd/metais-common/api'

import { generateFormValidationSchema } from './createViewHelpers'
import { EntityDetailViewAttributes } from './attributes/EntityDetailViewAttributes'

import { HiddenInputs } from '@/types/inputs'

interface IUseCreateView {
    data?: {
        roles?: Role[]
        existingEntityData?: CiType
    }
    hiddenInputs?: Partial<HiddenInputs>
}

const useCreateView = ({ data, hiddenInputs }: IUseCreateView) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState<boolean>(false)
    const [connectionsOpen, setConnectionsOpen] = useState<boolean>(false)
    const [successedMutation, setSuccessedMutation] = useState<boolean>(false)
    const [error, setError] = useState<MutationFeedbackError | undefined>(undefined)

    const schema = generateFormValidationSchema(t, hiddenInputs)
    const formMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'custom',
            ...data?.existingEntityData,
        },
    })

    const { watch, setValue } = formMethods

    const rolesToSelect =
        data?.roles?.map?.((role) => {
            return {
                value: role?.name ?? '',
                label: role?.description ?? '',
            }
        }) ?? []

    const attributesProfiles = watch('attributeProfiles')
    const keysToDisplay = createTabNamesAndValuesMap(attributesProfiles)

    const removeProfileAttribute = (technicalName: string) => {
        setValue('attributeProfiles', attributesProfiles?.filter((attrProfile) => attrProfile?.technicalName !== technicalName) ?? [])
    }
    const tabsFromForm = getTabsFromApi(keysToDisplay, EntityDetailViewAttributes, undefined, removeProfileAttribute)

    const sourcesFromForm = watch('sources')
    const targetsFromForm = watch('targets')

    return {
        profileAttributesDialog: { open, setOpen },
        connectionsDialog: { connectionsOpen, setConnectionsOpen },
        mutationSuccessResponse: { successedMutation, setSuccessedMutation },
        mutationErrorResponse: { error, setError },
        rolesToSelect,
        tabsFromForm,
        sourcesFromForm,
        targetsFromForm,
        formMethods,
        t,
    }
}

export default useCreateView