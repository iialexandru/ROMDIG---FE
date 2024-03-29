import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

//@ts-ignore
import NextNProgress from "nextjs-progressbar";

import '../styles/scss/globals.scss'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { server } from '../config/server'
import { AuthProvider } from '../utils/useAuth'



function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const pathname = router.pathname

  const [ showLayout, setShowLayout ] = useState(true)

  useEffect(() => {
    if(pathname === '/inregistrare' || pathname === '/autentificare') {
      setShowLayout(false)
    } else {
      setShowLayout(true)
    }
  }, [pathname])

  useEffect(() => {
    const verifyUser = async () => {
      let error = false;

      const response = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                          error = true
                        })    

      if(Cookies.get('x-access-token') && error) {
        Cookies.remove('x-access-token')
      }
    }
    verifyUser()
  }, [])


  return(
    <AuthProvider>
      <div>
        <Head>
          <title>ROMDIG</title>
          <meta name="description" content="O aplicatie pentru administrarea noilor idei oferite de catre oameni dintr-o anumita comuna/localitate/judet pentru imbunatatirea acesteia" />
          <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel="canonical" href="https://romdig.net" />
          <link rel="logo icon" href="/favicon.ico" />
        </Head>
        <noscript>Please enable JavaScript to view this page</noscript>
        <NextNProgress color="#89BE91" />
        {showLayout ? <Header /> : <></> }
        <Component {...pageProps} />
        {showLayout ? <Footer /> : <></> }
      </div>
    </AuthProvider>
  )
}

export default MyApp
