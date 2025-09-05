import { useState } from "react";
import { Bars3Icon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function Header({ title, menuItems, backNavigation = false }) {
    const [isDropdown, setIsDropdown] = useState(false);
    const navigate = useNavigate(); 

    const handleBackNavigation = () => {
        navigate(-1); // Goes back one step in history
    };


    return (
        <header className="fixed top-0 left-0 w-full bg-[#8294C4] shadow-md z-50">
            <div className="max-w-9xl mx-auto flex justify-between items-center px-6 py-4">
                
                {/*Back navigation*/}
                {backNavigation && (
                    <button
                        onClick={handleBackNavigation}
                        className="flex items-center justify-center border border-gray-600 rounded-lg bg-[#DBDFEA] shadow-lg hover:bg-[#ACB1D6] focus:outline-none"
                    >
                        <ArrowUturnLeftIcon className="h-8 w-8 text-gray-800" />
                    </button>
                )}

                {/*Page title*/}
                <h1 className="text-2xl text-gray-800">{title}</h1>

                {/*Menu bar*/}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdown(!isDropdown)}
                        className="flex items-center justify-center border border-gray-600 rounded-lg bg-[#DBDFEA] shadow-lg hover:bg-[#ACB1D6] focus:outline-none"
                    >
                        <Bars3Icon className="h-8 w-8 text-gray-800" />
                    </button>

                    {isDropdown && (
                        <div className="absolute right-0 mt-4 w-48 bg-[#DBDFEA] border rounded-lg shadow-lg z-50 overflow-hidden">
                            {menuItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className="flex w-full items-center justify-start gap-3 px-4 py-2 text-gray-700 hover:bg-[#ACB1D6]"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;




// function Header() {
//     const [isDropdown, setIsDropdown] = useState(false);
//     const navigate = useNavigate();

//     const handleClick = () => {
//         navigate("/profile");
//     };

//     return (
//         <header className="fixed top-0 left-0 w-full bg-[#8294C4] shadow-md z-50">
//             <div className="max-w-9xl mx-auto flex justify-between items-center px-6 py-4">

//                 <h1 className="text-2xl text-gray-800">Z Company</h1>

//                 <div className="relative">
//                     <button
//                         onClick={() => setIsDropdown(!isDropdown)}
//                         className="flex items-center justify-center border border-gray-600 rounded-lg bg-[#DBDFEA] shadow-lg hover:bg-[#ACB1D6] focus:outline-none"
//                     >
//                         <Bars3Icon className="h-8 w-8 text-gray-800" />
//                     </button>

//                     {isDropdown && (
//                         <div className="absolute right-0 mt-4 w-48 bg-[#DBDFEA] border rounded-lg shadow-lg z-50 overflow-hidden">
//                             <button
//                                 onClick={handleClick}
//                                 className="flex w-full items-center justify-start gap-3 px-4 py-2 text-gray-700 hover:bg-[#ACB1D6]"
//                             >
//                                 <UserIcon className="h-6 w-6 text-gray-800"/>
//                                 <span>Go to Profile</span>
//                             </button>
//                             <button
//                                 onClick={() => alert("Logging out...")} // replace with logout logic
//                                 className="flex w-full items-center justify-start gap-3 px-4 py-2 text-gray-700 hover:bg-[#ACB1D6]"
//                             >
//                                 <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-800" />
//                                 <span>Log Out</span>
//                             </button>
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </header>
//     );
// }

// export default Header;