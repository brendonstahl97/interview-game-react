import style from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={`${style.footer} py-3 bg-dark`}>
      <div className="container">
        <p className="m-0 text-center text-white">
          Initial Creation by Wonderful Jaguars 2020
          <br />
          Converted to Nextjs and Updated by Brendon Stahl
          <br />
          Copyright &copy; Brendon Stahl 2023
        </p>
      </div>
    </footer>
  );
};

export default Footer;
