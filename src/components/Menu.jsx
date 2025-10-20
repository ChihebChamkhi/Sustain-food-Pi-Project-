import { useNavigate } from "react-router-dom"; // Pour la navigation
import { FaGift, FaMoneyBillWave } from "react-icons/fa";
import { BiSolidDonateHeart } from "react-icons/bi";
import DishesCard from "../layouts/DishesCard";
import menu1 from "../assets/img/menu1.jpg";
import menu2 from "../assets/img/menu2.jpg";
import Button from "../layouts/Button";

// Données des plats
const dishesData = [
  { 
    img: menu1, 
    title: "Gourmet Pasta", 
    price: "$16.99", 
    discount: "-30%", 
    vendor: "Restaurant ABC", 
    location: "Paris, France", 
    availability: "Available until 8 p.m.", 
    vendorRating: 4.5 ,
    isBusiness: true
  },
  { 
    img: menu2, 
    title: "Grilled Salmon", 
    price: "$18.99", 
    discount: "-20%", 
    vendor: "Restaurant XYZ", 
    location: "New York, USA", 
    availability: "Available until 8 p.m.", 
    vendorRating: 4.8,
    isBusiness: false
  }
];

const Menu = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  // Fonction pour déterminer la page de redirection selon le rôle
  const handleSeeMore = () => {
    navigate("/login"); // Exemple de redirection vers la page de login
  };

  return (
    <div className="py-24 min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      {/* Titre */}
      <h1 className="text-4xl font-semibold text-center pb-6">
        Recent Food Listings
      </h1>

      {/* Description avec icônes en ligne */}
      <div className="flex justify-center items-center gap-8 text-gray-600 text-lg mb-6">
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-brightColor text-xl" />
          <span>Half price meal or less</span>
        </div>
        <div className="flex items-center gap-2">
          <FaGift className="text-brightColor text-xl" />
          <span>Surprise Bags</span>
        </div>
        <div className="flex items-center gap-2">
          <BiSolidDonateHeart className="text-brightColor text-xl" />
          <span>Support Associations</span>
        </div>
      </div>

      {/* Cartes des plats */}
      <div className="flex flex-wrap gap-6 justify-center">
        {dishesData.map((dish, index) => (
          <DishesCard
            key={index}
            img={dish.img}
            title={dish.title}
            price={dish.price}
            discount={dish.discount}
            vendor={dish.vendor}
            location={dish.location}
            availability={dish.availability}
            vendorRating={dish.vendorRating}
            isBusiness={dish.isBusiness}
          />
        ))}
      </div>

      {/* Bouton "Voir plus" qui redirige vers login */}
      <Button
       title="See more"
        onClick={handleSeeMore}
        className="mt-6 px-6 py-3 bg-brightColor text-white rounded-full hover:bg-orangeFance transition"/>
    </div>
  );
};

export default Menu;
