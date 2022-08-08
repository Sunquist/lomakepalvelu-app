import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lomakeplavelu.fi</title>
        <meta name="description" content="Lomakepalvelu yksinkeraistaa tietojenkeräilyn." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Tietojenkeräily on yksinkertaistumassa!
        </h1>
        <div className={styles.description}>
          Tähän on tulossa internettiä mullistava työkalu.
        </div>
      </main>
    </div>
  )
}

export default Home
