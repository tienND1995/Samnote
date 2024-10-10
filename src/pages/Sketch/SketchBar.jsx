import { useState } from 'react'

import Undo from '../../assets/svgs/Undo'
import Redo from '../../assets/svgs/Redo'
import penCanvas from '../../assets/pen.png'
import BackspaceIcon from '@mui/icons-material/Backspace'
import Eraser from '../../assets/svgs/Eraser'

import { COLOR_LIST } from '../../utils/constant'

const SketchBar = ({
 sketchCanvasRef,
 strokeColor,
 strokeWidth,
 onChangeColorCanvas,
 onChangeStrokeWidth,
}) => {
 const [eraseMode, setEraseMode] = useState(false)

 const handleEraserClick = () => {
  setEraseMode(true)
  sketchCanvasRef.current?.eraseMode(true)
 }

 const handlePenClick = () => {
  setEraseMode(false)
  sketchCanvasRef.current?.eraseMode(false)
 }

 const handleUndoClick = () => {
  sketchCanvasRef.current?.undo()
 }

 const handleRedoClick = () => {
  sketchCanvasRef.current?.redo()
 }

 const handleClearClick = () => {
  sketchCanvasRef.current?.clearCanvas()
 }

 return (
  <div className='max-w-[200px] flex flex-col flex-grow-1 bg-[#618EA9] px-2 overflow-y-auto aspect-[1/2]'>
   <div className='px-2 flex flex-col gap-2 mb-3'>
    <div className='flex justify-between'>
     <button onClick={handleUndoClick} type='button'>
      <Undo />
     </button>

     <button onClick={handleRedoClick} type='button'>
      <Redo />
     </button>
    </div>

    <div className='flex justify-between'>
     <button type='button' disabled={!eraseMode} onClick={handlePenClick}>
      <img
       className={!eraseMode ? 'border border-white rounded-xl' : ''}
       src={penCanvas}
       alt='pen canvas'
      />
     </button>

     <div className='flex flex-col gap-2'>
      <button
       onClick={() => onChangeStrokeWidth(1)}
       className={`w-[40px] h-[30px] ${
        strokeWidth === 1 ? 'bg-white text-black' : 'bg-black text-white'
       }`}
      >
       X1
      </button>
      <button
       onClick={() => onChangeStrokeWidth(2)}
       className={`w-[40px] h-[30px] ${
        strokeWidth === 2 ? 'bg-white text-black' : 'bg-black text-white'
       }`}
      >
       X2
      </button>
      <button
       onClick={() => onChangeStrokeWidth(4)}
       className={`w-[40px] h-[30px] ${
        strokeWidth === 4 ? 'bg-white text-black' : 'bg-black text-white'
       }`}
      >
       X4
      </button>
     </div>
    </div>

    <div className='flex justify-between'>
     <button
      className={eraseMode ? 'border border-white rounded-xl' : ''}
      onClick={handleEraserClick}
      disabled={eraseMode}
      type='button'
     >
      <Eraser />
     </button>
     <button
      className='text-red-500 ease-in-out duration-100 hover:text-red-700'
      onClick={handleClearClick}
      type='button'
     >
      <BackspaceIcon className='text-5xl' />
     </button>
    </div>
   </div>

   <ul className='flex flex-wrap gap-2 justify-center '>
    {COLOR_LIST?.map((color) => (
     <li key={color}>
      <button
       onClick={() => onChangeColorCanvas(color)}
       type='button'
       style={{ backgroundColor: color }}
       className={`size-[30px] rounded-full border-solid border-white flex ${
        strokeColor === color ? 'border-4' : 'border'
       }`}
      ></button>
     </li>
    ))}
   </ul>
  </div>
 )
}

export default SketchBar
