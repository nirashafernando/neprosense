import React, { useState, useEffect } from "react";
import {
  Users,
  Heart,
  Activity,
  User,
  Phone,
  Mail,
  Award,
  Briefcase,
  Calendar,
  Save,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMatches: 0,
    donorsAdded: 0,
    activeUsers: 0,
  });

  const [adminData, setAdminData] = useState({
    doctorName: "",
    doctorAge: "",
    doctorQualifications: "",
    professionalExperience: "",
    contactInformation: "",
  });

  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const donorCount = await simulateFirebaseFetch("donorDetails");

        const recipientCount = await simulateFirebaseFetch("recipientDetails");

        const totalMatches = 250;

        setStats({
          totalMatches,
          donorsAdded: donorCount,
          activeUsers: recipientCount,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const simulateFirebaseFetch = (collection) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (collection === "donorDetails") {
          resolve(50);
        } else if (collection === "recipientDetails") {
          resolve(200);
        }
      }, 500);
    });
  };

  const handleInputChange = (field, value) => {
    setAdminData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setUpdateSuccess(false);

    try {
      await simulateSaveToFirebase("adminDetails", {
        ...adminData,
        updatedAt: new Date().toISOString(),
        adminId: "admin_001",
      });

      setUpdateSuccess(true);

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving admin data:", error);
      alert("Error saving data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const simulateSaveToFirebase = (collection, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Saving to ${collection}:`, data);

        resolve();
      }, 1000);
    });
  };

  const statsCards = [
    {
      title: "Total matches processed",
      value: stats.totalMatches,
      icon: Activity,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Donors added",
      value: stats.donorsAdded,
      icon: Heart,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      title: "Active users/recipients",
      value: stats.activeUsers,
      icon: Users,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${stat.textColor} text-sm font-medium mb-1`}>
                    {stat.title}
                  </p>
                  <p className={`${stat.textColor} text-3xl font-bold`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="bg-gray-100 p-3 rounded-lg mr-4">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Doctor Admin Profile
            </h2>
            <p className="text-gray-600">
              Update your professional information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Doctor Name
              </label>
              <input
                type="text"
                value={adminData.doctorName}
                onChange={(e) =>
                  handleInputChange("doctorName", e.target.value)
                }
                placeholder="Enter doctor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Doctor Age
              </label>
              <input
                type="number"
                value={adminData.doctorAge}
                onChange={(e) => handleInputChange("doctorAge", e.target.value)}
                placeholder="Enter age"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-2" />
                Doctor Qualifications
              </label>
              <textarea
                value={adminData.doctorQualifications}
                onChange={(e) =>
                  handleInputChange("doctorQualifications", e.target.value)
                }
                placeholder="Enter qualifications (e.g., MBBS, MD, etc.)"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Professional Experience
              </label>
              <textarea
                value={adminData.professionalExperience}
                onChange={(e) =>
                  handleInputChange("professionalExperience", e.target.value)
                }
                placeholder="Enter professional experience"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Contact Information
              </label>
              <textarea
                value={adminData.contactInformation}
                onChange={(e) =>
                  handleInputChange("contactInformation", e.target.value)
                }
                placeholder="Enter contact information (phone, email, etc.)"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Updating..." : "Update"}</span>
          </button>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-center font-medium">
              Admin profile updated successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
