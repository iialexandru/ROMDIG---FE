import type { FC } from 'react';
import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/scss/MyAccount/Posts/Post.module.scss'
import { useAuth } from '../../utils/useAuth'
import formatDate from '../../utils/formatDate'

interface Post {
    _id: string;
    title: string;
    description: string;
    downVoted: {
        count: number;
        people: Array<any>
    },
    upVoted: {
        count: number;
        people: Array<any>
    },
    firstNameAuthor: string;
    media: Array<any>;
    status: string;
    creationDate: Date;
    nameAuthor: string;
    profilePicture: string;
}


const Post: FC<Post> = ({ _id, title, description, downVoted, upVoted, firstNameAuthor, media, status, creationDate, nameAuthor, profilePicture}) => {

    const user = useAuth()


    return (
        <Link href={`/postari/${_id}`}>
            <div className={styles.mini_post}>
                <div className={styles.image}>
                    {media[0] && <Image src={media[0]} layout='fill' key={'l' + _id} /> }
                    {!media[0] && 
                        <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ marginTop: 10}}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647938098/FIICODE/no-image-6663_bwocug.svg' height={40} width={40} />
                                <h3 style={{ color: 'rgb(186, 186, 186)'}}>Nicio imagine de afișat</h3>
                            </div>
                        </div>
                    }
                </div>

                <div style={{ display: 'flex', flexFlow: 'column wrap' }}>
                    <div className={styles.title}>{title}</div>

                        <div key={'a' + _id} className={styles.manip_section}>
                            <Link href={`/postari/${_id}`}>
                                <div className={styles.manip_item}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474271/FIICODE/hearts-7890_2_maukcl.svg' width={20} height={20} />
                                    <span>{upVoted.count + downVoted.count} voturi</span>
                                </div>
                            </Link>
                            <Link href={`/postari/${_id}`}>
                                <div className={styles.manip_item}>
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474242/FIICODE/support-1091_1_smleyp.svg' width={20} height={20} />
                                        <span>{upVoted.count} comentarii</span>
                                </div>
                            </Link>
                        </div>

                </div>

            </div>
        </Link>
    )
}

export default Post;