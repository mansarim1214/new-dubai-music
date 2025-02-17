import "./frontend.css";

const ComingSoon = () => {
  
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-container">
        <div className="text-center">
          <img
            src={`${process.env.PUBLIC_URL}/dubai-music-white-logo.webp`}
            width="150px"
            className="d-inline-block align-top mb-4"
            alt="Logo"
          />
          <h2>The site is Coming Soon</h2>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
