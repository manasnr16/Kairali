import React, { useState, useContext, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router';
import { AuthContext } from '../../../Contex/AuthProvider';
import axiosInstance from '../../../Axios Instance/axios';
import Swal from 'sweetalert2';
import Loader from '../../../Components/Loader';
import Avatar from '../../../Components/Avatar';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCrown,
  FaCheckCircle,
  FaBirthdayCake,
  FaRulerVertical,
  FaWeight,
  FaBriefcase,
  FaVenusMars,
  FaMapMarkerAlt,
  FaUserEdit,
  FaShareAlt,
  FaUsers,
} from 'react-icons/fa';

// The fields we consider when computing "profile completeness" — mirrors
// what a visitor actually sees on the public biodata card/detail page.
const COMPLETENESS_FIELDS = [
  'profileImage', 'name', 'dob', 'height', 'weight', 'occupation',
  'fatherName', 'motherName', 'permanentDivision', 'presentDivision',
  'mobile', 'expectedPartnerAge', 'expectedPartnerHeight',
];

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <span className="text-gold mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-ink font-medium break-words">{value ?? '—'}</p>
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
    <h3 className="text-maroon font-semibold subtitle-font text-lg mb-3 pb-3 border-b border-gray-100">
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">{children}</div>
  </div>
);

const ViewBiodata = () => {
  const { user, biodata, isError, isLoading, authUser, refetchAuthUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const completeness = useMemo(() => {
    if (!biodata) return 0;
    const filled = COMPLETENESS_FIELDS.filter((key) => {
      const value = biodata[key];
      return value !== undefined && value !== null && value !== '';
    }).length;
    return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
  }, [biodata]);

  const handlePremiumRequest = async (email) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to send request for premium biodata?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      setIsSending(true);
      try {
        await axiosInstance.patch(`/biodata/request-premium/${email}`, {
          bioId: biodata.bioId,
        });

        await refetchAuthUser();

        Swal.fire('Sent!', 'Your request has been sent to the admin.', 'success');
        setIsModalOpen(false);
      } catch {
        Swal.fire('Failed!', 'Something went wrong. Try again.', 'error');
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/biodata/${biodata.bioId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${biodata.name}'s Biodata`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      Swal.fire({ title: 'Link copied!', text: url, icon: 'success', timer: 2000, showConfirmButton: false });
    } catch {
      // user cancelled the native share sheet — nothing to do
    }
  };

  if (isLoading) return <Loader />;
  if (isError || !biodata) return <p className="text-center py-10 text-red-500">Biodata not found.</p>;

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-8 max-w-6xl mx-auto">
      {/* Profile header / cover */}
      <div className="relative rounded-2xl overflow-hidden shadow-md mb-16 sm:mb-20">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-maroon to-maroon-dark" />
        <div className="bg-white px-4 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <Avatar
              src={biodata?.profileImage || user?.photoURL}
              className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white shadow-lg mx-auto sm:mx-0 bg-gray-100"
            />
            <div className="flex-1 text-center sm:text-left pt-2 sm:pt-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-ink subtitle-font">{biodata?.name}</h1>
                {authUser?.isPremium && (
                  <span className="inline-flex items-center gap-1 bg-gold/15 text-gold-dark text-xs font-semibold px-2.5 py-1 rounded-full">
                    <FaCrown /> Premium
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-forest/10 text-forest text-xs font-semibold px-2.5 py-1 rounded-full">
                  <FaCheckCircle /> Email Verified
                </span>
              </div>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                {biodata?.age ? `${biodata.age} yrs` : ''}
                {biodata?.height ? ` • ${biodata.height} ft` : ''}
                {biodata?.occupation ? ` • ${biodata.occupation}` : ''}
                {biodata?.presentDivision ? ` • ${biodata.presentDivision}` : ''}
              </p>
              <p className="text-xs text-gray-400 mt-1">Biodata ID: KMM-{biodata?.bioId}</p>
            </div>

            <div className="flex sm:flex-col gap-2 justify-center pt-2 sm:pt-0">
              <Link
                to="/userDashboard/editbio"
                className="flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                <FaUserEdit /> Edit Profile
              </Link>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                <FaShareAlt /> Share
              </button>
            </div>
          </div>

          {/* Profile completeness */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Profile Completeness</span>
              <span className="font-semibold text-maroon">{completeness}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-maroon rounded-full transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
            {completeness < 100 && (
              <p className="text-xs text-gray-400 mt-1">
                Complete your biodata to get better matches —{' '}
                <Link to="/userDashboard/editbio" className="text-maroon hover:underline font-medium">
                  update now
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Detail sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Basic Details">
          <DetailRow icon={<FaVenusMars />} label="Biodata Type" value={biodata?.biodataType} />
          <DetailRow icon={<FaBirthdayCake />} label="Date of Birth" value={biodata?.dob} />
          <DetailRow icon={<FaBirthdayCake />} label="Age" value={biodata?.age ? `${biodata.age} years` : null} />
          <DetailRow icon={<FaRulerVertical />} label="Height" value={biodata?.height ? `${biodata.height} ft` : null} />
          <DetailRow icon={<FaWeight />} label="Weight" value={biodata?.weight ? `${biodata.weight} kg` : null} />
          <DetailRow icon={<FaBriefcase />} label="Profession" value={biodata?.occupation} />
        </SectionCard>

        <SectionCard title="Family Details">
          <DetailRow icon={<FaUsers />} label="Father's Name" value={biodata?.fatherName} />
          <DetailRow icon={<FaUsers />} label="Mother's Name" value={biodata?.motherName} />
          <DetailRow icon={<FaUsers />} label="Race / Community" value={biodata?.race} />
        </SectionCard>

        <SectionCard title="Location Details">
          <DetailRow icon={<FaMapMarkerAlt />} label="Permanent District" value={biodata?.permanentDivision} />
          <DetailRow icon={<FaMapMarkerAlt />} label="Current District" value={biodata?.presentDivision} />
        </SectionCard>

        <SectionCard title="Partner Preferences">
          <DetailRow icon={<FaBirthdayCake />} label="Preferred Age" value={biodata?.expectedPartnerAge} />
          <DetailRow icon={<FaRulerVertical />} label="Preferred Height" value={biodata?.expectedPartnerHeight ? `${biodata.expectedPartnerHeight} ft` : null} />
          <DetailRow icon={<FaWeight />} label="Preferred Weight" value={biodata?.expectedPartnerWeight ? `${biodata.expectedPartnerWeight} kg` : null} />
        </SectionCard>

        <SectionCard title="Contact Details">
          <DetailRow icon={<FaEnvelope />} label="Email" value={biodata?.email || user?.email} />
          <DetailRow icon={<FaPhoneAlt />} label="Mobile" value={biodata?.mobile} />
        </SectionCard>

        {/* Premium status / upgrade */}
        <div className="bg-gradient-to-br from-maroon to-maroon-dark rounded-2xl shadow-sm p-6 flex flex-col justify-center items-center text-center text-white">
          {authUser?.isPremium ? (
            <>
              <FaCrown className="text-gold text-3xl mb-2" />
              <p className="font-semibold text-lg">You're a Premium Member</p>
              <p className="text-white/70 text-sm mt-1">
                Plan: {authUser?.premiumPlan || 'Basic'}
              </p>
            </>
          ) : authUser?.premiumRequest ? (
            <>
              <FaCrown className="text-gold/70 text-3xl mb-2" />
              <p className="font-semibold text-lg">Premium Request Pending</p>
              <p className="text-white/70 text-sm mt-1">Our team will review it shortly.</p>
            </>
          ) : (
            <>
              <FaCrown className="text-gold text-3xl mb-2" />
              <p className="font-semibold text-lg">Go Premium</p>
              <p className="text-white/70 text-sm mt-1 mb-4">Get more visibility and unlock priority support.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 bg-gold hover:bg-gold-dark text-ink font-semibold rounded-lg transition"
              >
                Request Premium
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-3">Confirm Premium Request</Dialog.Title>
            <p className="text-gray-600">Are you sure you want to make your biodata premium?</p>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePremiumRequest(user?.email)}
                disabled={isSending}
                className="px-4 py-2 bg-maroon text-white rounded hover:bg-maroon-dark"
              >
                {isSending ? 'Sending...' : 'Yes, Make Premium'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewBiodata;
