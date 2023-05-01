import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import styles from '../styles/homepage.module.css'

export default function About() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        <div className={styles.innerContainerAbout}>
          <h1 className={styles.aboutTitle}>About</h1>
          <p>
            Our goal with Soaring Map is to provide users with easy access to information about glider operations, both commercial and club-based, along with
            the unique charactertics the operation has to offer. Although we're currently in the early stages of development, we're starting with glider
            operations in the United States. We look forward to expanding our coverage as we continue to make progress on this project. We hope to build
            something valueable for the soaring community, and we welcome your feedback and suggestions. Please feel free to reach out to us at{' '}
            <a className={styles.aboutTitle} href="mailto:chris@soaringmap.com">
              chris@soaringmap.com
            </a>
          </p>
        </div>
      </section>
    </Layout>
  )
}
