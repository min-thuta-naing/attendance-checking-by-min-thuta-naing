import React from "react";

function RoleSelectComponent({ value, onChange, name }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none"
                required
            >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR Staff</option>
            </select>
        </div>
    );
}

export default RoleSelectComponent;
