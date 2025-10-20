import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import MapPicker from '../../components/MapPicker';



const donationNeedSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  needType: z.enum(
    [
      "bakery",
      "dairy",
      "fresh-produce",
      "cooked-meals",
      "packaged-goods",
      "other",
    ],
    {
      errorMap: () => ({ message: "Invalid need type selected" }),
    }
  ),
  quantity: z.number().positive("Quantity must be a positive number"),
  unit: z.enum(["kg", "g", "liters", "portions", "units"], {
    errorMap: () => ({ message: "Invalid unit selected" }),
  }),
  urgency: z
    .enum(["critical", "urgent", "flexible"], {
      errorMap: () => ({ message: "Invalid urgency level" }),
    })
    .default("flexible"),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Use YYYY-MM-DDTHH:mm format")
    .refine(
      (val) => new Date(val) > new Date(),
      "Deadline must be in the future"
    ),
  location: z.string().min(5, "Location must be at least 5 characters"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  pickupWindow: z
  .object({
    start: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time"),
    end: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time"),
  })
  .refine((data) => data.start < data.end, {
    message: "End time must be after start time",
    path: ["end"], 
  }),
  tags: z.array(z.string()).default([]),
});

const AddDonationNeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
    resolver: zodResolver(donationNeedSchema),
    defaultValues: {
      title: '',
      description: '',
      needType: '',
      quantity: 0,
      unit: '',
      urgency: 'flexible',
      deadline: '',
      location: '', 
      coordinates: { lat: 48.856614, lng: 2.3522219 },
      pickupWindow: { start: '', end: '' }, 
      tags: []
    },
    mode: "onChange",
  });

  const addTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags, { shouldValidate: true });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags, { shouldValidate: true });
  };



  const nextStep = async () => {
    const fieldToValidate =
      currentStep === 1
        ? ["title", "description", "needType", "quantity", "unit", "deadline"]
        : ["location", "coordinates", "pickupWindow.start", "pickupWindow.end"];

    const isValid = await trigger(fieldToValidate);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleLocationSelect = useCallback((locationData) => {
    setValue("location", locationData.address, { shouldValidate: true });
    setValue("coordinates", locationData.coordinates, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

     
      const deadlineDate = new Date(data.deadline);
      data.deadline = deadlineDate.toISOString();

      
      data.associationId = user.id;

     
      const response = await fetch("http://localhost:5000/api/donation-needs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create donation need");
      }


      setShowSuccess(true);
    setTimeout(() => {
      navigate("/donation-needs");
    }, 10000); 
  } catch (error) {
    console.error("Error submitting form:", error);
    setSubmitError(
      error.message || "Failed to create donation need. Please try again."
    );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Add New Donation Need
          </h1>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-full">
              <div className="relative">
                <div className="flex mb-2 items-center justify-between">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      currentStep >= 1
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep >= 2 ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      currentStep >= 2
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    2
                  </div>
                </div>
                <div className="flex text-xs justify-between">
                  <span className="text-center w-24">Basic Info</span>
                  <span className="text-center w-24">Location & Pickup</span>
                </div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6">
                  Step 1: Basic Information
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter a descriptive title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("description")}
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Describe what you need"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Need Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("needType")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.needType ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a type</option>
                    <option value="bakery">Bakery</option>
                    <option value="dairy">Dairy</option>
                    <option value="fresh-produce">Fresh Produce</option>
                    <option value="cooked-meals">Cooked Meals</option>
                    <option value="packaged-goods">Packaged Goods</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.needType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.needType.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("quantity", { valueAsNumber: true })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.quantity ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("unit")}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.unit ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select unit</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="liters">Liters</option>
                      <option value="portions">Portions</option>
                      <option value="units">Units</option>
                    </select>
                    {errors.unit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.unit.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    {...register("deadline")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.deadline ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.deadline && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deadline.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Step 2: Location & Pickup Details
                </h2>

                <div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">
    Location <span className="text-red-500">*</span>
  </label>
  <div className="mb-2">
    <input
      type="text"
      {...register("location")}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
        errors.location ? "border-red-500" : "border-gray-300"
      }`}
      placeholder="Address will update when you click the map"
      value={watch("location")}
      readOnly
    />
    {errors.location && (
      <p className="text-red-500 text-sm mt-1">
        {errors.location.message}
      </p>
    )}
  </div>

  <div className="mb-2">
  <div className="relative z-map"> 
    <MapPicker
      initialPosition={watch("coordinates")}
      onLocationSelect={handleLocationSelect}
      height="300px"
    />
    {(errors.coordinates?.lat || errors.coordinates?.lng) && (
      <p className="text-red-500 text-sm mt-1">
        Please select a location on the map
      </p>
    )}
    </div>
  </div>
</div>


                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Urgency <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("urgency")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.urgency ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="flexible">Flexible</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                  {errors.urgency && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.urgency.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Pickup Window Start{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register("pickupWindow.start")}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.pickupWindow?.start
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.pickupWindow?.start && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pickupWindow.start.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Pickup Window End <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register("pickupWindow.end")}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.pickupWindow?.end
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.pickupWindow?.end && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pickupWindow.end.message}
                      </p>
                    )}
                  </div>
                </div>

                {errors.pickupWindow &&
                  !errors.pickupWindow.start &&
                  !errors.pickupWindow.end && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.pickupWindow.message}
                    </p>
                  )}

<div className="mb-4">
  <label className="block text-gray-700 font-medium mb-2">
    Tags
  </label>
  <div className="flex items-center">
    <input
      type="text"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
        errors.tags ? "border-red-500" : "border-gray-300"
      }`}
      placeholder="Add tags (press Enter to add)"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addTag();
        }
      }}
    />
    <button
      type="button"
      onClick={addTag}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-r-md transition duration-300"
    >
      Add
    </button>
  </div>

  {/* Tags display */}
  <div className="flex flex-wrap gap-2 mt-2">
    {tags.map((tag, index) => (
      <div key={index} className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 flex items-center">
        {tag}
        <button
          type="button"
          onClick={() => removeTag(tag)}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-300 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  {showSuccess && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center inset-0 z-[50]">
    <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
      <div className="flex justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-green-600 mb-2">
        Need Created Successfully!
      </h3>
      <p className="text-gray-700 mb-6">
  Your donation need for <strong>{watch('title')}</strong> has been posted.
  Generous donors will now be able to see and respond to your request.
</p>
      <img 
        src="/images/Box.png" 
        alt="Need created successfully"
        className="w-48 mx-auto mb-6"
      />
      
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/donation-needs")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
        >
          View All Needs
        </button>
      </div>
    </div>
  </div>
)}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonationNeed;
