import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useNavigate } from 'react-router-dom'

export const useCiCheckEntityTypeRedirectHook = (ciItemData: ConfigurationItemUi | undefined, entityName: string | undefined) => {
    const navigate = useNavigate()

    if (!ciItemData?.type || !entityName) {
        return
    }
    if (ciItemData.type !== entityName) {
        navigate(`/ci/${ciItemData.type}/${ciItemData.uuid}`)
    }
}
