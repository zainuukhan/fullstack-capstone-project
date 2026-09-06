import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const navigate = useNavigate();

    return (
        <div className="container text-center mt-5">
            <h1 className="display-3 fw-bold text-primary">GiftLink</h1>
            <p className="lead mt-3 text-secondary">
                Share the Joy of Giving – Connect, Donate, and Find Meaningful Gifts in Your Community.
            </p>
            <div className="mt-4">
                <button 
                    className="btn btn-primary btn-lg px-4" 
                    onClick={() => navigate('/app')}
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default MainPage;
