import { BsStarFill, BsShop } from "react-icons/bs";
import { FaMapMarkerAlt, FaClock, FaTag, FaUser } from "react-icons/fa";
import Button from "../layouts/Button";

const DishesCard = (props) => {
  return (
    <div className="w-full sm:w-3/4 md:w-2/5 lg:w-2/5 p-6 shadow-lg rounded-lg bg-white flex flex-col">
      {/* 🏷️ Business/Individual Badge */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold text-white rounded-full 
          ${props.isBusiness ? "bg-blue-600" : "bg-green-600"}`}
      >
        {props.isBusiness ? "Business" : "Individual"}
      </span>

      {/* 🍽️ Dish Image */}
      <img className="rounded-xl w-full h-52 object-cover" src={props.img} alt="Dish" />

      <div className="flex-1 flex flex-col space-y-3 justify-between mt-4">
        {/* 🍽️ Dish Title */}
        <h3 className="font-semibold text-center text-2xl">{props.title}</h3>

        {/* 🏪 Vendor Name + Rating */}
        <div className="flex justify-between items-center text-gray-700">
          <div className="flex items-center gap-2 font-semibold text-lg">
            {props.isBusiness ? <BsShop className="text-brightColor" /> : <FaUser className="text-green-500" />}
            {props.vendor}
          </div>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <BsStarFill
                key={index}
                className={`text-${props.vendorRating >= index + 1 ? "brightColor" : "gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* 📍 Location */}
        <div className="flex items-center gap-2 text-gray-600 text-lg">
          <FaMapMarkerAlt className="text-red-500" />
          {props.location}
        </div>

        {/* 💰 Price + Discount */}
        <div className="flex justify-between items-center text-xl font-semibold">
          <span className="text-gray-800">{props.price}</span>
          <span className="text-white bg-red-600 rounded-full px-3 py-1 text-sm">
            <FaTag className="inline-block mr-1" />
            {props.discount}
          </span>
        </div>

        {/* ⏳ Availability */}
        <div className="flex items-center gap-2 text-green-600 text-lg font-semibold">
          <FaClock />
          {props.availability}
        </div>
      </div>

      {/* Centered Reserve Button */}
      <div className="flex justify-center mt-4 mb-4">
        <Button title="Reserve" />
      </div>
    </div>
  );
};


export default DishesCard;
