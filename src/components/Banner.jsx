import Button from "../layouts/Button";
import { Link } from 'react-router-dom';
import { FaLeaf, FaHandHoldingHeart, FaRecycle } from 'react-icons/fa';

const Banner = ({ user }) => {

  
  return (
    <div 
      className="relative flex items-center min-h-screen px-4 lg:px-32"
      style={{ 
        backgroundImage: 'url(/banner.jpg)',
        backgroundPosition: '70% center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
      role="img"
      aria-label="A banner showing a community donating and saving food to fight waste"
    >
      
      {/* Overlay amélioré pour contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="w-full p-8 space-y-6 border lg:w-2/3 backdrop-blur-sm bg-white/5 rounded-xl border-orangeFance/30">
          {user ? (
            <h1 className="text-4xl font-bold text-white md:text-5xl drop-shadow-lg">
              Welcome back, <span className="text-orangeFance">{user.name}</span>! 
            </h1>
          ) : (
            <h1 className="text-4xl font-bold text-white md:text-5xl drop-shadow-lg">
              Fight Food Waste, <span className="text-orangeFance">Feed Communities</span>
              <FaLeaf className="inline ml-3 text-orangeFance" />
            </h1>
          )}

          <p className="max-w-2xl text-lg text-white/90 drop-shadow-md">
            {user
              ? "Ready to make an impact today?"
              : "Join our network of 150+ associations saving 5+ tons of food weekly"}
          </p>

          {/* Value icons */}
          <div className="flex flex-wrap gap-4 my-6">
            <div className="flex items-center px-4 py-2 text-white rounded-full bg-orangeFance/20">
              <FaHandHoldingHeart className="mr-2 text-orangeFance" />
              <span className="text-sm">1,200+ donations</span>
            </div>
            <div className="flex items-center px-4 py-2 text-white rounded-full bg-orangeFance/20">
              <FaRecycle className="mr-2 text-orangeFance" />
              <span className="text-sm">Zero-waste certified</span>
            </div>
          </div>

          {/* CTAs */}
          {user ? (
            user.role !== "association" ? (
              <Link to="/donation-needs" className="inline-block group">
                <Button 
                  className="px-6 py-3 mt-2 text-lg font-medium text-white transition-all duration-300 bg-orangeFance hover:bg-orange-800 group-hover:scale-105"
                  title={
                    <>
                      Browse Needs
                      <span className="ml-2">→</span>
                    </>
                  }
                />
              </Link>
            ) : (
              <Link to="/donation-needs" className="inline-block group">
                <Button 
                  className="px-6 py-3 mt-2 text-lg font-medium text-white transition-all duration-300 bg-orangeFance hover:bg-orange-800 group-hover:scale-105"
                  title={
                    <>
                      Post Your Needs 
                      <span className="ml-2">+</span>
                    </>
                  }
                />
              </Link>
            )
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/create-account" className="inline-block group">
                <Button 
                  className="px-6 py-3 text-lg font-medium text-white transition-all duration-300 bg-orangeFance hover:bg-orange-800 group-hover:scale-105"
                  title="Join Now"
                />
              </Link>
              <Link to="/about" className="inline-block group">
                <Button 
                  className="px-6 py-3 text-lg font-medium text-white transition-all duration-300 bg-transparent border-2 border-orangeFance hover:bg-orangeFance/10 group-hover:scale-105"
                  title="How It Works"
                />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute left-0 right-0 flex justify-center bottom-8">
        <div className="flex gap-6 px-6 py-3 font-medium text-white rounded-full shadow-lg bg-orangeFance">
          <div className="pr-6 text-center border-r border-white/30">
            <div>1,200+</div>
            <div className="text-xs font-light">Donations</div>
          </div>
          <div className="pr-6 text-center border-r border-white/30">
            <div>80+</div>
            <div className="text-xs font-light">Associations</div>
          </div>
          <div className="text-center">
            <div>5 Tons</div>
            <div className="text-xs font-light">Weekly Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;