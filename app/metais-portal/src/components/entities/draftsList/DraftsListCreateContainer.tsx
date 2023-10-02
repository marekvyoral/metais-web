import { useCreateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import React from 'react'
import { FieldValues } from 'react-hook-form'

interface IViewProps {
    onSubmit: (values: FieldValues) => Promise<void>
    isSuccess: boolean
    isError: boolean
}
interface DraftsListFormContainerProps {
    View: React.FC<IViewProps>
}
const DraftsListCreateContainer: React.FC<DraftsListFormContainerProps> = ({ View }) => {
    const { mutateAsync, isSuccess, isError } = useCreateStandardRequest()

    const handleSubmit = async (values: FieldValues) => {
        await mutateAsync({
            data: {
                ...values,
            },
        })
    }

    return <View onSubmit={handleSubmit} isSuccess={isSuccess} isError={isError} />
}
export default DraftsListCreateContainer
