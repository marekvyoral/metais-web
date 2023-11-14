import { NeighbourPairUi, useReadCiNeighbours } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { BASE_PAGE_NUMBER } from '@isdd/metais-common/api/constants'
import React, { useEffect, useState } from 'react'
import { FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { ApiReferenceRegister, useGetFOPReferenceRegisters1 } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IRefRegisterCreateFormData } from '@/components/views/refregisters/schema'
import { RefRegisterSourceRegisterSectionView } from '@/components/views/refregisters/createView/RefRegisterSourceRegisterSectionView'

interface IProps {
    defaultData?: ApiReferenceRegister

    renamedAttributes?: Attribute[]
    setValue: UseFormSetValue<IRefRegisterCreateFormData>
    clearErrors: UseFormClearErrors<IRefRegisterCreateFormData>
    formState: FormState<IRefRegisterCreateFormData>
    register: UseFormRegister<IRefRegisterCreateFormData>
    creatorNotSet: boolean
    userGroupId?: string
}
const refRegistersFilter = {
    page: 1,
    perpage: 1000,
    neighboursFilter: {
        relType: ['PO_je_spravca_ISVS'],
        ciType: ['ISVS'],
        metaAttributes: {
            state: ['APPROVED_BY_OWNER', 'DRAFT'],
        },
    },
}

export const RefRegisterSourceRegisterSection: React.FC<IProps> = ({
    defaultData,
    renamedAttributes,
    setValue,
    clearErrors,
    formState,
    register,
    creatorNotSet,
    userGroupId,
}) => {
    const [sourceRegister, setSourceRegister] = useState<NeighbourPairUi>()

    const pageLimit = 50000

    const { data: refRegistersData } = useGetFOPReferenceRegisters1({ pageNumber: BASE_PAGE_NUMBER, perPage: pageLimit })

    const { data: sourceRegistersUnfiltered } = useReadCiNeighbours(userGroupId ?? '', refRegistersFilter)

    const sourceRegisters = sourceRegistersUnfiltered?.fromNodes?.neighbourPairs?.filter((sR) =>
        refRegistersData?.referenceRegistersList?.find((refRegister) => refRegister.isvsUuid !== sR.configurationItem?.uuid),
    )

    useEffect(() => {
        if (sourceRegister) {
            setValue('refRegisters.codeMetaIS', sourceRegister?.configurationItem?.attributes?.Gen_Profil_kod_metais)
            setValue('refRegisters.refId', sourceRegister?.configurationItem?.attributes?.Gen_Profil_ref_id)
        }
    }, [setValue, sourceRegister])

    return (
        <RefRegisterSourceRegisterSectionView
            defaultData={defaultData}
            sourceRegisters={sourceRegisters}
            renamedAttributes={renamedAttributes}
            setValue={setValue}
            clearErrors={clearErrors}
            formState={formState}
            register={register}
            setSourceRegister={setSourceRegister}
            creatorNotSet={creatorNotSet}
        />
    )
}
