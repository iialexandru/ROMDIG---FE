import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

import styles from '../../../../styles/scss/Authentication/Registration.module.scss';
import overrideStyles from '../../../../styles/scss/Authentication/ForgotPassword.module.scss';
import { server } from '../../../../config/server'



interface InitialProps { 
    status: string;
}

const Token: NextPage<InitialProps> = ({ status }) => {
    const router = useRouter()

    const [ password, setPassword ] = useState('')
    const [ confirmedPassword, setConfirmedPassword ] = useState('')

    const [ error, setError ] = useState({ password: false, cpassword: false })
    const [ errorMessage, setErrorMessage ] = useState({ password: '', cpassword: '' })

    const [ loading, setLoading ] = useState(false)
    const [ sent, setSent ] = useState(false)
    const [ showPassword, setShowPassword ] = useState(false)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        setError({
            password: !password.length,
            cpassword: !confirmedPassword.length
        })

        if(!password.length && !confirmedPassword.length) {
            setError({
                password: true,
                cpassword: true
            })
            setErrorMessage({
                password: 'Introduceți o nouă parolă',
                cpassword: 'Introduceți o nouă parolă'
            })
            setLoading(false)
            return;
        } else if(!password.length){
            setError({
                ...error,
                password: true
            })
            setErrorMessage({
                ...errorMessage,
                password: 'Introduceți o nouă parolă'
            })
            setLoading(false)
            return;
        } else if(!confirmedPassword.length){
            setError({
                ...error,
                cpassword: true
            })
            setErrorMessage({
                ...errorMessage,
                cpassword: 'Introduceți o nouă parolă'
            })
            setLoading(false)
            return;
        }

        if(password.length < 8) {
            setError({
                ...error,
                password: true
            })
            setErrorMessage({
                ...errorMessage,
                password: 'Parola trebuie să aibă minim 8 caractere'
            })
            setLoading(false)
            return;
        }

        if(password !== confirmedPassword){
            setError({
                password: true,
                cpassword: true
            })
            setErrorMessage({
                ...errorMessage,
                cpassword: 'Parolele nu coincid'
            })
            setLoading(false)
            return;
        }

        if(!router.query.token){
            router.push('/')
            setLoading(false)
        }

        const result = await axios.post(`${server}/api/login/forgot-password/change-password/${router.query.token}`, { password, confirmedPassword })
                                .then(res => res.data)
                                .catch(err => {
                                    setLoading(false)
                                    console.log(err)
                                })

        if(result && result.message === 'Parolă schimbată cu succes'){
            setSent(true)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(status !== 'allowed') {
            router.push('/404')
        }
    }, [])

    return (
        <>
            <Head>

                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooTamma2/BalooTamma2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />

                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                    <link
                    rel="preload"
                    href="/fonts/BalooBhai2/BalooBhai2.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous" 
                />
                
            </Head>

            <div className={styles.container}>
                {!sent ?
                    <form className={overrideStyles.form}>
                        <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Schimbă parola</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647695526/FIICODE/reset-stock-password_hqhya1.svg' alt='Icon' width={100} height={100} priority/>
                        </div>
                        <div className={`${styles.input_d} ${error.password ? styles.wrong_input : ''}`}>
                            <label htmlFor="password">Parola*</label>
                            <input type={!showPassword ? 'password' : 'text'} autoComplete='password' id='password' name='password' value={password} onChange={e => { setPassword(e.target.value.toString()); setErrorMessage({ ...errorMessage, password: '' }); setError({ ...error, password: false }); }} />
                            <div className={styles.svg_container}>
                                {!showPassword ? <LockOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon id='pass' onClick={() => setShowPassword(!showPassword)}/> }
                            </div>
                            {errorMessage.password !== '' && <label style={{ color: 'red' }}>{errorMessage.password}</label> }
                        </div>
                        <div className={`${styles.input_d} ${error.password ? styles.wrong_input : ''}`}>
                            <label htmlFor="password">Confirmă parola*</label>
                            <input type='password' autoComplete='same-password' id='password' name='password' value={confirmedPassword} onChange={e => { setConfirmedPassword(e.target.value.toString()); setErrorMessage({ ...errorMessage, cpassword: '' }); setError({ ...error, cpassword: false }) }}/>
                            {errorMessage.cpassword !== '' && <label style={{ color: 'red'}}>{errorMessage.cpassword}</label> }
                        </div>
                        <div className={overrideStyles.button_sub}>
                            {!loading ?
                            <button type="submit" onClick={e => handleSubmit(e)}>Trimite</button>
                            :
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648466329/FIICODE/Spinner-1s-200px_yjc3sp.svg' alt='Loading...' width={150} height={150} /> }
                        </div>     
                    </form>
                :
                    <div className={overrideStyles.form}>
                        <div style={{ marginTop: 60}}>
                            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Parolă schimbată</h2>
                            <p className={overrideStyles.additional_info}>
                                De acum vă puteți autentifica în cont folosind parola cea nouă.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647696142/FIICODE/safety-3599_1_pbz0mr.svg' alt='Icon' width={100} height={100} priority />
                            </div>
                            <div className={overrideStyles.button_sub} style={{ marginTop: 50 }}>
                                <button>
                                    <Link href='/autentificare'>Autentifică-te</Link>
                                </button>
                            </div>     
                        </div>
                    </div>
            }

            </div>
        </>
    )
}

export default Token;



export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const data = await axios.get(`${server}/api/login/forgot-password/change-password/${ctx.query.token}`)
                         .then(res => res.data)

    if(data && data.message === 'Cerere găsită') {
        return {
            props: {
                status: 'allowed'
            }
        }
    } else {
        return {
            notFound: true
        }
    }
}