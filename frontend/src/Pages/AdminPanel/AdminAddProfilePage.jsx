import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import adminAxios from "../../Axios Instance/adminAxios";
import { AuthContext } from "../../Contex/AuthProvider";
import { DIVISIONS, HEIGHTS, WEIGHTS, OCCUPATIONS, RACES } from "../../data/biodataOptions";

const inputClass = (hasError) =>
  `w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-gold ${
    hasError ? "border-red-500" : "border-gray-300"
  }`;

const Field = ({ label, error, message = "This field is required.", className = "", children }) => (
  <div className={className}>
    <label className="block mb-2 font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{message}</p>}
  </div>
);

const AdminAddProfilePage = () => {
  const { uploadImage, uploading } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setValue("profileImage", url, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await adminAxios.post("/admin/profiles", data);
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["biodatas"] });

      await Swal.fire({
        icon: "success",
        title: "Profile published",
        text: `Biodata ID ${res.data?.data?.bioId} is now live on the website.`,
        confirmButtonColor: "#7A1F2B",
      });
      navigate("/admin/dashboard/profiles");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Could not create profile",
        text: error.response?.data?.message || error.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const select = (name, placeholder, options) => (
    <select {...register(name, { required: true })} className={inputClass(errors[name])}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2">Add Profile</h1>
      <p className="text-gray-500 text-sm mb-6">
        Creates a profile with the same fields a member fills in. It is published on the website immediately.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700"
      >
        <Field label="Biodata Type *" error={errors.biodataType}>
          <div className="flex gap-6">
            {["Male", "Female"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={type}
                  {...register("biodataType", { required: true })}
                  className="accent-maroon"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Name *" error={errors.name}>
          <input {...register("name", { required: true })} className={inputClass(errors.name)} placeholder="Full name" />
        </Field>

        <Field label="Upload Profile Image *" error={errors.profileImage} message="Profile image is required.">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded border border-gray-300 cursor-pointer hover:border-gold transition"
          />
          {uploading && <p className="text-blue-500 text-xs mt-1">Uploading...</p>}
          <input
            {...register("profileImage", { required: true })}
            className={`${inputClass(false)} mt-2 text-sm`}
            placeholder="…or paste an image URL"
          />
        </Field>

        <Field label="Mobile Number *" error={errors.mobile}>
          <input
            {...register("mobile", { required: true })}
            className={inputClass(errors.mobile)}
            placeholder="e.g. +91XXXXXXXXXX"
          />
        </Field>

        <Field label="Date of Birth *" error={errors.dob}>
          <input type="date" {...register("dob", { required: true })} className={inputClass(errors.dob)} />
        </Field>

        <Field label="Height *" error={errors.height}>
          {select("height", "Select height", HEIGHTS)}
        </Field>

        <Field label="Weight (kg) *" error={errors.weight}>
          {select("weight", "Select weight", WEIGHTS)}
        </Field>

        <Field label="Age *" error={errors.age} message="Please enter a valid age (18+).">
          <input
            type="number"
            {...register("age", { required: true, min: 18 })}
            className={inputClass(errors.age)}
            placeholder="Age"
          />
        </Field>

        <Field label="Profession *" error={errors.occupation}>
          {select("occupation", "Select occupation", OCCUPATIONS)}
        </Field>

        <Field label="Race (Skin Color) *" error={errors.race}>
          {select("race", "Select skin color", RACES)}
        </Field>

        <Field label="Father's Name *" error={errors.fatherName}>
          <input
            {...register("fatherName", { required: true })}
            className={inputClass(errors.fatherName)}
            placeholder="Father's full name"
          />
        </Field>

        <Field label="Mother's Name *" error={errors.motherName}>
          <input
            {...register("motherName", { required: true })}
            className={inputClass(errors.motherName)}
            placeholder="Mother's full name"
          />
        </Field>

        <Field label="Permanent District *" error={errors.permanentDivision}>
          {select("permanentDivision", "Select district", DIVISIONS)}
        </Field>

        <Field label="Current District *" error={errors.presentDivision}>
          {select("presentDivision", "Select district", DIVISIONS)}
        </Field>

        <Field label="Preferred Age *" error={errors.expectedPartnerAge}>
          <input
            type="number"
            {...register("expectedPartnerAge", { required: true })}
            className={inputClass(errors.expectedPartnerAge)}
            placeholder="Expected age"
          />
        </Field>

        <Field label="Preferred Height *" error={errors.expectedPartnerHeight}>
          {select("expectedPartnerHeight", "Select height", HEIGHTS)}
        </Field>

        <Field label="Preferred Weight *" error={errors.expectedPartnerWeight}>
          {select("expectedPartnerWeight", "Select weight", WEIGHTS)}
        </Field>

        <Field
          label="Contact Email *"
          error={errors.email}
          message="A valid email is required."
          className="md:col-span-2"
        >
          <input
            type="email"
            {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
            className={inputClass(errors.email)}
            placeholder="Member's contact email"
          />
        </Field>

        <div className="md:col-span-2 text-center mt-2">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-8 py-3 bg-gradient-to-r from-maroon to-gold text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Publishing…" : "Save And Publish Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProfilePage;
