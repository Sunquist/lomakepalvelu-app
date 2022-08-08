import type { GetServerSideProps, NextPage } from 'next'
import { authenticate } from '../../../lib/auth';
import styles from './templates.module.css'
import { MantineProvider } from '@mantine/core';
import { Navbar } from '../../../features/navigation';
import { Shell } from '../../../features/hallintashell';

export const getServerSideProps: GetServerSideProps = async (context) => {
    try{
        const { req, res } = context;
        const user = authenticate(req);
        
        return {
          props: { user },
        }
    }catch(ex){
        return {
            redirect: {
            destination: '/login',
            permanent: false,
            },
        }
    }
}

const Home: NextPage = (props: any) => {
    const { user } = props;


    return (
        <Shell>
            List templates
        </Shell>
    )
}

export default Home
