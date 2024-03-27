import diff_match_patch, { DIFF_DELETE, DIFF_EQUAL, DIFF_INSERT } from 'diff-match-patch'

//removes ¶ and other signs caused by diff lib
//https://stackoverflow.com/questions/13894514/google-diff-match-avoid-showing-new-lines
export const customPrettyDiff = (diff: diff_match_patch.Diff[], dmp: diff_match_patch): string => {
    diff_match_patch.prototype.diff_prettyHtml = function (diffs) {
        const html = []
        const pattern_amp = /&/g
        const pattern_lt = /</g
        const pattern_gt = />/g
        const pattern_para = /\n/g
        for (let x = 0; x < diffs.length; x++) {
            const op = diffs[x][0]
            const data = diffs[x][1]
            const text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;').replace(pattern_gt, '&gt;').replace(pattern_para, '<br>')
            switch (op) {
                case DIFF_INSERT:
                    html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>'
                    break
                case DIFF_DELETE:
                    html[x] = '<del style="background:#ffe6e6;">' + text + '</del>'
                    break
                case DIFF_EQUAL:
                    html[x] = '<span>' + text + '</span>'
                    break
            }
        }
        return html.join('')
    }

    return dmp.diff_prettyHtml(diff)
}
