import { useParams } from 'react-router-dom'

import { EkoEditContainer } from '@/components/containers/Eko/EkoEditContainer'
import { EkoCreateView } from '@/components/views/eko/eko-create-views/EkoCreateView'

const EditEko = () => {
    const { ekoCode } = useParams()
    return <EkoEditContainer ekoCode={ekoCode ?? ''} View={(props) => <EkoCreateView editData={props.data} mutate={props?.mutate} data={[]} />} />
}

export default EditEko
