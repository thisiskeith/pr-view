import React, { PropTypes } from 'react'

const style = {
    image:  {
        margin: '0 auto',
        display: 'block'
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
        margin: '0 auto'
    }
}

const SidebarRow = ({
    count,
    icon,
    label
}) => (
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
                width: 40,
                textAlign: 'right'
            })}>
                {count}
            </div>
            <div style={Object.assign({}, style.tableCell, {
                width: 40
            })}>
                {
                    icon ?
                        <img 
                            src={icon} 
                            style={style.image} 
                            width={20} 
                            height={20} 
                        /> :
                        <div style={style.warning}>!</div>
                }
            </div>
            <div style={style.tableCell}>
                {label}
            </div>
        </div>
    </div> 
)

SidebarRow.propTypes = {
    count: PropTypes.number.isRequired,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired
}

export default SidebarRow
