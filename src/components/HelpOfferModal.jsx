import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


const HelpOfferSchema = z.object({
    offerQuantity: z
      .number({ invalid_type_error: "Quantity is required" })
      .positive("Quantity must be a positive number")
      .refine(val => !isNaN(val), {
        message: "Quantity must be a valid number",
      }),
  
    message: z.string(),
    contactInfo: z.string().min(8, "Contact is required"),
  
    
    type: z.enum(["donation", "sale"]),

  pricePerUnit: z
    .preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional())
    .refine((val, ctx) => {
      if (ctx?.parent?.type === "sale" && (val === undefined || isNaN(val))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price per unit is required for sale",
        });
        return false;
      }
      return true;
    }),

  originalPrice: z
    .preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional())
    .refine((val, ctx) => {
      if (ctx?.parent?.type === "sale" && (val === undefined || isNaN(val))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Original price is required for sale",
        });
        return false;
      }
      return true;
    }),
  
  });
  
  
  const HelpOfferModal = ({ needId, onClose }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm({
      resolver: zodResolver(HelpOfferSchema),
      defaultValues: {
        offerQuantity: 1,
        message: "",
        contactInfo: "",
        type: "donation",
        pricePerUnit: "",
        originalPrice: "",
      },
    });
  
    const { user } = useAuth();
   
    const selectedType = watch("type");
  
    const onSubmit = async (formData) => {
        console.log("Form Data:", formData);
  console.log("Selected Type:", selectedType); 
  console.log("Price per unit:", formData.pricePerUnit);
  console.log("Original Price:", formData.originalPrice);

        console.log("Form Data:", formData);
      if (!user || !user._id) {
        alert("User not found. Please log in again.");
        return;
      }
  
      const payload = {
        ...formData,
        userId: user._id,
        needId,
      };
  
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        const response = await fetch("http://localhost:5000/api/help-offers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });
      
        const result = await response.json();
      
        if (!response.ok) {
          throw new Error(result.message || "Failed to create help offer");
        }
      
        setShowSuccess(true); 
        setTimeout(() => {
          setShowSuccess(false);
          onClose?.();
        }, 9000); 
      } catch (error) {
        console.error("Submit error:", error.message);
        setSubmitError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Help this Association</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" >Quantity <span className="text-red-500">*</span> </label>
        <input
          type="number"
          {...register("offerQuantity", { valueAsNumber: true })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.offerQuantity ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.offerQuantity && (
          <p className="text-red-500 text-sm">{errors.offerQuantity.message}</p>
        )}
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Message</label>
        <textarea
          {...register("message")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Contact Info <span className="text-red-500">*</span> </label>
        <input
          
          {...register("contactInfo")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.contactInfo ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.contactInfo && (
          <p className="text-red-500 text-sm">{errors.contactInfo.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Type <span className="text-red-500">*</span> </label>
        <select
          {...register("type")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.type ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="donation">Donation</option>
          <option value="sale">Sale</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>
      {submitError && (
        <p className="text-red-600 text-sm mt-2">Error: {submitError}</p>
      )}
      

          {/* Show these fields only when the type is "sale" */}
          {selectedType === "sale" && (
  <>
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Price per Unit</label>
      <input
        type="number"
        placeholder="Price per Unit"
        {...register("pricePerUnit", { 
          required: selectedType === "sale" && "Price per unit is required", 
          valueAsNumber: true 
        })}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          errors.pricePerUnit ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.pricePerUnit && (
        <p className="text-red-500 text-sm">{errors.pricePerUnit.message}</p>
      )}
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Original Price</label>
      <input
        type="number"
        placeholder="Original Price"
        {...register("originalPrice", {
          required: selectedType === "sale" && "Original price is required for sale",
          valueAsNumber: true
        })}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          errors.originalPrice ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.originalPrice && (
        <p className="text-red-500 text-sm">{errors.originalPrice.message}</p>
      )}
    </div>
  </>
)}

        <button
        type="submit"
        disabled={isSubmitting}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
      >
        {isSubmitting ? "Submitting..." : "Submit Help Offer"}
      </button>
      {showSuccess && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-green-600 mb-2">
          You're helping save food and fight hunger! ❤️
        </h3>
        <p className="text-gray-700">
          The association has been notified about your {selectedType === "donation" ? "donation" : "offer"}.
        </p>
        <p className="text-gray-600 mt-2">
          {selectedType === "donation" 
            ? "Please wait for their confirmation of pickup details."
            : "They will review your offer and contact you soon."}
        </p>
      </div>
      <img 
        src={selectedType === "donation" 
          ? "/images/donation.png" 
          : "/images/sharing.png"} 
        alt="Success"
        className="w-48 mx-auto mb-4"
      />
      <button
        onClick={() => {
          setShowSuccess(false);
          onClose?.();
        }}
        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
      >
        Close
      </button>
    </div>
  </div>
)}
        </form>
      </div>
    </div>
  );
};

export default HelpOfferModal;
