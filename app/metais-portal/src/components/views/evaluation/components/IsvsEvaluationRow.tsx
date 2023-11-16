import { TextArea } from '@isdd/idsk-ui-kit/index'
import { KrisToBeRights, useGetEvaluations } from '@isdd/metais-common/api/generated/kris-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from '../evaluationView.module.scss'

interface IIsvsEvaluationRowProps {
    uuid?: string
    entityId: string
    isvsAttributes?: AttributeProfile
    dataRights?: KrisToBeRights
}

export const IsvsEvaluationRow: React.FC<IIsvsEvaluationRowProps> = ({ uuid, entityId, isvsAttributes, dataRights }) => {
    const { t } = useTranslation()
    const { data, isError, isLoading } = useGetEvaluations(entityId, uuid ?? '', 'ISVS')
    const { handleSubmit } = useForm()
    const [changeValidate, setChangeValidate] = useState<boolean>(false)

    const onSubmit = (data: any) => {
        return
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <div className={styles.expandableRowContent}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {data?.state?.values?.map((item, index) => (
                        <InformationGridRow
                            key={`${item.name}-${index}`}
                            label={isvsAttributes?.attributes?.find((att) => att.technicalName === item.name)?.name ?? ''}
                            tooltip={isvsAttributes?.attributes?.find((att) => att.technicalName === item.name)?.description ?? ''}
                            value={
                                dataRights?.inEvaluation && changeValidate ? (
                                    <TextArea
                                        label={''}
                                        name={'suggestion'}
                                        rows={3}
                                        defaultValue={data?.evaluations?.[0]?.values?.find((e) => e.name === item.name)?.value ?? ''}
                                        onChange={(e) => {
                                            //debouncedHandlerEvaluation(e.target.value)
                                        }}
                                    />
                                ) : (
                                    <span>{data?.evaluations?.[0]?.values?.find((e) => e.name === item.name)?.value}</span>
                                )
                            }
                        />
                    ))}
                </form>
            </div>
        </QueryFeedback>
    )
}
