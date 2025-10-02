import "./Footer.css";

function Footer({ isMobile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {!isMobile && (
        <div className="footer__desktop-view">
          <p className="footer__author">Developed by Jess Sang</p>
          <p className="footer__year">&nbsp; &copy; {currentYear}</p>
        </div>
      )}
      {isMobile && (
        <div className="footer__mobile-view">
          <p className="footer__author">Developed by Jess Sang</p>
          <p className="footer__year">&nbsp; &copy; {currentYear}</p>
        </div>
      )}
    </footer>
  );
}

export default Footer;
