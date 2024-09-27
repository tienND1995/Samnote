import React, { useState, useEffect } from 'react'

const Checklist = ({ data }) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(data)
    }, [data])

    return (
        <div>
            {items.map((item, index) => (
                <div key={index}>
                    <input
                        style={{ marginRight: '5px' }}
                        type='checkbox'
                        checked={item.status}
                    />
                    {item.content}
                </div>
            ))}
        </div>
    )
}

export default Checklist