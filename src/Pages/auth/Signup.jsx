import AOS from "aos";
import "aos/dist/aos.css";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowRight, FaCheck, FaEnvelope,
  FaExclamationCircle,
  FaEye, FaEyeSlash, FaGoogle, FaLock, FaSpinner,
  FaUser
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import signup from "../../assets/auth/sign-up.jpg";
import { useAuth } from "../../context/AuthContext";
import { apiServices } from "../../services/api";
import RoutesList from "../../utils/routesList";

// Validation Schema
const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      lastName: "",
      firstName: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      try {
        const res = await apiServices.register({
          email: values.email,
          password: values.password,
          lastName: values.lastName,
          firstName: values.firstName,
          confirmPassword: values.confirmPassword
        });

        const { accessToken, user } = res.data;
        login(accessToken, user);
        navigate("/home");

      } catch (err) {
        const message = err.response?.data?.message ||
          err.message ||
          "Registration failed. Please check your information.";
        setApiError(message);

        const form = document.querySelector("form");
        if (form) {
          form.animate([
            { transform: "translateX(0)" },
            { transform: "translateX(-10px)" },
            { transform: "translateX(10px)" },
            { transform: "translateX(0)" },
          ], { duration: 200 });
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formik.values.password);

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-amber-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4">
      <div
        className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        {/* Left Side - Image Section */}
        <div
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${signup})` }}
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
          <div
            className="max-w-md mx-auto"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <div className="mb-10">
              <h1 className="!text-4xl font-bold text-gray-500">
                Create <span className="text-orange-500">Account</span>
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Start your journey and discover amazing places around the world.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5" >
              {/* ✅ API Error Message */}
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700"
                  >
                    <FaExclamationCircle className="text-lg flex-shrink-0" />
                    <span className="text-sm">{apiError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* First Name & Last Name */}
              <div
                className="grid grid-cols-2 gap-4"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-100 border-2 ${formik.touched.firstName && formik.errors.firstName
                        ? "border-red-400"
                        : "border-transparent focus:border-orange-500"
                        } rounded-xl focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm`}
                      placeholder="first name"
                    />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {formik.errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      feedback={false} toggleMask={false}
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-100 border-2 ${formik.touched.lastName && formik.errors.lastName
                        ? "border-red-400"
                        : "border-transparent focus:border-orange-500"
                        } rounded-xl focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm`}
                      placeholder="last name"
                    />
                  </div>
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {formik.errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div data-aos="fade-left" data-aos-delay="500">
                <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-100 border-2 ${formik.touched.email && formik.errors.email
                      ? "border-red-400"
                      : "border-transparent focus:border-orange-500"
                      } rounded-xl focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm`}
                    placeholder="Enter your email"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠️</span> {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div data-aos="fade-left" data-aos-delay="600">
                <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 ${formik.touched.password && formik.errors.password
                      ? "border-red-400"
                      : "border-transparent focus:border-orange-500"
                      } rounded-xl focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formik.values.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= level
                            ? getStrengthColor()
                            : "bg-gray-200"
                            }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs font-bold text-right ${passwordStrength <= 2
                        ? "text-red-500"
                        : passwordStrength <= 4
                          ? "text-amber-500"
                          : "text-green-500"
                        }`}
                    >
                      {getStrengthText()} PASSWORD
                    </p>
                  </div>
                )}

                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠️</span> {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div data-aos="fade-left" data-aos-delay="700">
                <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 ${formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                      ? "border-red-400"
                      : formik.values.confirmPassword &&
                        !formik.errors.confirmPassword
                        ? "border-green-500"
                        : "border-transparent focus:border-orange-500"
                      } rounded-xl focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {formik.values.confirmPassword &&
                    !formik.errors.confirmPassword && (
                      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500">
                        <FaCheck />
                      </div>
                    )}
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <div data-aos="zoom-in" data-aos-delay="800">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xl" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div
              className="relative my-8"
              data-aos="fade-up"
              data-aos-delay="900"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-xs uppercase tracking-wider">
                  or sign up with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <div data-aos="fade-up" data-aos-delay="1000">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 group"
              >
                <FaGoogle className="text-xl text-gray-600 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 font-semibold group-hover:text-gray-900">
                  Google
                </span>
              </button>
            </div>

            {/* Sign In Link */}
            <p
              className="pt-6 text-center text-sm text-gray-500"
              data-aos="fade-up"
              data-aos-delay="1100"
            >
              Already have an account?{" "}
              <Link
                to={RoutesList.Login}
                className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
