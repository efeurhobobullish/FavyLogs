import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { User, MapPin, Phone, Mail, Edit2, Save, X, LogOut, Package } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import api from "@/config/api";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "Nigeria",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update edited profile when user changes
  useEffect(() => {
    if (user) {
      setEditedProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "Nigeria",
        },
      });
    }
  }, [user]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      checkAuth().then((authUser) => {
        if (!authUser) {
          navigate("/auth");
        }
      });
    }
  }, [user, navigate, checkAuth]);

  // If no user, show loading or redirect
  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main max-w-4xl">
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setEditedProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "Nigeria",
        },
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update user profile via API - backend expects flat structure
      const response = await api.put("/v1/user/profile", {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        email: editedProfile.email,
        phone: editedProfile.phone,
        street: editedProfile.address.street,
        city: editedProfile.address.city,
        state: editedProfile.address.state,
        country: editedProfile.address.country,
      });
      
      if (response.data.success && response.data.user) {
        // Refresh auth to get updated user data
        await checkAuth();
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "address") {
        setEditedProfile({
          ...editedProfile,
          address: {
            ...editedProfile.address,
            [child as keyof typeof editedProfile.address]: value,
          },
        });
      }
    } else {
      setEditedProfile({
        ...editedProfile,
        [field as keyof Omit<typeof editedProfile, "address">]: value,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main max-w-4xl">
          {/* Header */}
          <div className="flex md:items-center justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-2">
                My Profile
              </h1>
              <p className="text-muted text-sm md:text-base">
                Manage your personal information and address
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
              >
                <Edit2 size={18} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  <span>{isLoading ? "Saving..." : "Save"}</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Details Card */}
              <div className="bg-secondary p-6 md:p-8">
                <h2 className="text-xl font-semibold text-main uppercase font-space mb-6 flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{user.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-main uppercase font-space mb-2">
                      <Mail size={16} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        disabled
                      />
                    ) : (
                      <p className="text-muted">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-main uppercase font-space mb-2">
                      <Phone size={16} />
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{user.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-secondary p-6 md:p-8">
                <h2 className="text-xl font-semibold text-main uppercase font-space mb-6 flex items-center gap-2">
                  <MapPin size={20} />
                  Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.address.street}
                        onChange={(e) => handleChange("address.street", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{user.address?.street || "Not set"}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address.city}
                          onChange={(e) => handleChange("address.city", e.target.value)}
                          className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        />
                      ) : (
                        <p className="text-muted">{user.address?.city || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                        State
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address.state}
                          onChange={(e) => handleChange("address.state", e.target.value)}
                          className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        />
                      ) : (
                        <p className="text-muted">{user.address?.state || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address.country}
                          onChange={(e) => handleChange("address.country", e.target.value)}
                          className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        />
                      ) : (
                        <p className="text-muted">{user.address?.country || "Nigeria"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <div className="bg-secondary p-6">
                <h3 className="text-lg font-semibold text-main uppercase font-space mb-4">
                  Account Summary
                </h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted">Member Since</span>
                    <span className="text-main font-semibold">
                      {user.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Email Verified</span>
                    <span className={`font-semibold ${user.isVerified ? "text-green-500" : "text-red-500"}`}>
                      {user.isVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <Link
                  to="/orders"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-main text-main font-space font-semibold uppercase text-sm hover:bg-main hover:text-background transition-all mb-3"
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-500 font-space font-semibold uppercase text-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
