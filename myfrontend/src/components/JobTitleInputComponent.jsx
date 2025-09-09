function JobTitleInputComponent({ value, onChange, name }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Job Title
            </label>
            <input
                type="text"
                name={name}
                placeholder="Receptionist"
                value={value}
                onChange={onChange} 
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none"
                required
            />
        </div>
    )
}

export default JobTitleInputComponent;
