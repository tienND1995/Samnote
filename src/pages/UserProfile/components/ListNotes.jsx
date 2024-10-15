import React, { useState, useEffect, useContext } from 'react'
import { Box, Typography, Tab, Avatar } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Checklist from './CheckList'
import { Swiper, SwiperSlide } from 'swiper/react'
import { handleErrorAvatar, convertApiToTime, isLightColor } from '../../../utils/utils'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../../context'

const ListNotes = (
    {
        typeNotes,
        dataNotes,
        userInfomations,
        handleDeleteNote,
        handleShowComments,
        handleLikeNote,
    }
) => {
    const [tabValue, setTabValue] = useState('1')
    const appContext = useContext(AppContext)
    const { user } = appContext
    const navigate = useNavigate()

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    return (
        <Box className='flex-[4] w-full'>
            <TabContext value={tabValue}>
                <div className='header-tabContent rounded-xl overflow-hidden mb-1'>
                    <div
                        className='title'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 10px 0 10px',
                            backgroundColor: '#fff',
                        }}
                    >
                        <Box component='h4' className='font-bold text-2xl mx-2'>
                            <span className='text-capitalize'>{typeNotes}</span>
                            <span> notes</span>
                        </Box>
                        <MoreHorizIcon sx={{ cursor: 'pointer', color: 'text.main' }} />
                    </div>
                    <div
                        className='selected-tab'
                        style={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            marginBottom: '6px',
                            backgroundColor: '#fff',
                            width: '100%',
                        }}
                    >
                        <TabList
                            onChange={handleTabChange}
                            aria-label='lab API tabs example'
                        >
                            <Tab label='Recent' value='1' />
                            <Tab label='Recommended' value='2' />
                        </TabList>
                    </div>
                </div>

                <TabPanel value='1' className='w-full p-0'>
                    {dataNotes.length > 0 ? (
                        <Swiper
                            spaceBetween={16}
                            slidesPerView='auto'
                            navigation={{
                                prevEl: '.swiper-button-prev',
                                nextEl: '.swiper-button-next',
                            }}
                            className='swiper-privateNotes overflow-x-auto'
                        >
                            {dataNotes.map((info) => (
                                <SwiperSlide
                                    key={info.idNote}
                                    className={`relative pb-3 border-[1px] rounded-xl border-black border-solid mb-2 min-w-[22rem]
                                                ${isLightColor(info.color) ? 'text-black' : 'text-white'}
                                                ${dataNotes.length === 1 ? 'w-full' : dataNotes.length === 2 ? `w-[49%]` : 'w-[22rem]'}`}
                                    style={{
                                        backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            margin: '10px 20px 0 20px',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: ' 10px 0',
                                            }}
                                        >
                                            <Avatar
                                                style={{
                                                    height: '45px',
                                                    width: '45px',
                                                    marginRight: '10px',
                                                    objectFit: 'cover',
                                                }}
                                                src={
                                                    userInfomations.Avarta
                                                        ? userInfomations.Avarta
                                                        : '/src/assets/avatar-default.png'
                                                }
                                                alt='avatar-user'
                                                onError={handleErrorAvatar}
                                            />
                                            <Box sx={{ color: 'text.main' }}>
                                                <p className='text-capitalize max-w-[150px] truncate-text' style={{ margin: 0, fontSize: '1.2rem' }}>
                                                    <strong>{userInfomations.name}</strong>
                                                </p>
                                                <p style={{ margin: 0, opacity: '0.8' }}>
                                                    Create at {convertApiToTime(info.createAt)}
                                                </p>
                                            </Box>
                                        </div>
                                        <div className='actions-note flex items-center gap-2'>
                                            <svg
                                                className='shareNote cursor-pointer opacity-70 hover:opacity-100'
                                                width='24'
                                                height='24'
                                                fill={isLightColor(info.color) ? 'black' : 'white'}
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 512 512'
                                            >
                                                <path d='M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z' />
                                            </svg>
                                            <svg
                                                className='deleteNote cursor-pointer opacity-70 hover:opacity-100'
                                                width='2.4rem'
                                                height='2.4rem'
                                                viewBox='0 0 48 48'
                                                fill={isLightColor(info.color) ? 'black' : 'white'}
                                                xmlns='http://www.w3.org/2000/svg'
                                                onClick={() => handleDeleteNote(info.idNote)}
                                            >
                                                <path d='M32.38 4.5H15.62C8.34 4.5 4 8.84 4 16.12V32.86C4 40.16 8.34 44.5 15.62 44.5H32.36C39.64 44.5 43.98 40.16 43.98 32.88V16.12C44 8.84 39.66 4.5 32.38 4.5ZM31.52 32.02C31.4 33.72 31.26 35.84 27.42 35.84H20.58C16.76 35.84 16.6 33.72 16.48 32.02L15.86 24.1C15.8411 23.8463 15.8739 23.5914 15.9564 23.3508C16.0389 23.1101 16.1694 22.8887 16.34 22.7C16.5104 22.5151 16.7177 22.3679 16.9485 22.268C17.1793 22.1681 17.4285 22.1177 17.68 22.12H30.32C30.82 22.12 31.32 22.34 31.66 22.7C32 23.08 32.18 23.58 32.14 24.08L31.52 32.02ZM33.6 20.14H33.48C31.4 19.94 29.5 19.8 27.68 19.72C25.2355 19.5899 22.7863 19.5699 20.34 19.66C19.14 19.72 17.92 19.8 16.72 19.92L14.54 20.14H14.4C13.7 20.14 13.1 19.62 13.04 18.9C12.96 18.16 13.52 17.48 14.26 17.42L16.44 17.2C17.3 17.12 18.14 17.06 19 17.02L19.16 16.08C19.32 15.08 19.62 13.16 22.62 13.16H25.4C28.42 13.16 28.72 15.14 28.86 16.1L29.02 17.06C30.52 17.14 32.06 17.26 33.74 17.42C34.5 17.5 35.04 18.16 34.98 18.92C34.9 19.62 34.3 20.14 33.6 20.14Z' />
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        className={`h-[10rem] overflow-hidden px-4 py-2 rounded-lg
                                                    ${user.id === userInfomations.id ? 'cursor-pointer hover:bg-opacity-20 hover:bg-gray-500 transition-colors duration-200' : ''}`}
                                        onClick={() => user.id === userInfomations.id && navigate(`/editnote/${info.idNote}`)}
                                    >
                                        <strong style={{ fontSize: '20px' }}>{info.title}</strong>
                                        {info.type.toLowerCase() === 'checklist' ? (
                                            <Checklist data={info.data.slice(0, 3)} />
                                        ) : (
                                            <div className='text-start truncate-text'>
                                                {<Markdown rehypePlugins={[rehypeRaw]}>{info.data}</Markdown>}
                                            </div>
                                        )}
                                    </div>
                                    <div className='time-edit'>
                                        <p className='text-end mt-2 mr-3 opacity-80'>
                                            Last edit at {convertApiToTime(info.updateAt)}
                                        </p>
                                    </div>
                                    <div className='interacted-note flex justify-end items-center gap-3 pr-3 mt-2'>
                                        <div className='like flex items-center gap-1 cursor-pointer'
                                            onClick={() => handleLikeNote(info.idNote, 'like')}
                                        >
                                            <svg
                                                width='1rem'
                                                height='1rem'
                                                fill={isLightColor(info.color) ? 'black' : 'white'}
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 512 512'
                                            >
                                                <path d='M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z' />
                                            </svg>
                                            <span>{info.like_count}</span>
                                        </div>
                                        <div className='dislike flex items-center gap-1 cursor-pointer'
                                            onClick={() => handleLikeNote(info.idNote, 'dislike')}
                                        >
                                            <svg
                                                width='1rem'
                                                height='1rem'
                                                fill={isLightColor(info.color) ? 'black' : 'white'}
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 512 512'
                                            >
                                                <path d='M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16l-97.5 0c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8L384 32c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32L0 128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0z' />
                                            </svg>
                                            <span>{info.dislike_count}</span>
                                        </div>
                                        <div
                                            className='comment flex items-center gap-1 cursor-pointer'
                                            onClick={() => handleShowComments(info)}
                                        >
                                            <svg
                                                width='1rem'
                                                height='1rem'
                                                fill={isLightColor(info.color) ? 'black' : 'white'}
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 512 512'
                                            >
                                                <path d='M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z' />
                                            </svg>
                                            <span>{info.comment_count}</span>
                                        </div>
                                    </div>
                                    {typeNotes === 'pinned' &&
                                        <div className='pin-icon absolute left-[50%] top-[0.2rem]'>
                                            <img
                                                className='w-[1.8rem] h-[2.5rem]'
                                                src='/src/assets/pin-icon.png'
                                                alt='pin-icon'
                                            />
                                        </div>
                                    }
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Box className='bg-white p-4 rounded-lg'>
                            <Typography variant='h5' className='font-semibold text-center'>
                                No notes to show
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value='2' sx={{ width: '100%', padding: 0 }}>
                    <Box className='bg-white p-4 rounded-lg'>
                        <Typography variant='h5' className='font-semibold text-center'>
                            No recommended notes to show
                        </Typography>
                    </Box>
                </TabPanel>
            </TabContext >
        </Box >
    )
}

export default ListNotes
