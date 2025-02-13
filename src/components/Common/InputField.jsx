/* eslint-disable react/prop-types */
/**
 * @param {object} args - Additional attributes for the input element
 * @param {string} value - The value of the input field
 * @param {function} setter - Function to update the value of the input
 */

export default function InputField({ value, setter, args = {} }) {
  return <input value={value} onChange={(e) => setter(e.target.value)} {...args} className="border-[1px] border-[#8C8C8C] rounded-xl p-3 w-full text-sm focus:outline-blue-400" />;
}
