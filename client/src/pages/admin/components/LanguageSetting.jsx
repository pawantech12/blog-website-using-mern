import { IoChevronDownOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../store/Authentication";
import { useEffect } from "react";

const LanguageSetting = ({ loading, onLanguageSubmit }) => {
  const { register, handleSubmit, setValue } = useForm();
  const { user } = useAuth();

  useEffect(() => {
    setValue("language", user?.user?.language || "");
  }, [user, setValue]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Language</h2>
      {/* Dropdown or buttons to select theme */}
      <form onSubmit={handleSubmit(onLanguageSubmit)}>
        <div className="relative w-fit">
          <select
            className="block appearance-none w-full border border-gray-300 bg-white text-gray-700 py-3 px-4 pr-10 rounded-md text-sm font-medium outline-none"
            {...register("language", { required: true })}
          >
            <option value="" disabled>
              Select Language
            </option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none">
            <IoChevronDownOutline
              className="h-5 w-5 text-gray-600"
              aria-hidden="true"
            />
          </div>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="bg-custom-light-black text-white px-6 py-2 rounded-md hover:bg-black transition-colors duration-300 mt-3 text-sm font-medium"
        >
          {loading ? "Saving..." : "Save Language"}
        </button>
      </form>
    </div>
  );
};

export default LanguageSetting;
