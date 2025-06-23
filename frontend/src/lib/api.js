import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data; 
}

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
}

export const logout = async (logoutData) => {
    try {
        const response = await axiosInstance.post("/auth/logout", logoutData);
        return response.data;
    } catch (error) {
        console.log(logoutData.target)
        console.error("Error in logout:", error);
        throw error;
    }
};

export const getAuthUser = async () => {
   try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null;
    }
}

export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post('/auth/onboarding', userData);
    return response.data;
}

export const getUserFriends = async () => {
    const response = await axiosInstance.get('/users/friends');
    return response.data;
}

export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get('/user');
    return response.data;
}

export const outgoingFriendRequests = async () => {
    const response = await axiosInstance.get('/users/outgoing-friend-requests');
    return response.data;
}

export const sendFriendRequest = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export const getFriendRequests = async () => {
    const response = await axiosInstance.get('/users/friend-requests');
    return response.data;
}

export const acceptFriendRequest = async (requestId) => {
    const response = await axiosInstance.post(`/users/accept-friend-request/${requestId}`);
    return response.data;
}

export const getStreamToken = async () => {
    const response = await axiosInstance.get('/stream/token');
    return response.data;
}