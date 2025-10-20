import React, { useState } from 'react';
import { userSchema, businessSchema, individualSchema, associationSchema } from '../validators/validationSchemas';
import { registerUser } from '../services/api_auth';
import Button from "../layouts/Button";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SignUpForm = () => {
    const [userType, setUserType] = useState("individual");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: "",
        phoneNumber: "",
        companyName: "",
        matricule: "",
        description: "",
        organizationName: "",
        businessType: "",
        associationMatricule: "",
        role: "individual",
    });
    const [errors, setErrors] = useState({});

    const descriptions = {
        individual: {
            title: "Why join as an Individual?",
            text: "Get access to fresh food offers near you, reduce waste, and save money by reserving surplus food at discounted prices.",
        },
        business: {
            title: "Why register as a Business?",
            text: "Increase your visibility, reduce food waste, and make a positive impact by offering surplus food to individuals and associations.",
        },
        association: {
            title: "Why join as an Association?",
            text: "Get access to food donations and discounted offers to support your social initiatives and help those in need.",
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: "Passwords do not match"
            }));
            return;
        }

        let validationSchema;
        if (userType === "business") {
            validationSchema = businessSchema;
        } else if (userType === "individual") {
            validationSchema = individualSchema;
        } else if (userType === "association") {
            validationSchema = associationSchema;
        } else {
            validationSchema = userSchema;
        }

        try {
            // Validate the form data
            const result = validationSchema.safeParse(formData);
            if (!result.success) {
                const newErrors = {};
                result.error.errors.forEach(err => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
                return;
            }

            let userPayload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            };

            if (userType === "business") {
                userPayload = {
                    ...userPayload,
                    phone: formData.phone,
                    companyName: formData.companyName,
                    matricule: formData.matricule,
                    address: formData.address,
                    description: formData.description,
                    businessType: formData.businessType,
                };
            } else if (userType === "association") {
                userPayload = {
                    ...userPayload,
                    organizationName: formData.organizationName,
                    address: formData.address,
                    matricule: formData.associationMatricule,
                };
            } else {
                userPayload = {
                    ...userPayload,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                };
            }

            const response = await registerUser(userPayload);
            Swal.fire({
                title: 'Registration Successful!',
                text: 'Your account has been created successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ff7043',
            }).then(() => {
                window.dispatchEvent(new CustomEvent('showLoginSidebar'));
                navigate('/');
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message || "Registration failed. Please try again.",
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ff7043',
            });
        }
    };

    const getInputClassName = (fieldName) => {
        return `w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor ${
            errors[fieldName] ? 'border-red-500' : 'border-gray-300'
        }`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 py-24 bg-gray-100 md:flex-row">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg md:w-1/2">
                <h2 className="mb-6 text-2xl font-semibold text-center text-black">
                    Create an Account
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Select Account Type:
                    </label>
                    <select
                        value={userType}
                        onChange={(e) => {
                            setUserType(e.target.value);
                            setFormData((prevData) => ({
                                ...prevData,
                                role: e.target.value,
                            }));
                            setErrors({}); // Clear errors when user type changes
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                    >
                        <option value="individual">Individual</option>
                        <option value="business">Business</option>
                        <option value="association">Association</option>
                    </select>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name:</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className={getInputClassName('name')} 
                            required 
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className={getInputClassName('email')} 
                            required 
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className={getInputClassName('password')} 
                            required 
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            className={getInputClassName('confirmPassword')} 
                            required 
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    {userType === "individual" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                                <input 
                                    type="text" 
                                    name="phoneNumber" 
                                    value={formData.phoneNumber} 
                                    onChange={handleChange} 
                                    className={getInputClassName('phoneNumber')} 
                                    required 
                                />
                                {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Address:</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    className={getInputClassName('address')} 
                                    required 
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>
                        </>
                    )}

                    {userType === "business" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phone:</label>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className={getInputClassName('phone')} 
                                    required 
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Company Name:</label>
                                <input 
                                    type="text" 
                                    name="companyName" 
                                    value={formData.companyName} 
                                    onChange={handleChange} 
                                    className={getInputClassName('companyName')} 
                                    required 
                                />
                                {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Matricule:</label>
                                <input 
                                    type="text" 
                                    name="matricule" 
                                    value={formData.matricule} 
                                    onChange={handleChange} 
                                    className={getInputClassName('matricule')} 
                                    required 
                                />
                                {errors.matricule && <p className="mt-1 text-sm text-red-500">{errors.matricule}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Business Type:</label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className={getInputClassName('businessType')}
                                    required
                                >
                                    <option value="">Select Business Type</option>
                                    <option value="bakery">Bakery</option>
                                    <option value="pastry-shop">Pastry Shop</option>
                                    <option value="dairy-producer">Dairy Producer</option>
                                    <option value="supermarket">Supermarket</option>
                                    <option value="grocery-store">Grocery Store</option>
                                    <option value="farmers-market">Farmers Market</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="catering-service">Catering Service</option>
                                    <option value="convenience-store">Convenience Store</option>
                                    <option value="food-manufacturer">Food Manufacturer</option>
                                    <option value="wholesaler">Wholesaler</option>
                                    <option value="cafe">Café</option>
                                    <option value="school-cafeteria">School/University Cafeteria</option>
                                    <option value="hospital-cafeteria">Hospital Cafeteria</option>
                                    <option value="corporate-cafeteria">Corporate Cafeteria</option>
                                    <option value="food-truck">Food Truck</option>
                                    <option value="butcher-shop">Butcher Shop</option>
                                    <option value="fish-market">Fish Market</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.businessType && <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Address:</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    className={getInputClassName('address')} 
                                    required 
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description:</label>
                                <input 
                                    type="text" 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    className={getInputClassName('description')} 
                                />
                            </div>
                        </>
                    )}

                    {userType === "association" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Organization Name:</label>
                                <input 
                                    type="text" 
                                    name="organizationName" 
                                    value={formData.organizationName} 
                                    onChange={handleChange} 
                                    className={getInputClassName('organizationName')} 
                                    required 
                                />
                                {errors.organizationName && <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Matricule:</label>
                                <input 
                                    type="text" 
                                    name="associationMatricule" 
                                    value={formData.associationMatricule}
                                    onChange={handleChange}
                                    placeholder="12345678M"
                                    className={getInputClassName('associationMatricule')} 
                                    required 
                                />
                                <p className="mt-1 text-xs text-gray-500">Must be 8 digits followed by M (e.g., 12345678M)</p>
                                {errors.associationMatricule && <p className="mt-1 text-sm text-red-500">{errors.associationMatricule}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Address:</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    className={getInputClassName('address')} 
                                    required 
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>
                        </>
                    )}

                    <Button type="submit" title="Sign Up">Sign Up</Button>
                </form>
            </div>

            <div className="p-8 mt-6 text-center bg-white rounded-lg shadow-lg md:w-1/3 md:ml-12 md:mt-0 md:text-left">
                <h2 className="text-xl font-semibold text-black">{descriptions[userType].title}</h2>
                <p className="mt-3 text-gray-700">{descriptions[userType].text}</p>
            </div>
        </div>
    );
};

export default SignUpForm;