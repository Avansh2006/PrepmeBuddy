import { useUser } from "@clerk/clerk-react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    bio: "",
    img: "",
    insta: "",
    twitter: "",
    linkdin: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          gender: data.gender || "",
          address: data.address || "",
          bio: data.bio || "",
          img: data.img || "",
          insta: data.insta || "",
          twitter: data.twitter || "",
          linkdin: data.linkdin || "",
        });
      } else {
        setIsEditing(true);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? String(value) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (formData.phone.length < 10) {
      toast.error("Phone number must be at least 10 digits.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const ref = doc(db, "users", user.id);
      const dataToSave = { ...formData, role: "Student" }; // Hardcoded role
      await setDoc(ref, dataToSave);
      setUserData(dataToSave);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile. Try again.");
    }
  };

  if (!isLoaded) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div>Please log in to view your profile.</div>;

  const inputClass =
    "w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg text-black dark:text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-semibold text-center mb-6">Profile Page</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center md:w-1/3">
          <img
            src={formData.img || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border"
          />
          {isEditing && (
            <input
              type="text"
              name="img"
              placeholder="Image URL"
              className={`${inputClass} mt-4`}
              value={formData.img}
              onChange={handleChange}
            />
          )}
        </div>

        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <input name="name" placeholder="Name" className={inputClass} value={formData.name} onChange={handleChange} />
              <input name="email" placeholder="Email" className={inputClass} value={formData.email} onChange={handleChange} />
              <input name="phone" placeholder="Phone" className={inputClass} value={formData.phone} onChange={handleChange} />
              <input name="dob" placeholder="Date of Birth" className={inputClass} value={formData.dob} onChange={handleChange} />
              <select name="gender" className={inputClass} value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input name="address" placeholder="Address" className={inputClass} value={formData.address} onChange={handleChange} />
              <textarea name="bio" placeholder="Bio" className={`${inputClass} col-span-2`} rows={3} value={formData.bio} onChange={handleChange} />
              <input name="insta" placeholder="Instagram URL" className={inputClass} value={formData.insta} onChange={handleChange} />
              <input name="twitter" placeholder="Twitter URL" className={inputClass} value={formData.twitter} onChange={handleChange} />
              <input name="linkdin" placeholder="LinkedIn URL" className={inputClass} value={formData.linkdin} onChange={handleChange} />
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {userData?.name || "N/A"}</p>
              <p><strong>Email:</strong> {userData?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {userData?.phone || "N/A"}</p>
              <p><strong>Date of Birth:</strong> {userData?.dob || "N/A"}</p>
              <p><strong>Gender:</strong> {userData?.gender || "N/A"}</p>
              <p><strong>Address:</strong> {userData?.address || "N/A"}</p>
              <p className="col-span-2"><strong>Bio:</strong> {userData?.bio || "N/A"}</p>
              <p><strong>Instagram:</strong> <a href={userData?.insta} className="text-blue-500 underline">{userData?.insta}</a></p>
              <p><strong>Twitter:</strong> <a href={userData?.twitter} className="text-blue-500 underline">{userData?.twitter}</a></p>
              <p><strong>LinkedIn:</strong> <a href={userData?.linkdin} className="text-blue-500 underline">{userData?.linkdin}</a></p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
