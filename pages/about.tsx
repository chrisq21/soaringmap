import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import styles from '../styles/homepage.module.css'

export default function Home({gliderportData}) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        <div className={styles.innerContainerAbout}>
          <h1 className={styles.aboutTitle}>About</h1>
          <p>
            Our goal with this website is to provide users with easy access to information about glider operations, both commercial and club-based, around the
            world. Although we're currently in the early stages of development, we're starting with glider operations in the United States. We look forward to
            expanding our coverage as we continue to make progress on this project.
          </p>
        </div>
      </section>
    </Layout>
  )
}
