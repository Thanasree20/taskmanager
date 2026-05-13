import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaSignOutAlt,
  FaTrash
} from "react-icons/fa";

import { motion } from "framer-motion";

const Dashboard = () => {

  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium"
  });

  const fetchTasks = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: token
          }
        }
      );

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {

    if (!taskData.title) {
      return alert("Enter task title");
    }

    await axios.post(
      "http://localhost:5000/api/tasks",
      taskData,
      {
        headers: {
          Authorization: token
        }
      }
    );

    fetchTasks();

    setTaskData({
      title: "",
      description: "",
      priority: "Medium"
    });

  };

  const deleteTask = async (id) => {

    await axios.delete(
      `http://localhost:5000/api/tasks/${id}`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    fetchTasks();

  };

  const updateStatus = async (task, status) => {

    await axios.put(
      `http://localhost:5000/api/tasks/${task.id}`,
      {
        ...task,
        status
      },
      {
        headers: {
          Authorization: token
        }
      }
    );

    fetchTasks();

  };

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";

  };

  const filteredTasks = tasks.filter((task) => {

    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      task.status === filter;

    return matchesSearch && matchesFilter;

  });

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      {/* NAVBAR */}

      <div className="flex justify-between items-center px-8 py-5 border-b border-slate-700">

        <h1 className="text-3xl font-bold tracking-wide">
          TaskFlow
        </h1>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

      <div className="p-8">

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-300">
                  Total Tasks
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {tasks.length}
                </h2>

              </div>

              <FaTasks className="text-5xl text-blue-400" />

            </div>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-300">
                  Completed
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {completedTasks}
                </h2>

              </div>

              <FaCheckCircle className="text-5xl text-green-400" />

            </div>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-300">
                  Pending
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {pendingTasks}
                </h2>

              </div>

              <FaClock className="text-5xl text-yellow-400" />

            </div>

          </motion.div>

        </div>

        {/* CREATE TASK */}

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 mb-8">

          <h2 className="text-2xl font-semibold mb-5">
            Create Task
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Task title"
              value={taskData.title}
              className="bg-slate-800 border border-slate-600 p-3 rounded-lg outline-none"
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  title: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Description"
              value={taskData.description}
              className="bg-slate-800 border border-slate-600 p-3 rounded-lg outline-none"
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value
                })
              }
            />

            <select
              value={taskData.priority}
              className="bg-slate-800 border border-slate-600 p-3 rounded-lg outline-none"
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  priority: e.target.value
                })
              }
            >

              <option>Low</option>
              <option>Medium</option>
              <option>High</option>

            </select>

          </div>

          <button
            onClick={createTask}
            className="mt-5 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Add Task
          </button>

        </div>

        {/* SEARCH */}

        <div className="flex flex-col md:flex-row gap-4 mb-8">

          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 bg-slate-800 border border-slate-600 p-3 rounded-lg outline-none"
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="bg-slate-800 border border-slate-600 p-3 rounded-lg"
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>

          </select>

        </div>

        {/* TASKS */}

        {filteredTasks.length === 0 ? (

          <div className="text-center mt-20">

            <h2 className="text-3xl font-bold text-slate-400">
              No Tasks Found
            </h2>

          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-6">

            {filteredTasks.map((task) => (

              <motion.div
                key={task.id}
                whileHover={{
                  scale: 1.03
                }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10"
              >

                <div className="flex justify-between items-start">

                  <h2 className="text-2xl font-bold">
                    {task.title}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      task.priority === "High"
                        ? "bg-red-500"
                        : task.priority === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task.priority}
                  </span>

                </div>

                <p className="text-slate-300 my-4">
                  {task.description}
                </p>

                <div className="mb-4">

                  <p className="mb-2">
                    Status
                  </p>

                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(
                        task,
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg"
                  >

                    <option>Pending</option>
                    <option>Completed</option>

                  </select>

                </div>

                <button
                  onClick={() =>
                    deleteTask(task.id)
                  }
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-3 rounded-lg transition"
                >

                  <FaTrash />

                  Delete

                </button>

              </motion.div>

            ))}

          </div>

        )}

      </div>

    </div>

  )

}

export default Dashboard;