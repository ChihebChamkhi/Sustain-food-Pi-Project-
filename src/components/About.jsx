import img from "../assets/img/about.jpg";
import Button from "../layouts/Button";
import { FaLeaf, FaRecycle, FaClock, FaUtensils } from "react-icons/fa"; // Icons


const About = () => {
  useEffect(() => {
    document.title = "About";
  }, []);
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 py-24 lg:flex-row lg:px-32">
      {/* Image Section */}
      <div className="flex justify-center lg:w-1/2">
        <img src={img} alt="Sustainable Food" className="w-3/4 rounded-lg shadow-lg" />
      </div>

      {/* Text Section */}
      <div className="space-y-6 lg:w-1/2 lg:pl-10">
        <h1 className="text-4xl font-semibold text-center md:text-start">
          Why Use SustainFood?
        </h1>
        <p className="text-lg text-gray-600">
          Join us in the fight against food waste while enjoying delicious meals at great prices.
        </p>

        {/* Icons & Features */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <FaLeaf className="text-3xl text-brightColor" />
            <p className="font-medium text-brightColor">Protect the environment by reducing food waste</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaRecycle className="text-3xl text-brightColor" />
            <p className="font-medium text-brightColor">Save food near you</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaClock className="text-3xl text-brightColor" />
            <p className="font-medium text-brightColor">Enjoy meals at half price, or less</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaUtensils className="text-3xl text-brightColor" />
            <p className="font-medium text-brightColor">Discover new local merchants</p>
          </div>
        </div>

        {/* Call-To-Action Button */}
        <div className="flex justify-center lg:justify-start">
          <Button title="Join Now" />
        </div>
      </div>
    </div>
  );
};

export default About;
