import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ApiVotePreviewList, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, GetVotesParams, QueryFeedback, useGetVotes } from '@isdd/metais-common/index'
import React from 'react'

import { IVotesListView } from '../views/votes/VoteListView'

interface IVotesListContainer {
    View: React.FC<IVotesListView>
}

const defaultParamValues: GetVotesParams = {
    ascending: false,
    onlyMy: false,
    sortBy: 'effectiveFrom',
    pageNumber: BASE_PAGE_NUMBER,
    perPage: BASE_PAGE_SIZE,
}

const mockVotesListResponseString = `{
    "votesCount": 396,
    "votes": [
      {
        "id": 394,
        "name": "PS4: Súhlasíte s predloženým návrhom, aby osoba vykonávajúca zaručenú konverziu nebola povinná konvertovať vnorené podpisové kontajnery a zároveň bola povinná informovať žiadateľa o existencii vnorených podpisov v dokumente predloženom na konverziu?",
        "description": "",
        "createdAt": "2023-08-25T10:56:07.774",
        "effectiveFrom": "2023-08-25T00:00:00.000",
        "effectiveTo": "2023-09-06T23:59:59.999",
        "voteState": "SUMMARIZED",
        "secret": false,
        "veto": false,
        "createdBy": "veronika.drotarova",
        "actionDesription": "Návrh bol schválený v súlade s čl. 7 ods. 7 Štatútu a rokovacieho poriadku Komisie pre štandardizáciu ITVS.",
        "standardRequestId": null,
        "canCast": "false",
        "hasCast": "no"
      },
      {
        "id": 395,
        "name": "PS4: Súhlasíte s návrhom na doplnenie § 5 a § 6 vyhlášky č.  70/2021 Z. z. o zaručenej konverzii a prílohy č. 4 a prílohy č. 6 k vyhláške č.  70/2021 Z. z. o zaručenej konverzii v predloženom znení?",
        "description": "",
        "createdAt": "2023-08-25T11:13:56.151",
        "effectiveFrom": "2023-08-25T00:00:00.000",
        "effectiveTo": "2023-09-06T23:59:59.999",
        "voteState": "SUMMARIZED",
        "secret": false,
        "veto": false,
        "createdBy": "veronika.drotarova",
        "actionDesription": "Návrh bol schválený v súlade s čl. 7 ods. 7 Štatútu a rokovacieho poriadku Komisie pre štandardizáciu ITVS.",
        "standardRequestId": null,
        "canCast": "false",
        "hasCast": "no"
      }
    ]
  } `

const mockVotesListResponse: ApiVotePreviewList = JSON.parse(mockVotesListResponseString) as ApiVotePreviewList

export const VotesListContainer: React.FC<IVotesListContainer> = ({ View }) => {
    const { filter, handleFilterChange } = useFilterParams<GetVotesParams>({
        sortBy: 'effectiveFrom',
        // ascending: defaultSort.sortDirection === SortType.ASC ? 'true' : 'false',
        ascending: false,
        pageNumber: BASE_PAGE_NUMBER,
        perPage: BASE_PAGE_SIZE,
    })
    const { data: votesList, isLoading, isError } = useGetVotes(defaultParamValues)
    // const pagination = usePagination(tableData, filterParams)
    return (
        <QueryFeedback loading={isLoading} error={false} indicatorProps={{ layer: 'parent' }}>
            <View votesListData={mockVotesListResponse} />
        </QueryFeedback>
    )
}
