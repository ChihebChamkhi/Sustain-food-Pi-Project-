import { BiRestaurant } from "react-icons/bi";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-white">
      <div className="relative">
        {/* Cercle qui tourne */}
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brightColor"></div>

        {/* Icône centrée */}
        <div className="absolute inset-0 flex justify-center items-center">
          <BiRestaurant className=" text-3xl" />
        </div>
      </div>
    </div>
  );

export default LoadingSpinner;