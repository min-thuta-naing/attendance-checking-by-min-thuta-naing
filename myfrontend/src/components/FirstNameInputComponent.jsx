function FirstNameInputComponent({ value, onChange, name }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                First Name
            </label>
            <input
                type="text"
                name={name}
                placeholder="Jane"
                value={value}
                onChange={onChange} 
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none"
                required
            />
        </div>
    )
}

export default FirstNameInputComponent;
