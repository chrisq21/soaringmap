import Head from 'next/head'
import {FaMap} from 'react-icons/fa'
import styles from './layout.module.css'
import Link from 'next/link'

export const siteTitle = 'Soaring Map'

export default function Layout({children}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Soaring Map" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        <div className={styles.innerHeader}>
          <FaMap />
          <Link href={'/'}>Soaring Map</Link>
        </div>
        <Link href={'/about'}>About</Link>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
