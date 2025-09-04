import { useState } from "react";

function EmailInputComponent() {
    const [email, setEmail] = useState("");

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Email
            </label>
            <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none"
                required
            />
        </div>
    )
}

export default EmailInputComponent; 