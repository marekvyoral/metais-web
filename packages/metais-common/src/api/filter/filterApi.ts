import { IFilter, SortType } from '@isdd/idsk-ui-kit/src/types'
import { FieldValues } from 'react-hook-form'

import { IRelationshipTabFilters } from '@isdd/metais-common/hooks/useEntityRelationshipTabFilters'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { CiListFilterContainerUi, NeighboursFilterContainerUi, NeighboursFilterUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    ApiChangeStateTargetState,
    GetFOPReferenceRegisters1Muk,
    GetFOPReferenceRegisters1Params,
    GetFOPReferenceRegisters1State,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { GetFOPStandardRequestsRequestChannel } from '@isdd/metais-common/api/generated/standards-swagger'
import { DEFAULT_PAGESIZE_OPTIONS, FIRST_PAGE_NUMBER } from '@isdd/metais-common/constants'
import { User } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

export interface DraftFilter extends IFilterParams {
    pageNumber?: number
    perPage?: number
    sortBy?: string
    ascending?: boolean
    stateCustom?: string
    state?: string
    createdBy?: string
    name?: string
    workGroupId?: string
    requestChannel?: GetFOPStandardRequestsRequestChannel
    fromDate?: string
    toDate?: string
    draftName?: string
}

export interface DraftFilterResponse extends IFilterParams {
    pageNumber: number
    perPage: number
    sortBy?: string
    ascending?: boolean
    stateCustom?: string
    state?: string
    createdBy?: string
    name?: string
    workGroupId?: string
    requestChannel?: GetFOPStandardRequestsRequestChannel
    fromDate?: string
    toDate?: string
    draftName?: string
}

export interface INeighboursFilter extends IFilter {
    neighboursFilter?: NeighboursFilterUi
}

export const mapFilterToNeighborsApi = <T>(filter: IFilter, defaultApiFilter?: { [filterName: string]: T } | T): CiListFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    return {
        ...defaultApiFilter,
        page: pageNumber ? pageNumber : FIRST_PAGE_NUMBER,
        perpage: pageSize ? pageSize : Number(DEFAULT_PAGESIZE_OPTIONS[0].value),
        sortBy: sort?.[0]?.orderBy ?? '',
        sortType: sort?.[0]?.sortDirection,
    }
}

const getSortByAndSource = (colTechName: string): { sortBy: string; sortSource: string } => {
    const [sortSource, sortBy] = colTechName.split('+')
    return { sortBy: sortBy, sortSource: sortSource }
}

export const mapFilterToNeighborsApiWithTextSearch = <T>(
    filter: IFilter,
    defaultApiFilter?: { [filterName: string]: T } | T,
): CiListFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    return {
        filter: { ...defaultApiFilter, fullTextSearch: filter.full },
        page: pageNumber ? pageNumber : FIRST_PAGE_NUMBER,
        perpage: pageSize ? pageSize : Number(DEFAULT_PAGESIZE_OPTIONS[0].value),
        sortBy: sort?.[0]?.orderBy ?? '',
        sortType: sort?.[0]?.sortDirection,
    }
}

export const mapFilterToRelationApi = (filter: INeighboursFilter, defaultApiFilter?: IRelationshipTabFilters): NeighboursFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    const currentNeighboursFilter = filter.neighboursFilter

    const neighboursFilter: NeighboursFilterUi = {
        ciType:
            currentNeighboursFilter?.ciType && currentNeighboursFilter.ciType.length > 0
                ? currentNeighboursFilter.ciType
                : defaultApiFilter?.neighboursFilter?.ciType.map((item) => item.value),
        relType:
            currentNeighboursFilter?.relType && currentNeighboursFilter.relType.length > 0
                ? currentNeighboursFilter.relType
                : defaultApiFilter?.neighboursFilter?.relType.map((item) => item.value),
        metaAttributes: {
            state:
                currentNeighboursFilter?.metaAttributes?.state && currentNeighboursFilter.metaAttributes.state.length > 0
                    ? currentNeighboursFilter.metaAttributes.state
                    : defaultApiFilter?.neighboursFilter?.metaAttributes?.state,
        },
        fullTextSearch: filter.neighboursFilter?.fullTextSearch,
    }

    return {
        neighboursFilter,
        page: pageNumber,
        perpage: pageSize,
        sortType: sort?.[0]?.sortDirection,
        ...getSortByAndSource(sort?.[0]?.orderBy ?? ''),
    }
}

export const mapFilterToStandardDrafts = (filterParams: FieldValues & IFilterParams & IFilter): DraftFilterResponse => {
    const { pageNumber, pageSize, sort } = filterParams

    const mappedFilter: DraftFilterResponse = {
        pageNumber: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        ascending: sort?.[0]?.sortDirection === SortType.ASC,
        ...(sort?.[0]?.orderBy && { sortBy: sort?.[0]?.orderBy }),
        ...(filterParams?.draftName && { draftName: filterParams?.draftName }),
    }
    if (filterParams?.attributeFilters?.createdBy) {
        mappedFilter.createdBy = filterParams?.attributeFilters?.createdBy.at(0)?.value ?? filterParams?.createdBy
    }

    if (filterParams?.attributeFilters?.workGroupId) {
        mappedFilter.workGroupId = filterParams?.attributeFilters?.workGroupId.at(0)?.value ?? filterParams?.workGroupId
    }

    if (filterParams?.attributeFilters?.stateCustom) {
        mappedFilter.state = filterParams?.attributeFilters?.stateCustom.at(0)?.value ?? filterParams?.stateCustom
    }
    if (filterParams?.attributeFilters?.requestChannel) {
        mappedFilter.requestChannel = filterParams?.attributeFilters?.requestChannel.at(0)?.value ?? filterParams?.requestChannel
    }
    if (filterParams?.attributeFilters?.fromDate) {
        mappedFilter.fromDate = filterParams?.attributeFilters?.fromDate.at(0)?.value ?? filterParams?.fromDate
    }
    if (filterParams?.attributeFilters?.toDate) {
        mappedFilter.toDate = filterParams?.attributeFilters?.toDate.at(0)?.value ?? filterParams?.toDate
    }

    return mappedFilter
}

export const mapFilterToRefRegisters = (filterParams: FieldValues & IFilterParams & IFilter, user?: User | null): GetFOPReferenceRegisters1Params => {
    const { pageNumber, pageSize, sort } = filterParams

    const mappedFilter: GetFOPReferenceRegisters1Params = {
        pageNumber: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        ascending: sort?.[0]?.sortDirection === SortType.ASC,
        ...(sort?.[0]?.orderBy && { sortBy: sort?.[0]?.orderBy }),
    }

    if (filterParams?.registratorUuid) {
        mappedFilter.registratorUuid = filterParams?.registratorUuid
    }
    if (filterParams?.managerUuid) {
        mappedFilter.managerUuid = filterParams?.managerUuid
    }
    if (filterParams?.name) {
        mappedFilter.name = filterParams?.name
    }
    if (filterParams?.isvsUuid) {
        mappedFilter.isvsUuid = filterParams?.isvsUuid
    }
    if (filterParams?.state) {
        mappedFilter.state = filterParams?.state
    }
    if (filterParams?.muk) {
        mappedFilter.muk = filterParams?.muk
    }
    if (!user) {
        mappedFilter.state = ApiChangeStateTargetState.PUBLISHED
    }

    return mappedFilter
}

export const mapFilterToRefRegistersFilter = (
    filterParams: FieldValues & IFilterParams & IFilter,
    user?: User | null,
): GetFOPReferenceRegisters1Params => {
    const { pageNumber, pageSize, sort } = filterParams
    const mappedFilter: GetFOPReferenceRegisters1Params = {
        pageNumber: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        ascending: sort?.[0]?.sortDirection === SortType.ASC,
        ...(sort?.[0]?.orderBy && { sortBy: sort?.[0]?.orderBy }),
    }

    if (filterParams?.attributeFilters?.registratorUuid) {
        mappedFilter.registratorUuid = filterParams?.attributeFilters?.registratorUuid?.[0]?.value ?? filterParams.registratorUuid
    }
    if (filterParams?.attributeFilters?.managerUuid) {
        mappedFilter.managerUuid = filterParams?.attributeFilters?.managerUuid?.[0]?.value ?? filterParams.managerUuid
    }
    if (filterParams?.attributeFilters?.isvsUuid) {
        mappedFilter.isvsUuid = filterParams?.attributeFilters?.isvsUuid?.[0]?.value ?? filterParams.isvsUuid
    }
    if (filterParams?.name) {
        mappedFilter.name = filterParams?.name
    }
    if (filterParams?.attributeFilters?.stateCustom) {
        mappedFilter.state =
            (filterParams?.attributeFilters?.stateCustom?.[0].value as GetFOPReferenceRegisters1State) ??
            (filterParams.stateCustom as GetFOPReferenceRegisters1State)
    }
    if (filterParams?.attributeFilters?.muk) {
        mappedFilter.muk =
            (filterParams?.attributeFilters?.muk?.[0]?.value as GetFOPReferenceRegisters1Muk) ?? (filterParams.muk as GetFOPReferenceRegisters1Muk)
    }
    if (!user) {
        mappedFilter.state = ApiChangeStateTargetState.PUBLISHED
    }

    return mappedFilter
}
