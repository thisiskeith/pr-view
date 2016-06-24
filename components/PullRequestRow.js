import React, { PropTypes } from 'react'

const style = {
    image:  {
        margin: '0 auto',
        display: 'block',
        borderRadius: 20
    },
    tableCell: {
        display: 'table-cell',
        verticalAlign: 'middle'
    },
    warning: {
        width: 20,
        height: 20,
        backgroundColor: '#ffd532',
        borderRadius: 20,
        textAlign: 'center',
        margin: '0 auto',
        lineHeight: '20px'
    }
}

const PullRequestRow = ({
    assigneeAvatarUrl,
    assigneeName,
    openedByAvatarUrl,
    openedByName,
    title
}) => (
    <div style={{
        margin: 10,
        backgroundColor: 'white'
    }}>
        <div style={{
            padding: '0 20px 20px',
            border: '1px solid #ccc'
        }}>
            <h3>{title}</h3>
            <div style={{
                display: 'table',
                backgroundColor: 'white',
                borderBottom: '1px solid #ccc',
                borderCollapse: 'collapse',
                height: 30,
                width: '100%'
            }}>
                <div style={{
                    display: 'table-row'
                }}>
                    <div style={Object.assign({}, style.tableCell, {
                        width: 100,
                        color: '#777',
                        textTransform: 'uppercase',
                        fontSize: '14px'
                    })}>
                        Opened by
                    </div>
                    <div style={Object.assign({}, style.tableCell, {
                        width: 40
                    })}>
                         <img src={openedByAvatarUrl} style={style.image} width={20} />
                    </div>
                    <div style={style.tableCell}>
                        {openedByName}
                    </div>
                </div>
            </div> 
            <div style={{
                display: 'table',
                backgroundColor: 'white',
                borderBottom: '1px solid #ccc',
                borderCollapse: 'collapse',
                height: 30,
                width: '100%'
            }}>
                <div style={{
                    display: 'table-row'
                }}>
                    <div style={Object.assign({}, style.tableCell, {
                        width: 100,
                        color: '#777',
                        textTransform: 'uppercase',
                        fontSize: '14px'
                    })}>
                        Assigned to
                    </div>
                    <div style={Object.assign({}, style.tableCell, {
                        width: 40
                    })}>
                        {
                            assigneeAvatarUrl ? 
                                <img src={assigneeAvatarUrl} style={style.image} width={20} /> :
                                <div style={style.warning}>!</div>
                        }
                    </div>
                    <div style={style.tableCell}>
                        {
                            assigneeName ? assigneeName : 'unassigned'    
                        }
                    </div>
                </div>
            </div> 
        </div>
    </div>
)

PullRequestRow.propTypes = {
    assigneeAvatarUrl: PropTypes.string,
    assigneeName: PropTypes.string,
    openedByAvatarUrl: PropTypes.string.isRequired,
    openedByName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default PullRequestRow
