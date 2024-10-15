import React from 'react'

const Demo = ({count}) => {
 console.log('re-render')
 return <div>Demo</div>
}

export default React.memo(Demo)
