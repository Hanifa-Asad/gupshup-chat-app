import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "https://gupshup-chat-app-gz05.onrender.com" : "/";

// const BASE_URL = import.meta.env.MODE === "development"
  // ? "http://localhost:5000"
  // : "https://gupshup-chat-app-gz05.onrender.com";

const BASE_URL = "https://gupshup-chat-app-gz05.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // checkAuth: async () => {
  //   try {
  //     const res = await axiosInstance.get("/auth/check");
  //     set({ authUser: res.data });
  //     get().connectSocket();
  //   } catch (error) {
  //     console.error("Error in checkAuth:", error);
  //     set({ authUser: null });
  //     toast.error(error?.response?.data?.message || "Failed to check auth");
  //   } finally {
  //     set({ isCheckingAuth: false });
  //   }
  // },


  checkAuth: async () => {
  try {
    const res = await axiosInstance.get("/auth/check");
    set({ authUser: res.data });
    get().connectSocket();
  } catch (error) {
    // Only show toast if backend responded with an actual error message
    if (error?.response?.status >= 500) {
      toast.error("Server error while checking auth");
    }

    // Silently reset auth if token/cookie missing or expired
    set({ authUser: null });
    get().disconnectSocket();
  } finally {
    set({ isCheckingAuth: false });
  }
},
   


//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       // const res = await axiosInstance.post("/auth/signup", data);
//       console.log("Signup API call →", axiosInstance.defaults.baseURL + "/auth/signup");

// await axiosInstance.post("/auth/signup", formData);

//       set({ authUser: res.data });
//       toast.success("Account created successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

signup: async (data) => {
  set({ isSigningUp: true });
  try {
    console.log("Signup API call →", axiosInstance.defaults.baseURL + "/auth/signup");

    const res = await axiosInstance.post("/auth/signup", data, { withCredentials: true });

    set({ authUser: res.data });
    toast.success("Account created successfully");
    get().connectSocket();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
  } finally {
    set({ isSigningUp: false });
  }
},


  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // logout: async () => {
  //   try {
  //     await axiosInstance.post("/auth/logout");
  //     set({ authUser: null, onlineUsers: [] }); // Reset online users on logout
  //     toast.success("Logged out successfully");
  //     get().disconnectSocket();
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Logout failed. Please try again.");
  //   }
  // },

  logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    // We still want to clear local state even if server logout fails
    console.error("Error in logout:", error);
  } finally {
    set({ authUser: null, onlineUsers: [] });
    toast.success("Logged out successfully");
    get().disconnectSocket();
  }
},


  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    newSocket.connect();
    set({ socket: newSocket });

    // Listen for online users
    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users }); // Update onlineUsers in the store
    });

    // Add more socket events here as needed
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null }); // Reset socket state on disconnect
    }
  },

  setOnlineUsers: (users) => {
    set({ onlineUsers: users }); // Explicitly setting online users in the store
  },
}));
