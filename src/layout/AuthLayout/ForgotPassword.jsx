import { useState } from 'react'

import { useOutletContext, useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'

import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import CardBtnSubmit from './components/CardBtnSubmit'

const ForgotPassword = () => {
    const { showModal, onChangeShowModal, setSnackbar } = useOutletContext()
    const [errors, setErrors] = useState('')

    const navigate = useNavigate()

    const [emailValue, setEmailValue] = useState('')

    const handleHideModal = () => {
        onChangeShowModal(false)
        navigate('/auth')
    }

    const handleSubmitForgot = (e) => {
        e.preventDefault()
        if (emailValue.trim() === '') {
            setErrors('Please enter your email')
            return
        }
        setErrors('')
        fetchApiSamenote('post', '/resetPassword', { gmail: emailValue }).then(
            (data) => {
                if (data?.error) {
                    return setSnackbar({
                        isOpen: true,
                        message: data.error,
                        severity: 'error',
                    })
                }

                return navigate('/auth/signin', {
                    state: { title: 'All Done!', subtitle: 'Please sign in to your account' },
                })
            }
        )
    }

    return (
        <Modal
            centered={true}
            dialogClassName='register-modal auth-modal'
            show={showModal}
            onHide={handleHideModal}
            size='lg'
        >
            <h1 className='font-semibold font-SourceSan capitalize text-4xl lg:text-5xl'>
                Forgot your password
            </h1>
            {/* 
   {isResetPassword ? (
    <div className=''>
     <p className='text-2xl font-normal font-Mulish leading-normal my-4'>
      Please enter your email below and we will send you a password reset via
      email.
     </p>

     <form
      onSubmit={handleSubmit(handleChangePassword)}
      className='flex flex-col gap-3'
      action=''
     >
      <CardField
       Icon={IconEmail}
       type='text'
       placeholder={'Email address'}
       errors={errors}
       register={register}
       registerName={'gmail'}
      />
      <CardField
       Icon={IconPassword}
       type='password'
       placeholder='Password'
       errors={errors}
       register={register}
       registerName={'password'}
      />
      <CardField
       Icon={IconPassword}
       type='password'
       placeholder='New password'
       errors={errors}
       register={register}
       registerName={'new_password'}
      />

      <CardBtnSubmit name='Xác nhận' />
     </form>
    </div>
   ) : (
    <form
     onSubmit={handleSubmitForgot}
     className='flex flex-col gap-3 mt-4'
     action=''
    >
     <div className='bg-white h-[60px] rounded-xl p-3 flex items-center'>
      <div
       style={{ borderRight: '1px solid #DBE3FF' }}
       className='pe-2 h-max me-2'
      >
       <MailOutlineIcon className='text-[#9CADF2] text-[20px]' />
      </div>

      <input
       className='text-[#3B3B3B] w-full'
       placeholder='Email address'
       type='email'
       onChange={(e) => setEmailValue(e.target.value)}
      />
     </div>

     <CardBtnSubmit name='Xác nhận' />
    </form>
   )} */}

            <form
                onSubmit={handleSubmitForgot}
                className='flex flex-col gap-3 mt-4'
                action=''
            >
                <div className='email-input'>

                    <div className='bg-white h-[60px] rounded-xl p-3 flex items-center'>
                        <div
                            style={{ borderRight: '1px solid #DBE3FF' }}
                            className='pe-2 h-max me-2'
                        >
                            <MailOutlineIcon className='text-[#9CADF2] text-[20px]' />
                        </div>

                        <input
                            className={`text-[#3B3B3B] w-full ${errors ? 'border-red-500' : ''}`}
                            placeholder='Email address'
                            type='email'
                            onChange={(e) => setEmailValue(e.target.value)}
                        />
                    </div>

                    {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
                </div>

                <CardBtnSubmit name='Xác nhận' />
            </form>
        </Modal>
    )
}

export default ForgotPassword
