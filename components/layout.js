import Head from 'next/head'

import styles from './layout.module.css'

export const siteTitle = 'Soaring POI'

export default function Layout({children}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Soaring POI" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header>
        <span>Soaring POI</span>
      </header>
      <main className={styles.main}>{children}</main>
      <footer>Footer</footer>
    </div>
  )
}
