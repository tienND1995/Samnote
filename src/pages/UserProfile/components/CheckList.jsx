import React, { useState, useEffect } from 'react'

const Checklist = ({ data }) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(data)
    }, [data])

    return (
        <div className='checklist'>
            {items.map((item, index) => (
                <div key={`${item.content.trim().slice(0, 5)}${index}`}>
                    <input
                        style={{ marginRight: '5px' }}
                        type='checkbox'
                        checked={item.status}
                        readOnly
                    />
                    {item.content}
                </div>
            ))}
            {items.length > 3 && (
                <div className='font-bold'>
                    +{items.length - 3} item hidden
                </div>
            )}
        </div>
    )
}

export default Checklist