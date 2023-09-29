import React from 'react'
import { FieldValues } from 'react-hook-form'

interface IViewProps {
    onSubmit: (values: FieldValues) => Promise<void>
}
interface DraftsListFormContainerProps {
    View: React.FC<IViewProps>
}
const DraftsListCreateContainer: React.FC<DraftsListFormContainerProps> = ({ View }) => {
    const handleSubmit = async (values: FieldValues) => {
        console.log('VALUES: ', values)
    }

    return <View onSubmit={handleSubmit} />
}
export default DraftsListCreateContainer
