import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context'
import api from '../../api'
import { Box } from '@mui/material'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'swiper/css'
import './UserProfile.css'
import Loading from '../../share/Loading'

import {
    UserIntro,
    LeftsideContent,
    RightsideContent,
    Footer,
} from './components'

const UserProfile = () => {
    const appContext = useContext(AppContext)
    const { user } = appContext
    const [userInfomations, setUserInformations] = useState(null)

    //data note
    const [userNotes, setUserNotes] = useState([])

    const [reload, setReload] = useState(0)

    const params = useParams()
    const userID = params.id

    const getUserInformation = async (userID) => {
        try {
            const res = await api.get(
                `https://samnote.mangasocial.online/profile/${userID}`
            )
            setUserInformations(res.data.user)
            setUserNotes(res.data.note)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUserInformation(userID)
    }, [userID, reload])

    return (
        userInfomations ? (
            <Box className='w-full bg-[#4A4B51] h-auto overflow-y-auto'>
                <Box className='w-full bg-[#4A4B51] h-auto'>
                    <>
                        <UserIntro
                            userInfomations={userInfomations}
                            user={user}
                        />
                        <div className='container-content w-[98%] flex flex-col lg:flex-row justify-between m-auto'>
                            <LeftsideContent
                                userInfomations={userInfomations}
                                setReload={setReload}
                            />
                            <RightsideContent
                                userInfomations={userInfomations}
                                setReload={setReload}
                            />
                        </div>
                        <Footer />
                    </>
                </Box>
            </Box>
        ) : (
            <Loading />
        )
    )
}

export default UserProfile
