import { useQuery } from '@tanstack/react-query'

import { getHowToDisplayUnits } from '@/api/HowToDisplay'

export const useHowToDisplayUnits = (enabled: boolean) => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['displayUnits'],
        queryFn: () => getHowToDisplayUnits(),
        enabled: enabled,
    })

    return {
        isLoading,
        isError,
        data,
    }
}
