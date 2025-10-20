import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const steps = [
  {
    title: "1. Sign Up",
    description: "Create an account and set your preferences.",
  },
  {
    title: "2. Find Food",
    description: "Browse available unsold food near you.",
  },
  {
    title: "3. Confirm & Reserve",
    description: "Confirm your choice and reserve your meal.",
  },
  {
    title: "4. Pick Up & Enjoy",
    description:
      "Go to the store at the indicated collection time, show your receipt, and enjoy your meal.",
  },
  {
    title: "5. You Made an Impact!",
    description:
      "You saved delicious meals from waste and did a great action for the planet!",
  },
];

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    document.title = "How It Works";
  }, []);

  return (
    <section className="py-12 text-white bg-brightColor">
      <div className="container px-4 mx-auto text-center">
        <h2 className="mb-8 text-3xl font-semibold">How It Works</h2>

        {/* Conteneur principal */}
        <div className="relative flex items-center justify-center">
          {/* Flèche gauche */}
          <button
            onClick={prevStep}
            className="absolute p-2 text-gray-800 transition bg-white rounded-full shadow-md left-4 hover:bg-gray-200"
          >
            <FaChevronLeft size={20} />
          </button>

          {/* Étape actuelle */}
          <div className="w-full max-w-md p-6 text-center text-gray-800 bg-white rounded-lg shadow-lg">
            <h3 className="mb-2 text-xl font-semibold">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {/* Flèche droite */}
          <button
            onClick={nextStep}
            className="absolute p-2 text-gray-800 transition bg-white rounded-full shadow-md right-4 hover:bg-gray-200"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* Bulles de navigation */}
        <div className="flex justify-center mt-6 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentStep === index ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
