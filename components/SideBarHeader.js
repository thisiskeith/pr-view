import React, { PropTypes } from 'react'

const style = {
    height: 30,
    padding: '0 10px',
    lineHeight: '30px',
    backgroundColor: '#efefef',
    borderBottom: '1px solid #ccc',
    textTransform: 'uppercase'
}

const SidebarHeader = ({ label }) => <div style={style}>{label}</div>

SidebarHeader.propTypes = {
    label: PropTypes.string.isRequired
}

export default SidebarHeader
