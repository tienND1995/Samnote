import React from 'react'
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';

const Footer = () => {
    return (
        <div className='footer w-[100%] h-[60px] bg-[#1D1D1D] flex items-center justify-center p-8'>
            <img src='/src/assets/footer-icon.png' alt='icon' className='w-[2.5rem] h-[2.5rem] mr-5' />
            <p className='text-white text-center text-xl font-[700]'>
                Now available on IOS and Android platform. Download now!
            </p>
            <div className='dowload-app-icons flex items-center gap-2 ml-4'>
                <AppleIcon
                    sx={{ color: 'white', fontSize: '1.8rem' }}
                    className='cursor-pointer hover:opacity-80'
                    onClick={() => {
                        window.open('https://apps.apple.com/us/app/sam-note-sticky-remind-color/id6445824669', '_blank')
                    }}
                />
                <AndroidIcon
                    sx={{ color: 'white', fontSize: '1.8rem' }}
                    className='cursor-pointer hover:opacity-80'
                    onClick={() => {
                        window.open('https://play.google.com/store/apps/details?id=com.thinkdiffai.cloud_note&amp;fbclid=IwY2xjawE_8sBleHRuA2FlbQIxMAABHYHaE1EWM6Iw4ZzcIta8_d6hLRUNJapdVbYO_a18uKUB20nuk851Tb-QEg_aem_ECePGLD4eDM--aBNYVTGoQ', '_blank')
                    }}
                />
            </div>
        </div>
    )
}

export default Footer