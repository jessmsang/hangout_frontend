import "./Footer.css";

function Footer({ isMobile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {!isMobile && (
        <div className="footer__desktop-view">
          <div className="footer__left"></div>
          <div className="footer__middle">
            <p className="footer__author">Developed by Jess Sang</p>
          </div>
          <div className="footer__right">
            <p className="footer__year">{currentYear}</p>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="footer__mobile-view">
          <p className="footer__author">Developed by Jess Sang</p>
          <p className="footer__year">{currentYear}</p>
        </div>
      )}
    </footer>
  );
}

export default Footer;
