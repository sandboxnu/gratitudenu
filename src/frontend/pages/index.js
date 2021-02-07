import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>RDG NU</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://sandboxnu.com">RDG NU</a>
        </h1>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Hi &rarr;</h3>
            <p>lorem ipsum something</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>blah &rarr;</h3>
            <p>lorem ipsum something</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>woooo &rarr;</h3>
            <p>asdfgdsfgsdfg</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>rdg nu &rarr;</h3>
            <p>sdfgsdfgsdfg</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Sandbox
        </a>
      </footer>
    </div>
  );
}
