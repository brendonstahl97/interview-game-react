import Link from "next/link";
import style from "./header.module.scss";

const Header = () => {
  return (
    <header className={style.nav}>
      <nav>
        <Link className={style.navLink + "nav-link"} href="/">
          Let's Play!
        </Link>
        <Link className={style.navLink + "nav-link"} href="/howToPlay">
          Learn How to Play
        </Link>
      </nav>
    </header>
  );
};

export default Header;
