import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

function PasswordInputComponent({ value, onChange, name, label }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={value}        // use parent value
                name={name}
                onChange={onChange}  // use parent handler
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none pr-10"
                required
            />
            <button
                type="button"
                className="absolute right-3 top-11 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                ) : (
                    <EyeIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    )
}

export default PasswordInputComponent;
