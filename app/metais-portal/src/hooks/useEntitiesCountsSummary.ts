import { SortBy } from '@isdd/idsk-ui-kit/types'
import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetCodelistHeaders } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { ENTITY_KS, DRAFT, ENTITY_AS, ENTITY_ISVS, ENTITY_PROJECT } from '@isdd/metais-common/constants'
import { CodeListState } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import { Languages } from '@isdd/metais-common/localization/languages'

export enum TypKS {
    C_TYP_KS_1 = 'c_typ_ks.1',
    C_TYP_KS_2 = 'c_typ_ks.2',
    C_TYP_KS_3 = 'c_typ_ks.3',
    C_TYP_KS_4 = 'c_typ_ks.4',
    C_TYP_KS_5 = 'c_typ_ks.5',
}

export const useEntitiesCountsSummary = () => {
    const PER_PAGE_ONE = 1
    const PAGE_NUMBER_ONE = 1
    const EA_Profil_KS_typ_ks = 'EA_Profil_KS_typ_ks'
    const Profil_UPVS_je_genericka = 'Profil_UPVS_je_genericka'

    //CODELIST
    const {
        data: codelistData,
        isLoading: isCodelistLoading,
        isError: isCodelistError,
    } = useGetCodelistHeaders({
        language: Languages.SLOVAK,
        sortBy: SortBy.CODE,
        ascending: false,
        wfState: CodeListState.PUBLISHED,
        pageNumber: PAGE_NUMBER_ONE,
        perPage: PER_PAGE_ONE,
    })

    //KONCOVE SLUZBY STATNEJ SPRAVY (PREVADZKOVANE)
    const {
        data: ksStateData,
        isLoading: isKsStateLoading,
        isError: isKsStateError,
    } = useReadCiList1({
        filter: {
            type: [ENTITY_KS],
            attributes: [
                {
                    name: EA_Profil_KS_typ_ks,
                    filterValue: [
                        {
                            value: TypKS.C_TYP_KS_1,
                            equality: OPERATOR_OPTIONS.EQUAL,
                        },
                        {
                            value: TypKS.C_TYP_KS_4,
                            equality: OPERATOR_OPTIONS.EQUAL,
                        },
                        {
                            value: TypKS.C_TYP_KS_5,
                            equality: OPERATOR_OPTIONS.EQUAL,
                        },
                    ],
                },
            ],
            metaAttributes: {
                state: [DRAFT],
            },
        },
        page: PAGE_NUMBER_ONE,
        perpage: PER_PAGE_ONE,
    })

    //KONCOVE SLUZBY SAMOSPRAVY
    const {
        data: ksSelfData,
        isLoading: isKsSelfLoading,
        isError: isKsSelfError,
    } = useReadCiList1({
        filter: {
            type: [ENTITY_KS],
            attributes: [
                {
                    name: EA_Profil_KS_typ_ks,
                    filterValue: [
                        {
                            value: TypKS.C_TYP_KS_3,
                            equality: OPERATOR_OPTIONS.EQUAL,
                        },
                        {
                            value: TypKS.C_TYP_KS_2,
                            equality: OPERATOR_OPTIONS.EQUAL,
                        },
                    ],
                },
                {
                    name: Profil_UPVS_je_genericka,
                    filterValue: [
                        {
                            value: 'true',
                            equality: OPERATOR_OPTIONS.EQUAL,
                        },
                    ],
                },
            ],
            metaAttributes: {
                state: [DRAFT],
            },
        },
        page: PAGE_NUMBER_ONE,
        perpage: PER_PAGE_ONE,
    })

    //PROJEKT
    const {
        data: projectData,
        isLoading: isProjectLoading,
        isError: isProjectError,
    } = useReadCiList1({
        filter: {
            type: [ENTITY_PROJECT],
            metaAttributes: {
                state: [DRAFT],
            },
        },
        page: PAGE_NUMBER_ONE,
        perpage: PER_PAGE_ONE,
    })

    //AS DATA
    const {
        data: asData,
        isLoading: isAsLoading,
        isError: isAsError,
    } = useReadCiList1({
        filter: {
            type: [ENTITY_AS],
            metaAttributes: {
                state: [DRAFT],
            },
        },
        page: PAGE_NUMBER_ONE,
        perpage: PER_PAGE_ONE,
    })

    //ISVS DATA
    const {
        data: isvsData,
        isLoading: isIsvsLoading,
        isError: isIsvsError,
    } = useReadCiList1({
        filter: {
            type: [ENTITY_ISVS],
            metaAttributes: {
                state: [DRAFT],
            },
        },
        page: PAGE_NUMBER_ONE,
        perpage: PER_PAGE_ONE,
    })

    return {
        codelistCount: codelistData?.codelistsCount ?? 0,
        ksStateCount: ksStateData?.pagination?.totaltems ?? 0,
        ksSelfCount: ksSelfData?.pagination?.totaltems ?? 0,
        projectCount: projectData?.pagination?.totaltems ?? 0,
        asCount: asData?.pagination?.totaltems ?? 0,
        isvsCount: isvsData?.pagination?.totaltems ?? 0,
        isLoading: isAsLoading || isKsSelfLoading || isKsStateLoading || isIsvsLoading || isCodelistLoading || isProjectLoading,
        isError: isAsError || isKsSelfError || isKsStateError || isIsvsError || isCodelistError || isProjectError,
    }
}
