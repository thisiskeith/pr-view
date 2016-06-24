import { combineReducers } from 'redux'
import {
    RECEIVE_PULL_REQUESTS,
    RECEIVE_REPOS,
    REQUEST_PULL_REQUESTS,
    REQUEST_REPOS
} from '../actions'

function pullRequests(state = {
    isFetching: false,
    repos: {}
}, action) {

    switch (action.type) {

    case RECEIVE_PULL_REQUESTS:

        // Return default when no PRs
        if (action.pullRequests.length === 0) {
            return state
        }

        const repos = Object.assign({}, state.repos, {
            [action.repo]: action.pullRequests
        })

        return Object.assign({}, state, {
            isFetching: false,
            lastUpdated: action.receivedAt,
            repos
        })

    case REQUEST_PULL_REQUESTS:
        return Object.assign({}, state, {
            isFetching: true
        })

    case REQUEST_REPOS:
        // Reset when repos are fetched
        return {
            isFetching: false,
            repos: {}
        }

    default:
        return state
    }
}

function repos(state = {
    isFetching: false,
    repos: []
}, action) {

    switch (action.type) {

    case RECEIVE_REPOS:
        return Object.assign({}, state, {
            isFetching: false,
            lastUpated: action.receivedAt,
            repos: action.repos
        })

    case REQUEST_REPOS:
        return Object.assign({}, state, {
            isFetching: true
        })

    default:
        return state
    }
}

function githubPullRequests(state = {}, action) {

    switch (action.type) {

    case RECEIVE_PULL_REQUESTS:
    case REQUEST_PULL_REQUESTS:
    case REQUEST_REPOS:
        return Object.assign({}, state, {
            [action.githubOrg]: pullRequests(state[action.githubOrg], action)
        })

    default:
        return state
    }
}

function githubRepos(state = {}, action) {

    switch (action.type) {

    case RECEIVE_REPOS:
    case REQUEST_REPOS:
        return Object.assign({}, state, {
            [action.githubOrg]: repos(state[action.githubOrg], action)
        })

    default:
        return state
    }
}

const rootReducer = combineReducers({
    githubPullRequests,
    githubRepos
})

export default rootReducer
