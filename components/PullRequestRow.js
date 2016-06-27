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
    labels,
    openedByAvatarUrl,
    openedByName,
    title
}) => (
    <div style={{
        backgroundColor: 'white'
    }}>
        <div style={{
            padding: '0 20px 10px',
            border: '1px solid #efefef',
            borderTop: 'none'
        }}>
            <h3 style={{
                display: 'inline-block',
                margin: '10px 0'
            }}>
                {title}
            </h3>
            {
                labels.length > 0 ?
                    labels.map((label, i) => <span 
                        key={i}
                        style={{
                            backgroundColor: `#${label.color}`,
                            textTransform: 'uppercase',
                            fontSize: '0.8em',
                            display: 'inline-block',
                            marginLeft: 5,
                            padding: '2px 5px',
                            color: 'white'
                        }}>
                            {label.name}
                        </span>
                    )
                    : null
            }
            <div style={{
                display: 'table',
                backgroundColor: 'white',
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
                    <div style={Object.assign({}, style.tableCell, {
                        width: 200
                    })}>
                        {openedByName}
                    </div>
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
    labels: PropTypes.array,
    openedByAvatarUrl: PropTypes.string.isRequired,
    openedByName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default PullRequestRow
