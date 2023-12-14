import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import FpsCounter from "../components/FpsCounter";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://www.glowscript.org/lib/jquery/2.1/jquery.min.js";
    script1.type = "text/javascript";
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src =
      "https://www.glowscript.org/lib/jquery/2.1/jquery-ui.custom.min.js";
    script2.type = "text/javascript";
    document.body.appendChild(script2);
    const script3 = document.createElement("script");

    script3.src = "https://www.glowscript.org/package/glow.3.2.min.js";
    script3.type = "text/javascript";
    document.body.appendChild(script3);

    const script4 = document.createElement("script");
    script4.src = "https://www.glowscript.org/package/RSrun.3.2.min.js";
    script4.type = "text/javascript";
    document.body.appendChild(script4);
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
      document.body.removeChild(script4);
    };
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>ml-app</title>
        <meta name="description" content="ml-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ justifyContent: "center" }}>
        <h1 className={styles.title}>
          Welcome to <Link href="/">ml-app!</Link>
        </h1>
        {/* <FpsCounter /> */}

        <div className={styles.grid}>
          <Link href="/hand-pose-detection" className={styles.card}>
            <h2> Hand Detection &rarr;</h2>
            <p>Hand pose detection by TensorFlow 👋</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
