import useInsurance from "@/hooks/UseInsurance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

interface TeamModalProps {
  isOpen: boolean;
  closeModal: () => void;
  editing: boolean;
  member: any;
  fetchMembers: () => void;
}

const TeamModal = ({
  isOpen,
  closeModal,
  editing,
  member = null,
  fetchMembers,
}: TeamModalProps) => {
  const { createTeam, updateTeam } = useInsurance();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      title: member?.title || "",
      name: member?.name || "",
      description: member?.description || "",
      image: null,
    },
  });

  const watchedImage = watch("image") as FileList | null;

  useEffect(() => {
    if (watchedImage && watchedImage?.length > 0) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [watchedImage]);

  const onSubmit = async (data: any) => {
    try {
      const formData: any = {
        title: data.title,
        name: data.name,
        description: data.description,
      };

      if (data.image && data.image.length > 0) {
        formData.image = data.image[0]; // assign actual File instance
      }

      if (editing && member?.id) {
        formData.id = member.id;
        await updateTeam(formData);
      } else {
        await createTeam(formData);
      }

      await fetchMembers();
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                  {editing ? "Edit Team Member" : "Add Team Member"}
                  <button onClick={closeModal}>
                    <MdCancel className="w-5 h-5 text-gray-500 hover:text-red-500" />
                  </button>
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      {...register("title", { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      placeholder="Enter title"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">
                        Title is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      {...register("name", { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      placeholder="Enter name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        Name is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register("description", { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      placeholder="Enter description"
                      rows={3}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        Description is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image")}
                      className="mt-1 block w-full"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-3 h-32 w-32 object-cover rounded-md border"
                      />
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-4 py-2 bg-[#7AB58D] hover:bg-[#6aa77e] text-white rounded-md shadow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <FaSpinner className="animate-spin mr-2" />
                      )}
                      {editing ? "Update Member" : "Add Member"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TeamModal;
