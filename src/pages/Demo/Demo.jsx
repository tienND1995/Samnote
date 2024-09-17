import React from 'react'
import './Demo.css'
const Demo = () => {
 return (
  <div className='container-fluid'>
   <form action=''>
    <div className='form'>
     <div>
      <div>
       <label>Type</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Lock</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Backgroud</label>

       <input type='text' className='form-control' />
      </div>
     </div>

     <div>
      <div>
       <label>Type</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Lock</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Backgroud</label>

       <input type='text' className='form-control' />
      </div>
     </div>

     <div>
      <div className='flex flex-col h-full justify-between'>
       <div>
        <label>Type</label>
        <input type='date' className='form-control' />
       </div>

       <div>
        <button type='submit' className='btn btn-primary'>save</button>
       </div>
      </div>
     </div>
    </div>
   </form>
  </div>
 )
}

export default Demo
