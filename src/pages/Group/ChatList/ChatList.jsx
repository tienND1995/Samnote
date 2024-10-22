import { useRef, useState } from 'react'
import './ChatList.css'

import GroupAddIcon from '@mui/icons-material/GroupAdd'
import SearchIcon from '@mui/icons-material/Search'

import ChatListComponent from './components/ChatListComponent'
import ChatListGroup from './components/ChatListGroup'
import ChatListUser from './components/ChatListUser'

import ModalSearchUserChat from './components/ModalSearchUserChat'
import CreateGroup from '../../../share/CreateGroup'

const ChatList = (props) => {
 const {
  userID,
  typeFilterChat,
  onChangeTypeFilter,

  allMessageList,
  getAllMessageList,
 } = props.data

 const chatListRef = useRef()

 const [showModalSearch, setShowModalSearch] = useState(false)

 // * handle filter message
 const handleTypeFilterChat = (e) => {
  const type = e.target.innerHTML
  if (type === typeFilterChat) return

  window.localStorage.setItem('typeFilterChat', type)
  onChangeTypeFilter(type)
 }

 // *********** handle create group
 const [showModalCreateGroup, setShowModalCreateGroup] = useState(false)

 const handleShowModalCreateGroup = () => {
  setShowModalCreateGroup(true)
 }

 return (
  <div
   style={{ boxShadow: '4px -4px 10px 0px #00000040' }}
   className=' bg-[#dffffe] flex flex-col flex-grow-1 px-[12px] xl:px-[20px]'
  >
   <CreateGroup
    onGetAllMessageList={getAllMessageList}
    showModal={showModalCreateGroup}
    setShowModal={setShowModalCreateGroup}
   />

   <ModalSearchUserChat
    setShowModalSearch={setShowModalSearch}
    showModalSearch={showModalSearch}
   />

   <div className='flex my-[15px] xl:my-[20px] justify-between gap-2'>
    <div className='flex justify-between gap-2 w-full'>
     <button
      onClick={() => setShowModalSearch(true)}
      type='button'
      className='flex w-full gap-2 items-center bg-white p-2 rounded-5 text-[#686464CC]'
     >
      <SearchIcon />
      Search user
     </button>

     <button
      type='button'
      className=''
      title='add group'
      onClick={handleShowModalCreateGroup}
     >
      <GroupAddIcon className='text-[36px]' />
     </button>
    </div>
   </div>

   <div className='flex flex-col flex-grow-1'>
    <ul className='flex justify-between group-buttons mb-4'>
     <li>
      <button
       onClick={handleTypeFilterChat}
       className={typeFilterChat === 'All' && 'active'}
       type='button'
      >
       All
      </button>
     </li>

     <li>
      <button
       className={typeFilterChat === 'Unread' && 'active'}
       onClick={handleTypeFilterChat}
       type='button'
      >
       Unread
      </button>
     </li>

     <li>
      <button
       className={typeFilterChat === 'Read' && 'active'}
       onClick={handleTypeFilterChat}
       type='button'
      >
       Read
      </button>
     </li>
    </ul>

    <ul
     id='list-chat'
     className='flex flex-col flex-grow-1 h-[50vh] style-scrollbar-y style-scrollbar-y-sm gap-4 overflow-y-auto overflow-x-hidden list-chat mb-3'
     ref={chatListRef}
    >
     <ChatListComponent
      data={allMessageList}
      renderItem={(message) =>
       message.type_chat === '1chat1' ? (
        <ChatListUser
         key={message.idMessage}
         message={message}
         onGetAllMessageList={getAllMessageList}
         userID={userID}
        />
       ) : (
        <ChatListGroup
         key={message.idGroup}
         message={message}
         onGetAllMessageList={getAllMessageList}
         userID={userID}
        />
       )
      }
     />
    </ul>
   </div>
  </div>
 )
}

export default ChatList
