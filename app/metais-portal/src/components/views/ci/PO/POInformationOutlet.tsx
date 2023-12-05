import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { PO } from '@isdd/metais-common/constants'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { CiContainer } from '@/components/containers/CiContainer'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

const POInformationOutlet = () => {
    const { entityId } = useGetEntityParamsFromUrl()
    const entityName = PO
    return (
        <CiContainer
            configurationItemId={entityId ?? ''}
            View={({ data, isError: isCiItemError, isLoading: isCiItemLoading }) => {
                const ciItemData = data?.ciItemData
                const gestorData = data?.gestorData
                return (
                    <AttributesContainer
                        entityName={entityName ?? ''}
                        View={({ data: { ciTypeData, constraintsData, unitsData }, isError: attError, isLoading: attLoading }) => {
                            return (
                                <CiInformationAccordion
                                    data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }}
                                    isError={[isCiItemError, attError].some((item) => item)}
                                    isLoading={[isCiItemLoading, attLoading].some((item) => item)}
                                />
                            )
                        }}
                    />
                )
            }}
        />
    )
}

export default POInformationOutlet
