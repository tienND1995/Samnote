import React, { useState, useContext } from 'react'
import { Button, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { handleErrorAvatar, formatTimeAgo } from '../../../helper'
import { AppContext } from '../../../context'
import api from '../../../api'

const RightsideContent = ({ lastUsers, allNotePublic, setReload, userID }) => {
    const [payloadData, setPayloadData] = useState('')
    const appContext = useContext(AppContext)
    const { setSnackbar, user } = appContext
    const [visibleMoreUsers, setVisibleMoreUsers] = useState(7)
    const [visibleMoreNotes, setVisibleMoreNotes] = useState(7)

    const handleSeeMore = (setter) => () => {
        setter(prevVisible => prevVisible + 7);
    };

    const handleCreateNote = async () => {
        if (payloadData.trim() === '') {
            return
        }
        const payload = {
            type: 'text',
            data: payloadData,
            title: 'Quick notes',
            color: { r: 255, g: 255, b: 255, a: 1 },
            idFolder: null,
            dueAt: null,
            pinned: false,
            lock: '',
            remindAt: null,
            linkNoteShare: '',
            notePublic: 1,
        }

        console.log('payload', payload) // Check payload structure before sending

        try {
            await api.post(`/notes/${user.id}`, payload)
            setReload((prev) => prev + 1)
            setPayloadData('')
            setSnackbar({
                isOpen: true,
                message: 'Created new note successfully',
                severity: 'success',
            })
        } catch (err) {
            console.error(err)
            setSnackbar({
                isOpen: true,
                message: 'Failed to create note',
                severity: 'error',
            })
        }
    }

    return (
        <div className='rightside col-lg-4 flex flex-column mb-4'>
            <div className='quick-note-container w-[100%] h-[450px] bg-[#FFF4BA] rounded-xl p-4'>
                <div className='flex justify-between w-full'>
                    <h2 className='font-bold text-gray-700 text-3xl'>Quick Note</h2>
                    <Button
                        className={`btn-create-quickNotes ${user.id != userID ? 'text-white bg-blue-300' : ''}`}
                        disabled={user.id != userID}
                        onClick={handleCreateNote}
                    >
                        Create
                    </Button>
                </div>
                <TextField
                    className='quick-note-input p-2 w-full'
                    id='standard-multiline-static'
                    placeholder='Write your quick note here...'
                    multiline
                    rows={15}
                    variant='standard'
                    value={payloadData}
                    onChange={(event) => setPayloadData(event.target.value)}
                />
            </div>
            <div className='new-users w-full h-[450px] bg-[#fff] rounded-xl flex flex-col mt-3 py-3'>
                <span className='font-[700] text-[#888888] text-xl mb-3 ml-2'>New Users</span>
                {lastUsers.length > 0 ? (
                    <>
                        <ul className='w-full overflow-y-auto flex-grow'>
                            {lastUsers.slice(0, visibleMoreUsers).map(({ id, linkAvatar, user_name, createAt }) => (
                                <li key={`${id}`} className="mb-2">
                                    <Link
                                        to={`/profile/${id}`}
                                        className='w-full flex justify-around items-center my-1 link-dark text-decoration-none'
                                    >
                                        <img
                                            className='w-[40px] h-[40px] rounded-xl object-cover'
                                            src={linkAvatar || '/src/assets/avatar-default.png'}
                                            alt='avatar'
                                            onError={handleErrorAvatar}
                                        />
                                        <span className='truncate-text w-[40%]'>{user_name}</span>
                                        <span className='text-sm'>
                                            {createAt.split(' ').slice(1, 4).join(' ')}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {visibleMoreUsers < lastUsers.length && (
                            <button
                                onClick={handleSeeMore(setVisibleMoreUsers)}
                                className='text-center text-blue-500 hover:text-blue-700 cursor-pointer mt-2'
                            >
                                See more
                            </button>
                        )}
                    </>
                ) : (
                    <p className='text-center'>Not found new users</p>
                )}
            </div>
            <div className='new-notes w-full h-[450px] bg-[#fff] rounded-xl flex flex-col mt-3 py-3'>
                <span className='font-[700] text-[#888888] text-xl mb-[1.4rem] ml-2'>New Notes</span>
                {allNotePublic.length > 0 ? (
                    <>
                        <ul className='w-full overflow-y-auto flex-grow px-3'>
                            {allNotePublic.slice(0, visibleMoreNotes).map((item, index) => (
                                <li key={`notePublic ${index}`} className="mb-4">
                                    <div className='w-full flex justify-around items-center'>
                                        <span className='w-[20%] truncate-text'>
                                            {item.author}
                                        </span>
                                        <span className='w-[55%] break-words'>
                                            Create a new public note
                                        </span>
                                        <span className='text-xs w-[15%] whitespace-nowrap'>
                                            {formatTimeAgo(item.update_at)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {visibleMoreNotes < allNotePublic.length && (
                            <button
                                onClick={handleSeeMore(setVisibleMoreNotes)}
                                className='text-center text-blue-500 hover:text-blue-700 cursor-pointer mt-2'
                            >
                                See more
                            </button>
                        )}
                    </>
                ) : (
                    <p className='text-center'>Not found new notes</p>
                )}
            </div>
        </div >
    )
}

export default RightsideContent
