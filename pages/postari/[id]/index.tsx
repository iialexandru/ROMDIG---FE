import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper'
import { useRouter } from 'next/router'
import parse from 'html-react-parser'
import Head from 'next/head'


import styles from '../../../styles/scss/SinglePost/Post.module.scss'
import { useAuth } from '../../../utils/useAuth'
import formatDate from '../../../utils/formatDate'
import CommentSection from '../../../components/SinglePost/CommentSection'
import { server } from '../../../config/server'
import useWindowSize from '../../../utils/useWindowSize'
import { NoSSR } from '../../../utils/NoSsr'
import ReportModal from '../../../components/SinglePost/ReportModal'
import ReactPlayer from 'react-player'


interface Post {
    post: {
        post: {
            _id: string;
            title: string;
            authorId: string;
            city: string;
            county: string;
            description: string;
            downVoted: {
                count: number;
                people: Array<any>
            },
            upVoted: {
                count: number;
                people: Array<any>
            },
            reports: {
                count: number,
                people: Array<any>
            };
            favorites: {
                count: number,
                people: Array<any>
            };
            firstNameAuthor: string;
            media: Array<any>;
            status: string;
            views: {
                count: number;
                people: Array<any>;
            };
            comments: {
                count: number;
                people: Array<any>;
            };
            creationDate: Date;
            nameAuthor: string;
            authorProfilePicture: string;
            video: string;
            deletedUser: boolean;
        }
    };
    comments: {
            comments : [{
            _id: string;
            repliedToCommentId: string;
            repliedToId: string;
            originalPostId: string
            originalPosterId: string;
            nameAuthor: string;
            firstNameAuthor: string;
            authorId: any;
            text: string;
            upVoted: {
                count: number
                people: Array<string>
            },
            downVoted: {
                count: number;
                people: Array<string>
            },
            reported: {
                count: number;
                people: Array<string>;
                reasons: Array<string>
            };
            lowCommentLevel: boolean;
            hasReplies: boolean;
            creationDate: Date;
            profilePicture: string;
            deletedUser: boolean;
            admin: boolean;
        }]
    }
}

const Page: NextPage<Post> = ({ post, comments }) => {
    const [ data, setData ] = useState(post.post)
    const router = useRouter()

    const [ width, height ] = useWindowSize()


    //Pentru randarea imaginilor doar pe clien side
    const [ ssr, setSsr ] = useState(false)

    useEffect(() => {
        setSsr(true)
    }, [])

    const user = useAuth()

    const [ like, setLike ] = useState(false)
    const [ dislike, setDislike ] = useState(false)
    const [ favorite, setFavorite ] = useState(false)
    const [ report, setReport ] = useState(false)
    const [ reportModal, setReportModal ] = useState(false)

    const [ press, setPress ] = useState(true)

    useEffect(() => {
        if(data.upVoted.people.includes(user.user.userId)) {
            setLike(true)
        } else if(data.downVoted.people.includes(user.user.userId)) {
            setDislike(true)
        }
        if(data.favorites.people.includes(user.user.userId)) {
            setFavorite(true)
        }
        if(data.reports.people.includes(user.user.userId)) {
            setReport(true)
        }
    }, [user])


    useEffect(() => {
        const documentWidth = document.documentElement.clientWidth;
        const windowWidth = window.innerWidth;
        const scrollBarWidth = windowWidth - documentWidth;

        if(reportModal) {
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${scrollBarWidth}px`
        }
        if(!reportModal) {
            document.body.style.overflow = 'unset'
            document.body.style.paddingRight = `0px`
        }
    }, [reportModal])

    const LikeRequest = async (e: any) => {
        e.preventDefault()
        if(press && user.user.active) {
            setPress(false)
            if(!like || dislike) {
                setLike(!like); 
                setDislike(false)
                if(dislike) {
                    data.downVoted.count--;
                }
                data.upVoted.count++;
                const result = await axios.patch(`${server}/api/post/upvote/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setLike(!like); 
                data.upVoted.count--;
                const result = await axios.patch(`${server}/api/post/upvote/un/${data._id}`, {}, { withCredentials: true })   
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }

    const DislikeRequest = async (e: any) => {
        e.preventDefault()
        if(press && user.user.active) {
            setPress(false)
            if(!dislike || like) {
                setDislike(!dislike); 
                setLike(false)
                if(like) {
                    data.upVoted.count--;
                }
                data.downVoted.count++;
                const result = await axios.patch(`${server}/api/post/downvote/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setDislike(!dislike); 
                data.downVoted.count--;
                const result = await axios.patch(`${server}/api/post/downvote/un/${data._id}`, {}, { withCredentials: true })   
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }

    const FavoriteRequest = async (e: any) => {
        e.preventDefault()
        if(press && user.user.active) {
            setPress(false)
            if(favorite) {
                setFavorite(!favorite)
                data.favorites.count--;
                const result = await axios.patch(`${server}/api/post/favorite/un/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            } else {
                setFavorite(!favorite)
                data.favorites.count++;
                const result = await axios.patch(`${server}/api/post/favorite/${data._id}`, {}, { withCredentials: true })
                                            .catch(err => console.log(err))
            }
            setPress(true)
        }
    }

    return (
        <NoSSR fallback={<div style={{ height: '100vh'}}></div>}>
            {(reportModal && !report) && <ReportModal setReport={setReport} setReportModal={setReportModal} id={data._id} /> }
            <div className={styles.container}>
                <div className={styles.image_section}>

                    <div className={styles.swiper_limit}>
                        <h1 id='#title'>{data.title}</h1>
                        <div className={styles.post_info}>
                            {(width >= 1199) ? 
                                    <>
                                        <Image className={styles.pp_img} src={(data.authorProfilePicture === '/' || data.deletedUser) ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : data.authorProfilePicture } alt='Poza Profil' width={50} height={50} />
                                        <div>
                                            <span>{data.deletedUser ? '[Utilizator șters]' : `${data.nameAuthor} ${data.firstNameAuthor}`}</span>
                                            <br />
                                            <span>{formatDate(data.creationDate)}</span>
                                        </div>
                                    </>
                                :
                                    <>
                                        {ssr && 
                                            <div className={styles.manip_sec} style={{ width: (data.media.length >= 2 || (data.video && data.video !== '')) ? '100%' : '', position: 'absolute' }}>
                                            <div className={`${styles.option}`}>
                                                <Image src={!like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648629762/FIICODE/heart-492_2_bul5uk.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648630120/FIICODE/heart-329_1_o8ehwn.svg' } alt='Icon' width={width > 500 ? 20 : 15} height={width > 500 ? 20 : 15} onClick={e => LikeRequest(e)} />
                                                <span id='#text'>{data.upVoted.count}</span>
                                            </div>
                                            <div className={styles.option}>
                                                <Image src={!dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648630460/FIICODE/broken-heart-2940_1_pfnst7.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648631540/FIICODE/broken-heart-2943_s0ap3p.svg' } alt='Icon' width={width > 500 ? 20 : 15} height={width > 500 ? 20 : 15} onClick={e => DislikeRequest(e)} />
                                                <span id='#text'>{data.downVoted.count}</span>
                                            </div>
                                            <div className={styles.option}>
                                                <Image src={!favorite ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648632020/FIICODE/favourite-2765_1_bmyyrq.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648632018/FIICODE/star-346_2_tczou4.svg'} alt='Icon' width={width > 500 ? 20 : 15} height={width > 500 ? 20 : 15} onClick={e => FavoriteRequest(e)} />
                                                <span id='#text'>{data.favorites.count}</span>
                                            </div> 
                                            <div className={styles.option}>
                                                <Image src={ !report ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648826940/FIICODE/start-flag-8253_3_bhujpa.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648654241/FIICODE/start-flag-8252_3_f9nlcp.svg' } alt='Icon' width={width > 500 ? 20 : 15} height={width > 500 ? 20 : 15} onClick={() => { if(!report) { setReportModal(true) } }} />
                                            </div>
                                        </div>
                                        }
                                    </>
                            }
                            <div className={styles.status}>
                                {ssr && <Image src={data.status === 'Trimis' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648628565/FIICODE/paper-plane-2563_dlcylv.svg' : (data.status === 'Vizionat' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713682/FIICODE/check-7078_v85jcm.svg' : (data.status === 'În lucru' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713958/FIICODE/time-management-9651_fywiug.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648714033/FIICODE/wrench-and-screwdriver-9431_hf7kve.svg' )) } alt='Icon' height={120} width={width < 500 ? 15 : 30} /> }
                                <p>{data.status}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1em' }} className={styles.img_full}>
                        {(width >= 1199) && 
                            <div className={styles.manip_sec} style={{ width: (data.media.length >= 2 || (data.video && data.video !== '')) ? '100%' : '', position: 'absolute' }}>
                                <div className={`${styles.option}`}>
                                    <Image src={!like ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648629762/FIICODE/heart-492_2_bul5uk.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648630120/FIICODE/heart-329_1_o8ehwn.svg' } alt='Icon' width={30} height={30} onClick={e => LikeRequest(e)} />
                                    <span id='#text'>{data.upVoted.count}</span>
                                </div>
                                <div className={styles.option}>
                                    <Image src={!dislike ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648630460/FIICODE/broken-heart-2940_1_pfnst7.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648631540/FIICODE/broken-heart-2943_s0ap3p.svg' } alt='Icon' width={30} height={30} onClick={e => DislikeRequest(e)} />
                                    <span id='#text'>{data.downVoted.count}</span>
                                </div>
                                <div className={styles.option}>
                                    <Image src={!favorite ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648632020/FIICODE/favourite-2765_1_bmyyrq.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648632018/FIICODE/star-346_2_tczou4.svg'} alt='Icon' width={30} height={30} onClick={e => FavoriteRequest(e)} />
                                    <span id='#text'>{data.favorites.count}</span>
                                </div>  
                                <div className={styles.option}>
                                    <Image src={ !report ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648826940/FIICODE/start-flag-8253_3_bhujpa.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648654241/FIICODE/start-flag-8252_3_f9nlcp.svg' } alt='Icon' width={30} height={30} onClick={() => { if(!report) { setReportModal(true) } }} />
                                </div>
                            </div>
                            }
                        <Swiper
                        modules={[ Navigation ]}
                        spaceBetween={50}
                        slidesPerView={1}
                        centeredSlides
                        navigation
                        >
                            {(data.video && data.video !== '') &&
                                <SwiperSlide className={styles.video} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                                    <ReactPlayer
                                        url={data.video}
                                        width='100%'
                                        height='100%'
                                        controls
                                        forceVideo
                                    />
                                </SwiperSlide>
                            }
                            {data.media.length > 0 ?
                                <>
                                    {data.media.map((img: string, i: number) => {
                                        return <SwiperSlide  key={i} style={{ display: 'flex', justifyContent: 'center'}}>
                                                    <Image key={i} src={img} alt='Poza Carusel' width={width < 500 ? 300 : 950} height={width < 500 ? 200 : 650} priority/>
                                                </SwiperSlide>
                                    })}
                                </>
                            : 
                                <>
                                    {(data.video === '') &&
                                        <>
                                            <SwiperSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column wrap', width: width < 500 ? 300 : 950, height: width < 500 ? 200 : 650, border: '2px solid black', borderRadius: 3 }}>
                                                <Image src={'https://res.cloudinary.com/multimediarog/image/upload/v1648634881/FIICODE/no-image-6663_1_j2edue.svg'} alt='Fara Poze' width={width < 500 ? 100 : 250} height={width < 500 ? 50 : 300} />
                                                <h1 className={styles.no_image}>Nicio imagine</h1>
                                            </SwiperSlide>
                                        </>
                                    }
                                </>
                            }
                        
                        </Swiper>
                        </div>
                        {(width < 1199) &&
                            <div className={styles.under_ph} style={{ position: 'relative' }}>
                                <Image src={data.authorProfilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : data.authorProfilePicture } alt='Poza Profil' width={width < 500 ? 35 : 50} height={25} />
                                <div>
                                    <span>{data.nameAuthor} {data.firstNameAuthor}</span>
                                    <br />
                                    <span>{formatDate(data.creationDate)}</span>
                                </div>
                                <div style={{  position: 'absolute', top: -15.5, right: 0, color: 'rgb(200, 200, 200)', marginTop: 15, marginRight: 5, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}> 
                                    <div style={{ marginTop: 0 }}>
                                        <span>Vizionări: </span> 
                                        <span>{data.views.count}</span>
                                    </div>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649762065/FIICODE/eye-12109_ho0gpr.svg' alt='Icon' height={20} width={20} />
                                </div>
                            </div>
                        }

                        {width >= 1199 && 
                            <div className={styles.under_font} style={{ color: 'rgb(200, 200, 200)', marginTop: 15, marginRight: 5, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}> 
                                <div style={{ marginTop: 2}}>
                                    <span>Vizionări: </span> 
                                    <span>{data.views.count}</span>
                                </div>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649762065/FIICODE/eye-12109_ho0gpr.svg' alt='Icon' height={20} width={20} />
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.description}>
                    {parse(data.description)}
                </div>
                
                <CommentSection key={router.query.id?.toString()} comments={comments} />
            </div>
        </NoSSR>
    )
}

export default Page;


export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const token = ctx.req.cookies['x-access-token']
    let redirect = false
    
    if(!token) {
        return {
            redirect: {
                permanent: false,
                destination: '/autentificare'
            },
            props: {} }
    }

    const user = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err);
                            redirect = true
                        })

    if(redirect) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    }

    const post = await axios.get(`${server}/api/post/show/specific/${ctx.query.id}`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err) 
                            redirect = true
                        })

    const comments = await axios.get(`${server}/api/comment/show-commentonpost/${ctx.query.id}`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                            .then(res => res.data)
                            .catch(err => {
                                console.log(err)
                                redirect = true
                            })


    if(redirect) {
        return {
            redirect: {
                permanent: false,
                destination: '/postari/cx/popular/p1'
            },
            props: {}
        }
    }

    return { props: {
            post: post ? post : { post: {} },
            comments: comments ? comments : { comments: {} }
        } 
    }
}