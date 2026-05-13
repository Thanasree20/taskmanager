import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "https://taskmanager-oqou.onrender.com/api/auth/register",
        formData
      );

      alert("Registration successful");

      navigate("/");

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
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Name"
          required
          className="w-full bg-slate-800 text-white p-4 rounded-xl mb-4 outline-none border border-slate-700"
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
        />

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

        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition">

          Register

        </button>

        <p className="text-slate-300 text-center mt-6">

          Already have account?

          <Link
            to="/"
            className="text-blue-400 ml-2"
          >
            Login
          </Link>

        </p>

      </motion.form>

    </div>

  )

}

export default Register;