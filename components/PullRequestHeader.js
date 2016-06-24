import React, { PropTypes } from 'react'

const PullRequestHeader = ({
    pullRequestCount,
    repoName
}) => (
    <div style={{
        padding: '10px 20px', 
        backgroundColor: '#F78F1E'
    }}>
        <div style={{
            borderRadius: '10px',
            padding: '2px 10px',
            background: 'white',
            display: 'inline-block'
        }}>
            {pullRequestCount}
        </div> 
        <div style={{
            paddingLeft: 10,
            display: 'inline-block',
            fontWeight: 500
        }}>
            {repoName}
        </div>
    </div>
)

PullRequestHeader.propTypes = {
    pullRequestCount: PropTypes.number.isRequired,
    repoName: PropTypes.string.isRequired
}

export default PullRequestHeader
