import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      alert(
        error?.response?.data?.message
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96 border border-white/10"
      >

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Welcome Back
        </h1>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full bg-slate-800 text-white p-4 rounded-xl mb-4 outline-none border border-slate-700"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full bg-slate-800 text-white p-4 rounded-xl mb-6 outline-none border border-slate-700"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value
            })
          }
        />

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition">

          Login

        </button>

        <p className="text-slate-300 text-center mt-6">

          No account?

          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >
            Register
          </Link>

        </p>

      </motion.form>

    </div>

  )

}

export default Login;