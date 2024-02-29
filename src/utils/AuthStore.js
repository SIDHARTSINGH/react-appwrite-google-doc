import { useEffect } from "react";
import { create } from "zustand";
import authService from "./authService";

const useAuthStore = create((set) => ({
  status: false,
  loading: false,
  user: null,
  setUser: (user) => set(() => ({ user })),
  setLoading: (loading) => set(() => ({ loading })),
  setStatus: () =>
    set((store) => ({
      status: !store.status,
    })),
}));

export const useAuth = () => {
  const { status, loading, user, setLoading, setUser, setStatus } =
    useAuthStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await authService.account.get();
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    checkAuthStatus();
  }, []);

  return { user, loading, status, setUser, setLoading, setStatus };
};

export default useAuthStore;
