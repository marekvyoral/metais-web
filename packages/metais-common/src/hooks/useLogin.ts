import { getAuthorizeToken } from '@isdd/metais-common/api/authorizeApi'

export const useLogin = () => {
    // this will relocate with access_token in query
    return {
        mutateAuthorize: getAuthorizeToken,
    }
}
