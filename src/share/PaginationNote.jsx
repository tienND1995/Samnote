import { ConfigProvider, Pagination } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'

import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'

const PaginationNote = ({ pageSize, totalItem, pathName }) => {
 const itemRender = (page, type, originalElement) => {
  if (type === 'next') {
   return (
    <a className='text-white'>
     <SkipNextIcon />
    </a>
   )
  } else if (type === 'prev') {
   return (
    <a className='text-white'>
     <SkipPreviousIcon />
    </a>
   )
  }

  return originalElement
 }

 const navigate = useNavigate()
 const [searchParams, setSearchParams] = useSearchParams()
 const pageParams = Number.parseInt(searchParams.get('page'))

 return (
  <ConfigProvider
   theme={{
    components: {
     Pagination: {
      itemActiveBg: 'lightgreen',
     },
    },
   }}
  >
   <div>
    <Pagination
     align='center'
     total={totalItem}
     pageSize={pageSize}
     current={pageParams}
     showSizeChanger={false}
     showLessItems
     hideOnSinglePage
     itemRender={itemRender}
     onChange={(page) => {
      setSearchParams({ page: `${page}` })
      navigate(`${pathName}?page=${page}`)
     }}
    />
   </div>
  </ConfigProvider>
 )
}

export default PaginationNote
