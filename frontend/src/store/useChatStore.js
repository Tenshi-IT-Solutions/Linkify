import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      throw new Error("No user selected");
    }

    const socket = useAuthStore.getState().socket;
    if (!socket?.connected) {
      toast.error("Connection lost. Please refresh the page.");
      throw new Error("Socket not connected");
    }

    try {
      // First make the API call
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      
      // If API call succeeds, emit the message through socket
      socket.emit("sendMessage", {
        receiverId: selectedUser._id,
        text: messageData.text,
        image: messageData.image,
        messageId: res.data._id // Include the message ID from the API response
      });

      // Update local state with the new message
      set({ messages: [...messages, res.data] });
      
      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
      throw error;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      const { messages } = get();
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      
      if (isMessageSentFromSelectedUser) {
        set({
          messages: [...messages, newMessage],
        });
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error("Connection error. Please refresh the page.");
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("error");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
