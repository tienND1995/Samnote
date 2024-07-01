import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import "./index.css";
import UserOnlineHideMessage from "../UserHIdeMessage"
import SendMessageBox from "../ClientSendMessage"
import { comment } from "postcss";
import SendMessageBoxUser from "../UserSendMessage";
import axios from "axios";
import { useEffect, useMemo , useCallback } from "react";

function HideMessage() {

    const myId = 1;

    const [messages , setMessages] = useState([]);

    const [newMessage , setNewMessage] = useState("");
    
    const UserOnline1 = [{
        ImgUrl: '../public/backgrdImg.jpg'
        , name: 'User Name'
    }]

    const UserOnline2 = [{
        ImgUrl: '../public/backgrdImg.jpg'
        , comment: 'User Name1'
    }]


    const listOfMessageElements = useMemo (
        ()=> messages.map(
            
            (message, index) => {
                const isMyMessage = message.id === myId;

                const element = [
                    {
                        ImgUrl: message.avatar,
                        comment: message.content
                    }
                ]

                if(isMyMessage){
                    return(
                        <SendMessageBox element={element}></SendMessageBox>
                    )
                } else{
                    return (
                        <SendMessageBoxUser element={element}></SendMessageBoxUser>
                    )
                }
            }
    ),[messages])

    const getHideMessage = useCallback( () => {
        const doSmth = async ()=>{
            try {
                const res = await axios.get(
                    `https://samnote.mangasocial.online/message/chat-unknown/${myId}`
                );
                console.log(res.data)
                setMessages(res.data.data)
            } catch (err) {
                console.log(err);
            }
        }
        doSmth()
        
    },[ setMessages, myId ])

    const createMessage = useCallback( () => {
        const doSmth = async ()=>{
            try {
                const res = await axios.post(
                    `https://samnote.mangasocial.online/message/chat-unknown/${myId}`,
                    {
                        "sendAt": "01/03/2024 10:15 AM +07:00",
                        "idReceive": "15",
                        "content": newMessage,
                        "idSend": myId

                    }
                );
                console.log(res.data)
                setNewMessage("")
                getHideMessage()
            } catch (err) {
                console.log(err);
            }
        }
        doSmth()
    },[ myId, setNewMessage, getHideMessage , newMessage ])


    useEffect(
        () => {
        getHideMessage()
    },
    []
)

 
    return (
        <div className="allPageHideMessage">
            <div style={{}} className="mainLeftHideMessenger" >
                <div className="MainHeaderHIdeMessage">
                    <div className="headerMainLeftHideMessage">
                        <Box>
                            <img src="https://s3-alpha-sig.figma.com/img/63af/ccc4/e1c5389d30e187dbe8d17be91f4c5937?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iKZDo~GuUtm9f8nrc8fKtMboqqx4mYZEWBxWOJNxSmigTdliWFL584iUnfm5NVZuLXTHsogtROlo89GJycd8SNSfbV4EGpQHij6hFXVCw6FYmo5WkkUuAbmONWJF3ADXQdHw642hwJ748MSFuCx~uyxX5FXnToAsP03Zkl7iInUkUt2FtBIVtIXTxwPhzr5uDJFDN6lF1GPNZRf57IqT9b2GezaOfcn4AcLIooueOhECzxIvbtTvpFOr8-DPBaFlFXPFdTh1k7PWOJFDPoBrDGDv-i-typ2FECSilX2k~3AA-hKx-VsnhQMWYI-uiXB-9sU9oitfNrHl4Kqa-6K6ag__" style={{ width: '100px' }}></img>
                        </Box>
                        <Typography variant="h5" style={{ color: 'white' }}>Anonymous</Typography>
                    </div>
                    <div className="headerMainRightHideMessage">
                        <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                            <path d="M30.9872 14.8586C28.1968 14.8586 27.0559 12.8852 28.4434 10.4648C29.2451 9.06191 28.7672 7.27358 27.3643 6.47191L24.6972 4.94566C23.4793 4.22108 21.9068 4.65275 21.1822 5.87066L21.0126 6.16358C19.6251 8.584 17.3434 8.584 15.9405 6.16358L15.7709 5.87066C15.6047 5.57926 15.3822 5.32382 15.1164 5.1192C14.8506 4.91458 14.5467 4.76488 14.2225 4.6788C13.8982 4.59272 13.5601 4.57199 13.2278 4.6178C12.8955 4.66362 12.5756 4.77506 12.2868 4.94566L9.61967 6.47191C8.21676 7.27358 7.73884 9.07733 8.54051 10.4802C9.94342 12.8852 8.80259 14.8586 6.01217 14.8586C4.40884 14.8586 3.08301 16.169 3.08301 17.7877V20.5011C3.08301 22.1044 4.39342 23.4302 6.01217 23.4302C8.80259 23.4302 9.94342 25.4036 8.54051 27.824C7.73884 29.2269 8.21676 31.0152 9.61967 31.8169L12.2868 33.3432C13.5047 34.0677 15.0772 33.6361 15.8018 32.4182L15.9713 32.1252C17.3588 29.7048 19.6405 29.7048 21.0434 32.1252L21.213 32.4182C21.9376 33.6361 23.5101 34.0677 24.728 33.3432L27.3951 31.8169C28.798 31.0152 29.2759 29.2115 28.4743 27.824C27.0713 25.4036 28.2122 23.4302 31.0026 23.4302C32.6059 23.4302 33.9318 22.1198 33.9318 20.5011V17.7877C33.9237 17.0107 33.6104 16.268 33.0595 15.72C32.5085 15.172 31.7642 14.8626 30.9872 14.8586ZM18.4997 24.1548C15.7401 24.1548 13.4893 21.904 13.4893 19.1444C13.4893 16.3848 15.7401 14.134 18.4997 14.134C21.2593 14.134 23.5101 16.3848 23.5101 19.1444C23.5101 21.904 21.2593 24.1548 18.4997 24.1548Z" fill="white" />
                        </svg>
                    </div>
                </div>
                <div className="searchMainLeft">
                    <div className="backgrdSearch">
                        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '3%' }}>
                            <path d="M11.5 19.2856C15.9183 19.2856 19.5 15.7039 19.5 11.2856C19.5 6.86737 15.9183 3.28564 11.5 3.28564C7.08172 3.28564 3.5 6.86737 3.5 11.2856C3.5 15.7039 7.08172 19.2856 11.5 19.2856Z" stroke="#65676B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M21.5004 21.2855L17.1504 16.9355" stroke="#65676B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <input placeholder="Search User" style={{ width: '50%', height: '100%', backgroundColor: '#DADADA', border: 'none', outline: 'none', fontSize: '20px', marginLeft: '5%' }}></input>
                    </div>
                </div>
                <div className="centerMainLeftHideMessage">
                    <div className="backgrdCenterMainLeftHideMessage">
                        <div className="backgrdCenterMainLeftHideMessageSubject">
                            <Box>
                                <img src="https://s3-alpha-sig.figma.com/img/63af/ccc4/e1c5389d30e187dbe8d17be91f4c5937?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iKZDo~GuUtm9f8nrc8fKtMboqqx4mYZEWBxWOJNxSmigTdliWFL584iUnfm5NVZuLXTHsogtROlo89GJycd8SNSfbV4EGpQHij6hFXVCw6FYmo5WkkUuAbmONWJF3ADXQdHw642hwJ748MSFuCx~uyxX5FXnToAsP03Zkl7iInUkUt2FtBIVtIXTxwPhzr5uDJFDN6lF1GPNZRf57IqT9b2GezaOfcn4AcLIooueOhECzxIvbtTvpFOr8-DPBaFlFXPFdTh1k7PWOJFDPoBrDGDv-i-typ2FECSilX2k~3AA-hKx-VsnhQMWYI-uiXB-9sU9oitfNrHl4Kqa-6K6ag__" style={{ width: '70px' }}></img>
                            </Box>
                            <Typography variant="h6" style={{ color: 'white' }}>Anonymous</Typography>
                        </div>
                        <div className="backgrdCenterMainLeftHideMessageMessage">
                            <p>You now in anonymous mode. You can chat with others anonymously</p>

                        </div>
                        <div className="btnCenterMainLeftHideMessage">
                            <button>Quit</button>
                        </div>
                    </div>
                </div>
                <div className="onlineUserHideMessage">
                    <div className="backgrdOnlineUserHideMessage">
                        <div className="headerBackgrdOnlineUserHideMessage">
                            <h5>Online User</h5>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.9997 17.6776C16.713 17.6776 17.2913 17.0993 17.2913 16.3859C17.2913 15.6725 16.713 15.0942 15.9997 15.0942C15.2863 15.0942 14.708 15.6725 14.708 16.3859C14.708 17.0993 15.2863 17.6776 15.9997 17.6776Z" stroke="white" stroke-width="2.58333" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M25.0417 17.6776C25.755 17.6776 26.3333 17.0993 26.3333 16.3859C26.3333 15.6725 25.755 15.0942 25.0417 15.0942C24.3283 15.0942 23.75 15.6725 23.75 16.3859C23.75 17.0993 24.3283 17.6776 25.0417 17.6776Z" stroke="white" stroke-width="2.58333" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.95866 17.6776C7.67203 17.6776 8.25033 17.0993 8.25033 16.3859C8.25033 15.6725 7.67203 15.0942 6.95866 15.0942C6.24529 15.0942 5.66699 15.6725 5.66699 16.3859C5.66699 17.0993 6.24529 17.6776 6.95866 17.6776Z" stroke="white" stroke-width="2.58333" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>
                        <div className="allUserOnHiMessage">
                            <UserOnlineHideMessage Information={UserOnline1}></UserOnlineHideMessage>
                            <UserOnlineHideMessage Information={UserOnline1}></UserOnlineHideMessage>
                            <UserOnlineHideMessage Information={UserOnline1}></UserOnlineHideMessage>
                            <UserOnlineHideMessage Information={UserOnline1}></UserOnlineHideMessage>
                            <UserOnlineHideMessage Information={UserOnline1}></UserOnlineHideMessage>

                        </div>
                    </div>
                </div>
            </div>
            <div className="mainRightHideMessage" >
                <div className="onlineUserHideMessageMainRight">
                    <div className="avatarOnlineClientMessageMainRight">
                        <img src={UserOnline1[0].ImgUrl}></img>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8.05273" cy="7.93848" r="7.45829" fill="#31A24C" stroke="white" stroke-width="0.916584" />
                        </svg>
                        <p>{UserOnline1[0].name}</p>

                    </div>
                    <div>
                        <svg width="31" height="32" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.4997 17.3182C16.213 17.3182 16.7913 16.7399 16.7913 16.0265C16.7913 15.3132 16.213 14.7349 15.4997 14.7349C14.7863 14.7349 14.208 15.3132 14.208 16.0265C14.208 16.7399 14.7863 17.3182 15.4997 17.3182Z" stroke="white" stroke-width="2.58333" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24.5417 17.3182C25.255 17.3182 25.8333 16.7399 25.8333 16.0265C25.8333 15.3132 25.255 14.7349 24.5417 14.7349C23.8283 14.7349 23.25 15.3132 23.25 16.0265C23.25 16.7399 23.8283 17.3182 24.5417 17.3182Z" stroke="white" stroke-width="2.58333" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.45866 17.3182C7.17203 17.3182 7.75033 16.7399 7.75033 16.0265C7.75033 15.3132 7.17203 14.7349 6.45866 14.7349C5.74529 14.7349 5.16699 15.3132 5.16699 16.0265C5.16699 16.7399 5.74529 17.3182 6.45866 17.3182Z" stroke="white" stroke-width="2.58333" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                </div>
                <div className="boxMessage">
                    { listOfMessageElements }
                </div>
                <div className="sendHideMessage">
                    <svg width="48" height="44" viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2428 3.42382L10.3032 14.197L10.2571 14.3881C4.59861 15.2878 0.930664 16.7313 0.930664 18.3593C0.930664 21.088 11.2589 23.3026 23.9995 23.3026C36.7401 23.3026 47.0684 21.088 47.0684 18.3593C47.0684 16.7313 43.4004 15.2878 37.742 14.3881C37.7284 14.324 37.713 14.2602 37.6958 14.197L34.7562 3.42052C34.275 1.66399 32.4559 0.622599 30.673 1.00159C28.6495 1.43001 26.0428 1.8815 23.9995 1.8815C21.9563 1.8815 19.3495 1.4333 17.326 1.00159C15.5431 0.622599 13.724 1.6607 13.2428 3.42382ZM13.2923 16.1677C13.303 16.0599 13.3349 15.9553 13.3861 15.8598C13.4373 15.7643 13.5068 15.6799 13.5907 15.6113C13.6745 15.5428 13.7711 15.4914 13.8748 15.4602C13.9786 15.429 14.0875 15.4186 14.1953 15.4295C17.1613 15.7327 20.4898 15.9008 23.9995 15.9008C27.2734 15.9084 30.5457 15.7511 33.8038 15.4295C34.0214 15.4077 34.2388 15.4732 34.4082 15.6116C34.5775 15.75 34.6849 15.9501 34.7068 16.1677C34.7286 16.3853 34.6631 16.6027 34.5247 16.7721C34.3862 16.9414 34.1862 17.0488 33.9686 17.0707C30.9432 17.3772 27.562 17.5486 23.9995 17.5486C20.437 17.5486 17.0558 17.3772 14.0305 17.0707C13.9227 17.06 13.818 17.0281 13.7226 16.9769C13.6271 16.9257 13.5427 16.8562 13.4741 16.7723C13.4055 16.6884 13.3542 16.5919 13.323 16.4881C13.2918 16.3844 13.2813 16.2755 13.2923 16.1677ZM9.16954 29.8937H15.7606C16.1977 29.8937 16.6168 30.0673 16.9258 30.3763C17.2348 30.6853 17.4084 31.1044 17.4084 31.5415V34.837C17.4084 36.1481 16.8876 37.4054 15.9606 38.3325C15.0335 39.2595 13.7761 39.7803 12.4651 39.7803C11.154 39.7803 9.89669 39.2595 8.96963 38.3325C8.04258 37.4054 7.52177 36.1481 7.52177 34.837V31.5415C7.52177 31.1044 7.69537 30.6853 8.00439 30.3763C8.31341 30.0673 8.73252 29.8937 9.16954 29.8937ZM4.22621 31.5415C4.22621 30.9647 4.32508 30.4078 4.50634 29.8937H4.22621C3.7892 29.8937 3.37008 29.7201 3.06106 29.4111C2.75204 29.102 2.57844 28.6829 2.57844 28.2459C2.57844 27.8089 2.75204 27.3898 3.06106 27.0808C3.37008 26.7717 3.7892 26.5981 4.22621 26.5981H15.7606C16.9643 26.5983 18.1265 27.0376 19.0294 27.8336C19.9322 28.6296 20.5136 29.7277 20.6644 30.9219C22.8393 30.265 25.1597 30.265 27.3346 30.9219C27.4855 29.7277 28.0668 28.6296 28.9697 27.8336C29.8725 27.0376 31.0347 26.5983 32.2384 26.5981H43.7728C44.2098 26.5981 44.629 26.7717 44.938 27.0808C45.247 27.3898 45.4206 27.8089 45.4206 28.2459C45.4206 28.6829 45.247 29.102 44.938 29.4111C44.629 29.7201 44.2098 29.8937 43.7728 29.8937H43.4927C43.674 30.4078 43.7728 30.9647 43.7728 31.5415V34.837C43.7728 37.0221 42.9048 39.1177 41.3597 40.6628C39.8146 42.2079 37.719 43.0759 35.5339 43.0759C33.3489 43.0759 31.2533 42.2079 29.7082 40.6628C28.1631 39.1177 27.2951 37.0221 27.2951 34.837V34.3756L26.603 34.1449C24.913 33.5821 23.0861 33.5821 21.396 34.1449L20.704 34.3756V34.837C20.704 37.0221 19.8359 39.1177 18.2909 40.6628C16.7458 42.2079 14.6502 43.0759 12.4651 43.0759C10.28 43.0759 8.18441 42.2079 6.63933 40.6628C5.09424 39.1177 4.22621 37.0221 4.22621 34.837V31.5415ZM32.2384 29.8937H38.8295C39.2665 29.8937 39.6856 30.0673 39.9947 30.3763C40.3037 30.6853 40.4773 31.1044 40.4773 31.5415V34.837C40.4773 36.1481 39.9565 37.4054 39.0294 38.3325C38.1024 39.2595 36.845 39.7803 35.5339 39.7803C34.2229 39.7803 32.9655 39.2595 32.0385 38.3325C31.1114 37.4054 30.5906 36.1481 30.5906 34.837V31.5415C30.5906 31.1044 30.7642 30.6853 31.0732 30.3763C31.3823 30.0673 31.8014 29.8937 32.2384 29.8937Z" fill="white" />
                    </svg>
                    <div className="sendCommentHideMessage">
                        <input placeholder="Give a comment" value={newMessage} onChange={e=>setNewMessage(e.target.value)}></input>
                    </div>
                    <span onClick={createMessage}>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <g clip-path="url(#clip0_830_982)">
                                <path d="M47.8923 2.05791C48.0014 1.78531 48.0281 1.48669 47.9691 1.19906C47.9101 0.911436 47.768 0.647448 47.5604 0.439829C47.3528 0.232209 47.0888 0.0900887 46.8011 0.0310864C46.5135 -0.027916 46.2149 -0.0012055 45.9423 0.107907L2.3013 17.5649H2.2983L0.942296 18.1049C0.685467 18.2074 0.461953 18.3788 0.296443 18.6003C0.130934 18.8218 0.0298702 19.0847 0.00441653 19.3601C-0.0210371 19.6354 0.0301097 19.9124 0.152207 20.1605C0.274305 20.4086 0.462601 20.6181 0.696296 20.7659L1.9263 21.5459L1.9293 21.5519L16.9143 31.0859L26.4483 46.0709L26.4543 46.0769L27.2343 47.3069C27.3826 47.5397 27.5922 47.7271 27.8401 47.8484C28.088 47.9697 28.3646 48.0203 28.6394 47.9946C28.9142 47.9688 29.1765 47.8678 29.3976 47.7025C29.6187 47.5372 29.7898 47.3142 29.8923 47.0579L47.8923 2.05791ZM42.3933 7.72791L19.9113 30.2099L19.2663 29.1959C19.1481 29.0098 18.9904 28.8521 18.8043 28.7339L17.7903 28.0889L40.2723 5.60691L43.8063 4.19391L42.3963 7.72791H42.3933Z" fill="url(#paint0_linear_830_982)" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_830_982" x1="23.9989" y1="0.000488281" x2="23.9989" y2="48.0011" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#3489EE" />
                                    <stop offset="0.5" stop-color="#A2DD9F" />
                                    <stop offset="1" stop-color="#EE92C4" />
                                </linearGradient>
                                <clipPath id="clip0_830_982">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </span>
                </div>
            </div>



        </div>
    )
}

export default HideMessage;