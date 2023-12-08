// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useUserConfigSwaggerClient } from '@isdd/metais-common/api/hooks/useUserConfigSwaggerClient'

export interface IApproveFormData {
    description?: string
    hodnotenie_spravnosti?: string
    hodnotenie_uplnosti?: string
    overil_datum?: string
    overil_funkcia?: string
    overil_meno?: string
    schvalil_datum?: string
    schvalil_funkcia?: string
    schvalil_meno?: string
    vyhotovil_datum?: string
    vyhotovil_funkcia?: string
    vyhotovil_meno?: string
    Gen_Profil_kod_metais?: string
    Gen_Profil_ref_id?: string
}

export const useGetKirtColumnsHook = (): ((urlKey: string) => Promise<IApproveFormData>) => {
    const getRelationColumns = useUserConfigSwaggerClient<IApproveFormData>()

    return (urlKey: string) => {
        return getRelationColumns({ url: `/kv/${urlKey}`, method: 'get' })
    }
}

export const useUpdateKirtColumnsHook = () => {
    const updateRelationColumns = useUserConfigSwaggerClient<void>()

    return (urlKey: string, data: IApproveFormData) => {
        return updateRelationColumns({ url: `/kv/${urlKey}`, method: 'put', headers: { 'Content-Type': 'application/json' }, data })
    }
}
