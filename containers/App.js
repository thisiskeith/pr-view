import config from '../config'
import React, { Component, PropTypes } from 'react'
import RepoWithPullRequest from '../components/RepoWithPullRequest'
import SidebarHeader from '../components/SidebarHeader'
import SidebarRow from '../components/SidebarRow'
import { connect } from 'react-redux'
import { fetchRepos } from '../actions'

const REFETCH_INTERVAL = 60000

const style = {
    header: {
        backgroundColor: '#252726',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        lineHeight: '50px',
        fontSize: '28px'
    }
}

class App extends Component {

    constructor(props) {

        super(props)

        this.interval = undefined
    }

    componentDidMount () {

        const { dispatch } = this.props

        dispatch(fetchRepos(config.github.org))
    }

    componentWillUpdate (nextProps) {

        // Refetch PRs
        if (this.interval === undefined) {

            const { dispatch } = nextProps

            this.interval = setInterval(() => 
                dispatch(fetchRepos(config.github.org)), REFETCH_INTERVAL
            )
        }
    }

    componentWillUnmount () {

        if (this.interval !== undefined) {
            clearInterval(this.interval)
            this.interval = undefined
        }
    }

    render () {

        const { 
            assignedToUsers,
            isFetching,
            openedByUsers,
            pullRequestCount,
            repos,
            reposWithPullRequests
        } = this.props

        const assignedTo = []
        const openedBy = []
        let reposWithPullRequestNodes = []

        // Sort opened by users
        openedByUsers.sort(this.sortByKey.bind(null, 'count'))

        // Sort assigned to users
        assignedToUsers.sort(this.sortByKey.bind(null, 'count'))

        if (reposWithPullRequests.length > 0) {

            // Sort repos by open PRs
            reposWithPullRequests
                .sort(this.sortByKey.bind(null, 'pullRequestCount'))

            reposWithPullRequests.forEach((repo, i) => {
                reposWithPullRequestNodes.push(
                    <RepoWithPullRequest
                        key={i}
                        pullRequestCount={repo.pullRequestCount}
                        pullRequests={repo.pullRequests}
                        repoName={repo.name} />
                )
            })
        }

        return (
            <div>
                <div className='header row' style={style.header}>
                    {
                        isFetching
                            ? 'Fetching GitHub..'
                            : `${pullRequestCount} Open Pull Requests`
                    }
                </div>
                <div className='body row'>
                    <div className='viewColumnLeft column scrollY'>
                        {
                            openedByUsers.length > 0 ?
                                <div>
                                    <SidebarHeader label="opened by" />
                                    {openedByUsers.map((user, i) => <SidebarRow 
                                        count={user.count} 
                                        icon={user.avatar}
                                        key={i} 
                                        label={user.name} />
                                    )}
                                </div>
                                : null
                        }
                        {
                            assignedToUsers.length > 0 ?
                                <div>
                                    <SidebarHeader label="assigned to" />
                                    {assignedToUsers.map((user, i) => <SidebarRow 
                                        count={user.count} 
                                        icon={user.avatar}
                                        key={i} 
                                        label={user.name} />
                                    )}
                                </div> 
                                : null
                        }
                    </div>
                    <div className='viewColumnRight column scrollY'>
                        {reposWithPullRequestNodes} 
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Helper method to sort user arrays by count
     *
     * @param   String
     * @param   Object
     * @param   Object 
     * @return  Number
     */
    sortByKey (key, a, b) { 

        a = a[key] || 0
        b = b[key] || 0

        if (a > b) { 
            return -1 
        }
        if (b > a) { 
            return 1 
        }

        return 0
    }
}

App.propTypes = {
    repos: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {

    const githubOrg = config.github.org
    const {
        githubPullRequests,
        githubRepos,
        githubUsers
    } = state
    const { 
        isFetching: pullRequestsFetching = false,
        repos
    } = githubPullRequests[githubOrg] || {
        pullRequestsFetching: false,
        repos: {}
    }
    const {
        isFetching: reposFetching = true,
    } = githubRepos[githubOrg] || {
        reposFetching: true
    }

    const assignedToUsers = []
    let i
    const isFetching =  pullRequestsFetching || reposFetching ? true : false
    const openedByUsers = []
    let pullRequestCount = 0
    const reposWithPullRequests = []

    function cacheOpenedByUsers(pr) {

        // Cache opened by user(s)
        const openedBy = {
            avatar: pr.user.avatar_url,
            count: 1,
            name: pr.user.login
        }

        let existing = false
        let i = 0
        const len = openedByUsers.length

        for (i; i < len; i += 1) {
            if (openedByUsers[i].name === pr.user.login) {
                existing = true
                openedByUsers[i].count += 1
                break
            }
        }

        if (existing === false) {
            // Add user to opened by array
            openedByUsers.push(openedBy)
        }
    }

    function cacheAssignedToUsers(pr) {

        // Cache assinged to user(s)
        let assignedTo = {
            count: 1,
            name: 'Unassigned'
        }

        if (pr.assignee) {
            assignedTo = {
                avatar: pr.assignee.avatar_url,
                count: 1,
                name: pr.assignee.login
            }
        }

        let existing = false
        let i = 0
        const len = assignedToUsers.length

        for (i; i < len; i += 1) {

            if ((pr.assignee && assignedToUsers[i].name === pr.assignee.login) ||
                assignedToUsers[i].name === assignedTo.name) {
                existing = true
                assignedToUsers[i].count += 1
                break
            }
        }

        if (existing === false) {
            // Add user to assigned to array
            assignedToUsers.push(assignedTo)
        }
    }

    // Build repos with PRs array
    for (i in repos) {

        if (repos.hasOwnProperty(i)) {

            if (repos[i].length === 0) {
                continue
            }

            const prs = repos[i]
            const prsLen = prs.length

            // Count PR
            pullRequestCount += prsLen

            // Cache PR
            reposWithPullRequests.push(Object.assign({},
                {
                    name: i,
                    pullRequestCount: prsLen,
                    pullRequests: prs
                }
            ))

            prs.forEach(pr => {
                cacheOpenedByUsers(pr)
                cacheAssignedToUsers(pr)
            })
        }
    }

    return {
        assignedToUsers,
        isFetching,
        openedByUsers,
        pullRequestCount,
        repos,
        reposWithPullRequests
    }
}

export default connect(mapStateToProps)(App)
