import React, { useEffect, useRef, useState } from 'react'

import { ReactSketchCanvas } from 'react-sketch-canvas'

const SketchCanvas = ({ sketchCanvasRef, strokeColor, strokeWidth }) => {
 return (
  <div className='w-full'>
   <ReactSketchCanvas
    ref={sketchCanvasRef}
    style={{ border: 'none' }}
    strokeWidth={strokeWidth}
    strokeColor={strokeColor}
    eraserWidth={10}
   />
  </div>
 )
}

export default SketchCanvas
