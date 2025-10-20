// src/pages/EmailVerifiedPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EmailVerifiedPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const message = queryParams.get('message');

    useEffect(() => {
        if (status === 'success') {
            Swal.fire({
                title: 'Email Verified!',
                text: 'Your email has been successfully verified.',
                icon: 'success',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#ff7043',
            }).then(() => {
                navigate('/'); 
            });
        } else if (status === 'error') {
            Swal.fire({
                title: 'Error',
                text: message || 'Failed to verify your email. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ff7043',
            }).then(() => {
                navigate('/create-account'); 
            });
        }
    }, [status, message, navigate]);

    return <div className="p-6">Loading...</div>; 
};

export default EmailVerifiedPage;