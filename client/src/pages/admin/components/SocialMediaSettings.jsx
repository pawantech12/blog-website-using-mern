import { useForm } from "react-hook-form";
import { useAuth } from "../../../store/Authentication";
import { useEffect } from "react";

const SocialMediaSettings = ({ onSocialMediaSubmit, loading }) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user && user.user && user.user.socialMedia) {
      setValue("facebook", user.user.socialMedia.facebook || "");
      setValue("twitter", user.user.socialMedia.twitter || "");
      setValue("instagram", user.user.socialMedia.instagram || "");
      setValue("linkedin", user.user.socialMedia.linkedin || "");
    }
  }, [user, setValue]);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Social Media Links</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSocialMediaSubmit)}>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Facebook:</label>
          <input
            type="url"
            className="border border-gray-300 p-3 text-sm rounded-md outline-none"
            placeholder={`https://facebook.com/yourprofile`}
            {...register("facebook")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Twitter:</label>
          <input
            type="url"
            className="border border-gray-300 p-3 text-sm rounded-md outline-none"
            placeholder={`https://twitter.com/yourprofile`}
            {...register("twitter")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Instagram:</label>
          <input
            type="url"
            className="border border-gray-300 p-3 text-sm rounded-md outline-none"
            placeholder={`https://instagram.com/yourprofile`}
            {...register("instagram")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">LinkedIn:</label>
          <input
            type="url"
            className="border border-gray-300 p-3 text-sm rounded-md outline-none"
            placeholder={`https://linkedin.com/yourprofile`}
            {...register("linkedin")}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-custom-light-black text-white px-6 py-2 rounded-md hover:bg-black transition-colors duration-300 text-sm font-medium"
        >
          {loading ? "Saving Links..." : "Save Links"}
        </button>
      </form>
    </div>
  );
};

export default SocialMediaSettings;
