import config from '../config'
import fetch from 'isomorphic-fetch'

// Config check
if (config.github.username.trim() === '' || config.github.token.trim() === '') {
    throw new Error('GitHub configuration missing')
}

const githubAuthHeader = {
    'Authorization': 'Basic ' + btoa(
        `${config.github.username}:${config.github.token}`
    )
}
const githubAPIPreviewHeader = {
    'Accept': 'application/vnd.github.cerberus-preview' 
}

export const RECEIVE_PULL_REQUEST_LABELS = 'RECEIVE_PULL_REQUEST_LABELS'
export const RECEIVE_PULL_REQUESTS = 'RECEIVE_PULL_REQUESTS'
export const RECEIVE_REPOS = 'RECEIVE_REPOS'
export const REQUEST_PULL_REQUEST_LABELS = 'REQUEST_PULL_REQUEST_LABELS'
export const REQUEST_PULL_REQUESTS = 'REQUEST_PULL_REQUESTS'
export const REQUEST_REPOS = 'REQUEST_REPOS'

function receivePullRequestLabels(githubOrg, repo, prNumber, json) {
    return {
        type: RECEIVE_PULL_REQUEST_LABELS,
        githubOrg,
        labels: json,
        prNumber,
        receivedAt: Date.now(),
        repo
    }
}

function receivePullRequests(githubOrg, repo, json) {
    return {
        type: RECEIVE_PULL_REQUESTS,
        githubOrg,
        pullRequests: json,
        receivedAt: Date.now(),
        repo
    }
}

function receiveRepos(githubOrg, json) {
    return {
        type: RECEIVE_REPOS,
        githubOrg,
        repos: json,
        receivedAt: Date.now()
    }
}

function requestPullRequestLabels(githubOrg, repo, prNumber) {
    return {
        type: REQUEST_PULL_REQUEST_LABELS,
        githubOrg,
        repo,
        prNumber
    }
}

function requestPullRequests(githubOrg, repo) {
    return {
        type: REQUEST_PULL_REQUESTS,
        githubOrg,
        repo
    }
}

function requestRepos(githubOrg) {
    return {
        type: REQUEST_REPOS,
        githubOrg
    }
}

// Thunk async action creators
export function fetchPullRequestLabels(githubOrg, repo, prNumber) {

    return function (dispatch) {

        dispatch(requestPullRequestLabels(githubOrg, repo, prNumber))

        return fetch(`https://api.github.com/repos/${githubOrg}/${repo}/issues/${prNumber}/labels`, {
                headers: githubAuthHeader
            })
            .then(response => response.json())
            .then(json => dispatch(
                receivePullRequestLabels(githubOrg, repo, prNumber, json)
            ))
            .catch(err => console.error(err))
    }
}

export function fetchPullRequests(githubOrg, repo) {

    return function (dispatch) {

        dispatch(requestPullRequests(githubOrg, repo))

        return fetch(`https://api.github.com/repos/${githubOrg}/${repo}/pulls`, {
                headers: Object.assign(
                    githubAuthHeader, 
                    githubAPIPreviewHeader
                )
            })
            .then(response => response.json())
            .then(json => {
                
                dispatch(receivePullRequests(githubOrg, repo, json))

                // Fetch pr labels
                if (json.length > 0) {
                    json.forEach(pr => dispatch(
                        fetchPullRequestLabels(githubOrg, repo, pr.number)
                    ))
                }
            })
            .catch(err => console.error(err))
    }
}

export function fetchRepos(githubOrg) {

    return function (dispatch) {

        dispatch(requestRepos(githubOrg))

        return fetch(`https://api.github.com/orgs/${githubOrg}/repos?per_page=100`, {
                headers: githubAuthHeader
            })
            .then(response => response.json())
            .then(json => {

                dispatch(receiveRepos(githubOrg, json))

                // Fetch pull requests for each repo
                json.forEach(repo => dispatch(fetchPullRequests(githubOrg, repo.name)))
            })
            .catch(err => console.error(err))
    }
}
