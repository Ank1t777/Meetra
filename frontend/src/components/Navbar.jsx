import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { useLocation } from "react-router";
import { logout } from "../lib/api";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import ThemeSelector from "../components/ThemeSelector";

const Navbar = () => {
    //get authenticated users
    const { authUser } = useAuthUser();
    //get location
    const location = useLocation();
    //check if it is in chat page
    const isChatPage = location.pathname?.startsWith('/chat');

    const queryClient = useQueryClient();

    const {mutate: logoutMutation} = useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    });
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center w-full">
            {/* LOGO ONLY IN CHAT PAGE  */}
                {isChatPage && (
                    <div className="pl-5">
                        <Link to="/" className="flex items-center gap-2.5">
                            <ShipWheelIcon className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r 
                            from-primary to-secondary tracking-wider">
                                Meetra
                            </span>
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                    <Link to={"/notifications"}>
                        <button className="btn btn-ghost btn-circle">
                            <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                        </button>
                    </Link>
                </div>

                <ThemeSelector />

                <div className="avatar">
                    <div className="w-9 rounded-full">
                        <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
                    </div>
                </div>
                {/* LOGOUT BUTTON */}
                <button className="btn btn-ghost btn-circle" onClick={ () => logoutMutation() }>
                    <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
