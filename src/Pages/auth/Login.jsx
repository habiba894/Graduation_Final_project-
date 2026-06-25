import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowRight, FaEnvelope, FaExclamationCircle, FaEye, FaEyeSlash, FaGoogle, FaLock, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import pyramids from "../../assets/auth/signin.jpg";
import { useAuth } from "../../context/AuthContext";
import { apiServices } from "../../services/api"; 
import RoutesList from "../../utils/routesList";

// Validation Schema
const validationSchema = yup.object({
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
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [apiError, setApiError] = useState(""); 

  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");

      try {
        const res = await apiServices.login({
          email: values.email,
          password: values.password,
        });

        const { accessToken, user } = res.data;
        login(accessToken, user);

        navigate("/home");

      } catch (err) {
        const message = err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials.";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const floatingVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 0.3,
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4 relative">
      {/* Background Animated Shapes */}
      <motion.div className="absolute top-20 left-20 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" variants={floatingVariants} initial="hidden" animate="animate" />
      <motion.div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" variants={floatingVariants} initial="hidden" animate="animate" style={{ animationDelay: "2s" }} />
      <motion.div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl" variants={floatingVariants} initial="hidden" animate="animate" style={{ animationDelay: "4s" }} />

      {/* Mouse follow effect */}
      <motion.div className="absolute w-96 h-96 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-full blur-3xl pointer-events-none" animate={{ x: mousePosition.x * 10, y: mousePosition.y * 10 }} transition={{ type: "spring", stiffness: 50, damping: 30 }} />

      {/* المحتوى الرئيسي */}
      <div className="flex w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative z-10">

        {/* الجانب الأيسر: الصورة */}
        <motion.div className="hidden lg:block lg:w-1/2 relative" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="absolute inset-0 overflow-hidden rounded-l-3xl">
            <img src={pyramids} alt="Pyramids" className="w-full h-full object-cover object-center" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 via-amber-600/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center items-start px-12 text-white text-left">
              <motion.h2 initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-3xl drop-shadow-lg tracking-wide font-bold">Discover Egypt</motion.h2>
              <motion.h3 initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-4xl font-bold text-white mt-2 drop-shadow-md">Waiting for you</motion.h3>
              <motion.p initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="text-lg text-white pt-4 font-medium">Your journey begins here. Experience the magic of ancient civilization.</motion.p>
            </div>
          </div>
        </motion.div>

        {/* الجانب الأيمن: الفورم */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-tr-full" />

          <motion.div className="max-w-md mx-auto relative z-10" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="mb-10">
              <h1 className="!text-4xl font-bold !text-gray-500">Welcome Back</h1>
              <p className="text-gray-500 text-sm leading-relaxed">please sign in to continue your journey and discover breathtaking destinations across the world.</p>
            </motion.div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">

              {/* ✅ رسالة خطأ من الـ API */}
              <AnimatePresence>
                {apiError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
                    <FaExclamationCircle className="text-lg flex-shrink-0" />
                    <span className="text-sm">{apiError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 ${formik.touched.email && formik.errors.email ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-orange-500"} rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 placeholder-gray-400`} placeholder="Enter your email" />
                  <motion.div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500" initial={{ width: "0%" }} whileFocus={{ width: "100%" }} transition={{ duration: 0.3 }} />
                </div>
                <AnimatePresence>
                  {formik.touched.email && formik.errors.email && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {formik.errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-all">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input type={showPassword ? "text" : "password"} name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 ${formik.touched.password && formik.errors.password ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-orange-500"} rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 placeholder-gray-400`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-all duration-200">
                    <motion.div key={showPassword ? "hide" : "show"} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </motion.div>
                  </button>
                </div>
                <AnimatePresence>
                  {formik.touched.password && formik.errors.password && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {formik.errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 group">
                  {isLoading ? (
                    <><FaSpinner className="animate-spin text-xl" /><span>Signing In...</span></>
                  ) : (
                    <><span>Sign In</span><FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center"><span className="px-4 bg-white/55 text-gray-400 text-xs font-semibold uppercase tracking-wider">or continue with</span></div>
            </motion.div>

            {/* Google Button */}
            <motion.div variants={itemVariants}>
              <button type="button" className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group">
                <FaGoogle className="text-xl text-gray-600 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 font-semibold group-hover:text-gray-900">Google</span>
              </button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.p variants={itemVariants} className="pt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to={RoutesList.Signup}
                className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
              >
                Sign Up
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;