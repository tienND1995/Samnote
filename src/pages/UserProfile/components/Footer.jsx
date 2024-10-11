import React from 'react'
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';

const Footer = () => {
    return (
        <div className='footer w-[100%] h-[60px] bg-[#1D1D1D] flex items-center justify-center py-10'>
            <img src='/src/assets/footer-icon.png' alt='icon' className='w-[2.5rem] h-[2.5rem] mr-5' />
            <p className='w-auto text-white text-center text-xl font-[700] m-0'>
                <span className='hidden md:block'>Now available on IOS and Android platform. Download now!</span>
                <span className='md:hidden'>Download App Now!</span>
            </p>
            <div className='dowload-app-icons flex items-center gap-2 ml-4 pb-2'>
                <div className='apple-icon cursor-pointer hover:opacity-80 flex flex-col items-center justify-center'>
                    <AppleIcon
                        sx={{ color: 'white', fontSize: '1.6rem' }}
                        className='cursor-pointer hover:opacity-80'
                        onClick={() => {
                            window.open('https://apps.apple.com/us/app/sam-note-sticky-remind-color/id6445824669', '_blank')
                        }}
                    />
                    <svg width="24" height="16" viewBox="0 0 50 25" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.5781 1.30049C27.5781 0.582251 26.4238 0 25 0C23.5762 0 22.4219 0.582251 22.4219 1.30049V6.06897H16.4062C15.3635 6.06897 14.4234 6.38582 14.0244 6.87177C13.6253 7.35774 13.8459 7.91711 14.5832 8.28905L23.177 12.624C23.4242 12.7487 23.709 12.8428 24.0131 12.9062C24.3171 12.9698 24.6504 13.0049 25 13.0049C25.3496 13.0049 25.6829 12.9698 25.9869 12.9062C26.291 12.8428 26.5758 12.7487 26.823 12.624L35.4167 8.28905C36.154 7.91711 36.3747 7.35774 35.9756 6.87177C35.5765 6.38582 34.6365 6.06897 33.5938 6.06897H27.5781V1.30049ZM2.65625 14.4278C2.20041 14.4278 1.76324 14.5191 1.44091 14.6817C1.11858 14.8443 0.9375 15.0648 0.9375 15.2948V21.6588C0.9375 22.3487 1.48075 23.0103 2.44773 23.498C3.41471 23.9858 4.72621 24.2598 6.09375 24.2598H43.9062C45.2737 24.2598 46.5854 23.9858 47.5524 23.498C48.5194 23.0103 49.0625 22.3487 49.0625 21.6588V15.2948C49.0625 15.0648 48.8813 14.8443 48.5592 14.6817C48.2368 14.5191 47.7996 14.4278 47.3438 14.4278H37.123C35.7552 14.4278 34.4438 14.7018 33.4768 15.1896C32.5099 15.6774 31.9666 16.3389 31.9666 17.0287C31.9666 18.7181 28.6134 20.032 24.9921 20.0196C21.4703 20.0077 18.2166 18.6876 18.2166 17.0287C18.2166 16.3389 17.6734 15.6774 16.7064 15.1896C15.7394 14.7018 14.4279 14.4278 13.0604 14.4278H2.65625Z" />
                    </svg>
                </div>
                <div className='android-icon cursor-pointer hover:opacity-80 flex flex-col items-center'>
                    <AndroidIcon
                        sx={{ color: 'white', fontSize: '1.6rem' }}
                        onClick={() => {
                            window.open('https://play.google.com/store/apps/details?id=com.thinkdiffai.cloud_note&amp;fbclid=IwY2xjawE_8sBleHRuA2FlbQIxMAABHYHaE1EWM6Iw4ZzcIta8_d6hLRUNJapdVbYO_a18uKUB20nuk851Tb-QEg_aem_ECePGLD4eDM--aBNYVTGoQ', '_blank')
                        }}
                    />
                    <svg width="24" height="16" viewBox="0 0 50 25" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.5781 1.30049C27.5781 0.582251 26.4238 0 25 0C23.5762 0 22.4219 0.582251 22.4219 1.30049V6.06897H16.4062C15.3635 6.06897 14.4234 6.38582 14.0244 6.87177C13.6253 7.35774 13.8459 7.91711 14.5832 8.28905L23.177 12.624C23.4242 12.7487 23.709 12.8428 24.0131 12.9062C24.3171 12.9698 24.6504 13.0049 25 13.0049C25.3496 13.0049 25.6829 12.9698 25.9869 12.9062C26.291 12.8428 26.5758 12.7487 26.823 12.624L35.4167 8.28905C36.154 7.91711 36.3747 7.35774 35.9756 6.87177C35.5765 6.38582 34.6365 6.06897 33.5938 6.06897H27.5781V1.30049ZM2.65625 14.4278C2.20041 14.4278 1.76324 14.5191 1.44091 14.6817C1.11858 14.8443 0.9375 15.0648 0.9375 15.2948V21.6588C0.9375 22.3487 1.48075 23.0103 2.44773 23.498C3.41471 23.9858 4.72621 24.2598 6.09375 24.2598H43.9062C45.2737 24.2598 46.5854 23.9858 47.5524 23.498C48.5194 23.0103 49.0625 22.3487 49.0625 21.6588V15.2948C49.0625 15.0648 48.8813 14.8443 48.5592 14.6817C48.2368 14.5191 47.7996 14.4278 47.3438 14.4278H37.123C35.7552 14.4278 34.4438 14.7018 33.4768 15.1896C32.5099 15.6774 31.9666 16.3389 31.9666 17.0287C31.9666 18.7181 28.6134 20.032 24.9921 20.0196C21.4703 20.0077 18.2166 18.6876 18.2166 17.0287C18.2166 16.3389 17.6734 15.6774 16.7064 15.1896C15.7394 14.7018 14.4279 14.4278 13.0604 14.4278H2.65625Z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Footer