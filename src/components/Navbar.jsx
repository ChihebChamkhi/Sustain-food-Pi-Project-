import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { BiRestaurant, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import LoginSidebar from "./LoginSidebar";
import Button from "../layouts/Button";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menu, setMenu] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnnouncementsDropdownOpen, setIsAnnouncementsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isNeedsDropdownOpen, setIsNeedsDropdownOpen] = useState(false);
  
  const handleChange = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleAnnouncementsDropdown = () => setIsAnnouncementsDropdownOpen(!isAnnouncementsDropdownOpen);
  const toggleNeedsDropdown = () => setIsNeedsDropdownOpen(!isNeedsDropdownOpen);

  useEffect(() => {
    const handleShowLogin = () => setIsLoginOpen(true);
    window.addEventListener('showLoginSidebar', handleShowLogin);
    return () => {
      window.removeEventListener('showLoginSidebar', handleShowLogin);
    };
  }, []);

  return (
    <div className="fixed z-50 w-full">
      <div>
        <div className="flex flex-row justify-between p-5 px-5 bg-white shadow-md md:px-32">
          {/* Logo */}
          <div className="flex flex-row items-center cursor-pointer">
            <BiRestaurant size={32} />
            <Link to="">
              <h1 className="ml-2 text-xl font-semibold">SustainFood</h1>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="flex-row items-center hidden gap-8 text-lg font-medium lg:flex">
            <Link to="/" className="cursor-pointer hover:text-brightColor">
              Home
            </Link>
            <Link to="/about" className="cursor-pointer hover:text-brightColor">
              About
            </Link>

            {/* Simple Business Reviews Link (no dropdown) */}
            <Link to="/business-reviews" className="cursor-pointer hover:text-brightColor">
              Rate Our Partners
            </Link>

            {/* Needs Dropdown */}
            {!user ? (
              <span 
                className="cursor-pointer hover:text-brightColor" 
                onClick={() => setIsLoginOpen(true)} 
              >
                Needs
              </span>
            ) : user.role === "association" ? (
              <div className="relative group">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={toggleNeedsDropdown}
                >
                  <span className="hover:text-brightColor">Needs</span>
                  {isNeedsDropdownOpen ? <BiChevronUp size={25} /> : <BiChevronDown size={25} />}
                </div>
                {isNeedsDropdownOpen && (
                  <ul className="absolute p-5 space-y-2 bg-white border rounded-lg shadow-md">
                    <li>
                      <Link to="/donation-needs" className="cursor-pointer hover:text-brightColor">
                        Needs
                      </Link>
                    </li>
                    <li>
                      <Link to="/add-donation-need" className="cursor-pointer hover:text-brightColor">
                        Post a need
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-donation-needs" className="cursor-pointer hover:text-brightColor">
                        My Needs
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link to="/donation-needs" className="cursor-pointer hover:text-brightColor">
                Needs
              </Link>
            )}

            {/* Announcements Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAnnouncementsDropdown}>
                <span className="hover:text-brightColor">Announcements</span>
                {isAnnouncementsDropdownOpen ? <BiChevronUp size={25} /> : <BiChevronDown size={25} />}
              </div>
              {isAnnouncementsDropdownOpen && (
                <ul className="absolute p-5 space-y-2 bg-white border rounded-lg shadow-md">
                  <li>
                    {!user ? (
                      <span 
                        className="cursor-pointer hover:text-brightColor" 
                        onClick={() => {
                          setIsLoginOpen(true);
                          setIsAnnouncementsDropdownOpen(false);
                        }}
                      >
                        View Announcements
                      </span>
                    ) : (
                      <Link 
                      to={user.role === "association" ? "/association/announcements" : "/announcements"} 
                      className="cursor-pointer hover:text-brightColor">
                        View Announcements
                      </Link>
                    )}
                  </li>
                  <li>
                    {!user ? (
                      <span 
                        className="cursor-pointer hover:text-brightColor" 
                        onClick={() => {
                          setIsLoginOpen(true);
                          setIsAnnouncementsDropdownOpen(false);
                        }}
                      >
                        Add Announcement
                      </span>
                    ) : (
                      <Link to="/add-announcement" className="cursor-pointer hover:text-brightColor">
                        Add Announcement
                      </Link>
                    )}
                  </li>
                </ul>
              )}
            </div>

            {/* Support Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer" onClick={toggleDropdown}>
                <span className="hover:text-brightColor">Support</span>
                {isDropdownOpen ? <BiChevronUp size={25} /> : <BiChevronDown size={25} />}
              </div>
              {isDropdownOpen && (
                <ul className="absolute p-5 space-y-2 bg-white border rounded-lg shadow-md">
                  <li>
                    <Link to="/faq" className="cursor-pointer hover:text-brightColor">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="cursor-pointer hover:text-brightColor">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="cursor-pointer hover:text-brightColor">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/community-guidelines" className="cursor-pointer hover:text-brightColor">
                      Community Guidelines
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Conditionally Render Login or Logout Button */}
            {user ? (
              <>
                <Link 
                  to={user.role === "association" ? "/association-profile" : "/profile"} 
                  className="cursor-pointer hover:text-brightColor"
                >
                  Profile
                </Link>
                <Button title="Logout" onClick={logout} />
              </>
            ) : (
              <Button title="Login" onClick={() => setIsLoginOpen(true)} />
            )}
          </nav>
          
          {/* Menu Hamburger (Mobile) */}
          <div className="flex items-center lg:hidden">
            {menu ? (
              <AiOutlineClose size={25} onClick={handleChange} />
            ) : (
              <AiOutlineMenuUnfold size={25} onClick={handleChange} />
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menu && (
          <div className="px-5 py-4 bg-white md:px-32 lg:hidden">
            <nav className="flex flex-col gap-4 text-lg font-medium">
              <Link to="/" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/about" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                About
              </Link>

              {/* Mobile Business Reviews Link (simple link) */}
              <Link to="/business-reviews" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                Rate Our Partners
              </Link>

              {/* Needs Dropdown */}
              {!user ? (
                <span 
                  className="cursor-pointer hover:text-brightColor" 
                  onClick={() => {
                    setIsLoginOpen(true);
                    closeMenu();
                  }}
                >
                  Needs
                </span>
              ) : user.role === "association" ? (
                <div className="relative group">
                  <div 
                    className="flex items-center gap-1 cursor-pointer" 
                    onClick={toggleNeedsDropdown}
                  >
                    <span className="hover:text-brightColor">Needs</span>
                    {isNeedsDropdownOpen ? <BiChevronUp size={25} /> : <BiChevronDown size={25} />}
                  </div>
                  {isNeedsDropdownOpen && (
                    <ul className="p-2 pl-4 mt-2 space-y-2 border-l-2 border-brightColor">
                      <li>
                        <Link to="/donation-needs" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                          Needs
                        </Link>
                      </li>
                      <li>
                        <Link to="/add-donation-need" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                          Post a need
                        </Link>
                      </li>
                      <li>
                        <Link to="/my-donation-needs" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                          My Needs
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link to="/donation-needs" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                  Needs
                </Link>
              )}
              
              {/* Mobile Announcements Dropdown */}
              <div className="relative">
                <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAnnouncementsDropdown}>
                  <span className="hover:text-brightColor">Announcements</span>
                  {isAnnouncementsDropdownOpen ? <BiChevronUp size={25} /> : <BiChevronDown size={25} />}
                </div>
                {isAnnouncementsDropdownOpen && (
                  <ul className="p-2 pl-4 mt-2 space-y-2 border-l-2 border-brightColor">
                    <li>
                      {!user ? (
                        <span 
                          className="cursor-pointer hover:text-brightColor" 
                          onClick={() => {
                            setIsLoginOpen(true);
                            setIsAnnouncementsDropdownOpen(false);
                            closeMenu();
                          }}
                        >
                          View Announcements
                        </span>
                      ) : (
                        <Link to="/announcements" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                          View Announcements
                        </Link>
                      )}
                    </li>
                    <li>
                      {!user ? (
                        <span 
                          className="cursor-pointer hover:text-brightColor" 
                          onClick={() => {
                            setIsLoginOpen(true);
                            setIsAnnouncementsDropdownOpen(false);
                            closeMenu();
                          }}
                        >
                          Add Announcement
                        </span>
                      ) : (
                        <Link to="/add-announcement" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                          Add Announcement
                        </Link>
                      )}
                    </li>
                  </ul>
                )}
              </div>
              
              {/* Mobile Support Dropdown */}
              <div className="relative">
                <div className="flex items-center gap-1 cursor-pointer" onClick={toggleDropdown}>
                  <span className="hover:text-brightColor">Support</span>
                  {isDropdownOpen ? <BiChevronUp size={25} /> : <BiChevronDown size={25} />}
                </div>
                {isDropdownOpen && (
                  <ul className="p-2 pl-4 mt-2 space-y-2 border-l-2 border-brightColor">
                    <li>
                      <Link to="/faq" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="/community-guidelines" className="cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                        Community Guidelines
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              
              {/* Mobile Login/Logout Button */}
              <div className="mt-2">
                {user ? (
                  <>
                    <Link to="/profile" className="block mb-2 cursor-pointer hover:text-brightColor" onClick={closeMenu}>
                      Profile
                    </Link>
                    <Button title="Logout" onClick={() => {
                      logout();
                      closeMenu();
                    }} />
                  </>
                ) : (
                  <Button title="Login" onClick={() => {
                    setIsLoginOpen(true);
                    closeMenu();
                  }} />
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Login Sidebar */}
        <LoginSidebar isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </div>
  );
};

export default Navbar;