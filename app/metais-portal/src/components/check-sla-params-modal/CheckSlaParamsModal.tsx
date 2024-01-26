import { BaseModal, PaginatorWrapper, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import {
    CheckRequiredSlaParametersParams,
    ListParameterTypes1Params,
    useCheckRequiredSlaParameters,
    useListParameterTypes1,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, ZERO_DATA_LENGTH } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'

type Props = {
    isOpen: boolean
    onClose: () => void
    entityId: string
}

type CustomApiParameterType = {
    paramName: string
    serviceName: string
    metaisCode: string
}

export const CheckSlaParamsModal: React.FC<Props> = ({ isOpen, onClose, entityId }) => {
    const { t } = useTranslation()

    const [pageNumber, setPageNumber] = useState(BASE_PAGE_NUMBER)
    const [pageSize, setPageSize] = useState(BASE_PAGE_SIZE)
    const TYP_PARAMETROV_KATEGORIA_AS = 'c_typ_parametra_kategoria.3'

    const reqSlaParamsFilter: CheckRequiredSlaParametersParams = {
        slaContractUuid: entityId,
        parameterTypeCategory: TYP_PARAMETROV_KATEGORIA_AS,
        page: pageNumber,
        perPageSize: pageSize,
    }
    const listParamsFilter: ListParameterTypes1Params = {
        category: TYP_PARAMETROV_KATEGORIA_AS,
        page: BASE_PAGE_NUMBER,
        perPageSize: 10000,
        ignoreNonActual: true,
    }
    const { data: reqSlaParams } = useCheckRequiredSlaParameters(reqSlaParamsFilter)
    const { data: listParams } = useListParameterTypes1(listParamsFilter)

    const dataLength = reqSlaParams?.results?.reduce((acc, obj) => {
        if (obj.slaParameters && obj.slaParameters?.length) {
            return acc + obj.slaParameters?.length
        }
        return acc
    }, 0)
    const startOfList = pageNumber * pageSize - pageSize
    const endOfList = pageNumber * pageSize

    const dataForColumns: CustomApiParameterType[] =
        reqSlaParams?.results?.flatMap(
            (service) =>
                service.slaParameters?.map((param) => {
                    const matchedParam = listParams?.results?.find((p) => p.code == param.type) ?? {}

                    return {
                        paramName: matchedParam.name ?? '',
                        serviceName: service.name ?? '',
                        metaisCode: service.code ?? '',
                    }
                }) ?? [],
        ) ?? []

    const columns: Array<ColumnDef<CustomApiParameterType>> = [
        {
            header: t('checkSlaParams.service'),
            accessorFn: (row) => row.serviceName,
            id: 'service',
            cell: (ctx) => ctx?.getValue?.(),
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('checkSlaParams.metaisCode'),
            accessorFn: (row) => row.metaisCode,
            id: 'metaisCode',
            cell: (ctx) => ctx?.getValue?.(),
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('checkSlaParams.paramName'),
            accessorFn: (row) => row.paramName,
            id: 'paramName',
            cell: (ctx) => ctx?.getValue?.(),
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
    ]

    return (
        <BaseModal isOpen={isOpen} close={onClose}>
            <TextHeading size="M">{t('checkParams.heading')}</TextHeading>
            <ActionsOverTable
                entityName=""
                pagination={{
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    dataLength: dataLength ?? ZERO_DATA_LENGTH,
                }}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <Table data={dataForColumns.slice(startOfList, endOfList)} columns={columns} />
            <PaginatorWrapper
                pageNumber={pageNumber}
                pageSize={pageSize}
                dataLength={dataLength ?? ZERO_DATA_LENGTH}
                handlePageChange={(paging) => {
                    setPageNumber(paging.pageNumber ?? BASE_PAGE_NUMBER)
                    setPageSize(paging.pageSize ?? BASE_PAGE_SIZE)
                }}
            />
        </BaseModal>
    )
}
