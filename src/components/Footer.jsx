const Footer = () => {
  return (
    <div className="bg-black text-white rounded-t-3xl mt-8 md:mt-0">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        {/* Logo et description */}
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">FoodieWeb</h1>
          <p className="text-sm">
          Initiative that brings together individuals, local businesses, cafes, and restaurants to fight against food waste while promoting sustainable practices.
          </p>
        </div>

        {/* Liens de navigation */}
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Links</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">Dishes</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">About</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">Menu</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">Reviews</a>
          </nav>
        </div>

        {/* Menu */}
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Menu</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">Our Dishes</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">Premium Menu</a>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Contact Us</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">FoodieWeb@email.com</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">+64 958 248 966</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">Social media</a>
          </nav>
        </div>
      </div>

      {/* Copyright avec date dynamique */}
      <div className="text-center py-4">
        <p>
          © {new Date().getFullYear()} Developed by 
          <span className="text-brightColor"> TECHNOVACREW </span> | All rights reserved
        </p>
      </div>
    </div>
  );
};
export default Footer;