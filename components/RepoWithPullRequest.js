import PullRequestHeader from './PullRequestHeader'
import PullRequestRow from './PullRequestRow'
import React, { Component, PropTypes } from 'react'

const style = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden'
}

const RepoWithPullRequest = ({
    dispatch,
    pullRequestCount,
    pullRequests,
    repoName
}) => (
    <div style={style}>
        <PullRequestHeader
            pullRequestCount={pullRequestCount}
            repoName={repoName} />
        {
            pullRequests.map(pr => <PullRequestRow
                assigneeName={pr.assignee ? pr.assignee.login : null}
                assigneeAvatarUrl={pr.assignee ? pr.assignee.avatar_url : null}
                key={pr.id}
                labels={pr.labels || []}
                openedByAvatarUrl={pr.user.avatar_url}
                openedByName={pr.user.login}
                title={pr.title} />
            )
        }
    </div>
)

RepoWithPullRequest.propTypes = {
    pullRequestCount: PropTypes.number.isRequired,
    pullRequests: PropTypes.array.isRequired,
    repoName: PropTypes.string.isRequired
}

export default RepoWithPullRequest
