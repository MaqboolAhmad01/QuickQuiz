import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { apiFetch } from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


import "./OTPSent.css";
import Logo from "../components/logo/Logo";

const validateOTP = async (email, otp) => {

    const resp = await fetch(API_BASE_URL + "auth/verify-otp/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: { email, otp }
    }
    )
    console.log(resp);
    return resp.ok
};

const OTPSent = () => {

    const location = useLocation();
    const email = location.state?.email || localStorage.getItem("otp_email");
    localStorage.removeItem("otp_email");
    const navigate = useNavigate();
    // remove it

    console.log("Email from location state:", email);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateOTP(email, e.target.otp.value);
        if (!isValid) {
            toast.error("Invalid OTP!");
            return;
        } else {
            toast.success("OTP Verified.");
            navigate("/login");

        }
    };

    return (
        <div>
            <Logo />
            <Toaster />
            <div className="otp-sent-container">

                <div className="otp-sent-card">
                    <h1 className="otp-sent-title">Verify OTP</h1>
                    <form className="otp-form" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP here"
                                className="form-control"
                                required
                            />
                        </div>

                        <button type="submit" className="otp-submit-button">Verify OTP</button>
                        <div className="resend-otp-link">
                            <p>Didn't receive the OTP? <a href="/resent-otp">Resend OTP</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}


export default OTPSent;