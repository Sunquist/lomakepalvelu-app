import type { GetServerSideProps, NextPage } from 'next'
import styles from './login.module.css'
import { MantineProvider } from '@mantine/core';
import { LoginForm } from '../../features/authentication';
import { authenticate } from '../../lib/auth';

export const getServerSideProps: GetServerSideProps = async (context) => {
    try{
        const { req, res } = context;
        const user = authenticate(req);
        
        return {
            redirect: {
                destination: '/hallinta',
                permanent: false,
            },
        }
    }catch(ex){
        return {
            props: {}
        }
    }
}

const Home: NextPage = () => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'light' }}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <LoginForm />
                </main>
            </div>
        </MantineProvider>
    )
}

export default Home
