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
        <span>Explore Soaring Communities</span>
        <div className={styles.rightLinks}>
          <Link href={'/about'}>About</Link>
          <Link href={'mailto:chris@soaringmap.com'}>Contact</Link>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
