import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaCrown, FaArchive, FaBan, FaUndo, FaSearch } from "react-icons/fa";
import adminAxios from "../../Axios Instance/adminAxios";

const emptyFilters = {
  q: "",
  status: "",
  biodataType: "",
  division: "",
  occupation: "",
  minAge: "",
  maxAge: "",
};

const STATUS_BADGE = {
  active: "bg-forest/10 text-forest",
  archived: "bg-gold/20 text-gold-dark",
  blacklisted: "bg-maroon/10 text-maroon",
};

const AdminProfilesPage = () => {
  const [filters, setFilters] = useState(emptyFilters);
  const [draft, setDraft] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const limit = 15;
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-profiles", filters, page],
    queryFn: async () => {
      const params = { ...filters, page, limit };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const res = await adminAxios.get("/admin/profiles", { params });
      return res.data;
    },
    keepPreviousData: true,
  });

  const profiles = data?.profiles || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total ?? 0;

  const applyFilters = (e) => {
    e.preventDefault();
    setFilters(draft);
    setPage(1);
  };

  const resetFilters = () => {
    setDraft(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
  };

  const updateStatus = async (profile, status, verb) => {
    let reason = "";

    if (status !== "active") {
      const { value, isConfirmed } = await Swal.fire({
        title: `${verb} ${profile.name || "this profile"}?`,
        input: "text",
        inputLabel: "Reason (optional, kept internally)",
        inputPlaceholder: "e.g. Fake photos reported by another member",
        showCancelButton: true,
        confirmButtonText: `Yes, ${verb.toLowerCase()}`,
        confirmButtonColor: "#7A1F2B",
      });
      if (!isConfirmed) return;
      reason = value || "";
    } else {
      const { isConfirmed } = await Swal.fire({
        title: `Restore ${profile.name || "this profile"}?`,
        text: "The profile will become visible on the public site again.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, restore",
      });
      if (!isConfirmed) return;
    }

    try {
      await adminAxios.patch(`/admin/profiles/${profile._id}/status`, { status, reason });
      toast.success(`Profile ${status === "active" ? "restored" : status}`);
      queryClient.invalidateQueries(["admin-profiles"]);
      queryClient.invalidateQueries(["admin-stats"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-6">Manage Profiles</h1>

      <form onSubmit={applyFilters} className="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative lg:col-span-2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search name, email, mobile or biodata ID"
            value={draft.q}
            onChange={(e) => setDraft((f) => ({ ...f, q: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <select
          value={draft.status}
          onChange={(e) => setDraft((f) => ({ ...f, status: e.target.value }))}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="blacklisted">Blacklisted</option>
        </select>

        <select
          value={draft.biodataType}
          onChange={(e) => setDraft((f) => ({ ...f, biodataType: e.target.value }))}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          placeholder="Division / location"
          value={draft.division}
          onChange={(e) => setDraft((f) => ({ ...f, division: e.target.value }))}
          className="border rounded px-3 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="Occupation"
          value={draft.occupation}
          onChange={(e) => setDraft((f) => ({ ...f, occupation: e.target.value }))}
          className="border rounded px-3 py-2 text-sm"
        />

        <input
          type="number"
          placeholder="Min age"
          value={draft.minAge}
          onChange={(e) => setDraft((f) => ({ ...f, minAge: e.target.value }))}
          className="border rounded px-3 py-2 text-sm"
        />

        <input
          type="number"
          placeholder="Max age"
          value={draft.maxAge}
          onChange={(e) => setDraft((f) => ({ ...f, maxAge: e.target.value }))}
          className="border rounded px-3 py-2 text-sm"
        />

        <div className="flex gap-2 lg:col-span-4">
          <button type="submit" className="bg-maroon hover:bg-maroon-dark text-white px-5 py-2 rounded text-sm font-medium">
            Apply Filters
          </button>
          <button type="button" onClick={resetFilters} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded text-sm font-medium">
            Reset
          </button>
          <span className="ml-auto self-center text-sm text-gray-500">
            {isFetching ? "Updating…" : `${total} profile${total === 1 ? "" : "s"} found`}
          </span>
        </div>
      </form>

      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#2B211C] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Bio ID</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Gender</th>
              <th className="px-4 py-3 text-left font-semibold">Age</th>
              <th className="px-4 py-3 text-left font-semibold">Location</th>
              <th className="px-4 py-3 text-left font-semibold">Plan</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="9" className="text-center py-8 text-gray-500">Loading…</td></tr>
            ) : profiles.length ? (
              profiles.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.bioId}</td>
                  <td className="px-4 py-3 font-medium text-ink">{p.name || "—"}</td>
                  <td className="px-4 py-3 break-all">{p.email}</td>
                  <td className="px-4 py-3">{p.biodataType || "—"}</td>
                  <td className="px-4 py-3">{p.age || "—"}</td>
                  <td className="px-4 py-3">{p.presentDivision || p.permanentDivision || "—"}</td>
                  <td className="px-4 py-3">
                    {p.isPremium ? (
                      <span className="inline-flex items-center gap-1 text-gold-dark font-medium">
                        <FaCrown /> {p.planType}
                      </span>
                    ) : (
                      <span className="text-gray-400">Free</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {p.status !== "active" && (
                        <button
                          onClick={() => updateStatus(p, "active", "Restore")}
                          title="Restore to active"
                          className="p-2 rounded bg-forest/10 text-forest hover:bg-forest/20"
                        >
                          <FaUndo size={12} />
                        </button>
                      )}
                      {p.status !== "archived" && (
                        <button
                          onClick={() => updateStatus(p, "archived", "Archive")}
                          title="Archive"
                          className="p-2 rounded bg-gold/20 text-gold-dark hover:bg-gold/30"
                        >
                          <FaArchive size={12} />
                        </button>
                      )}
                      {p.status !== "blacklisted" && (
                        <button
                          onClick={() => updateStatus(p, "blacklisted", "Blacklist")}
                          title="Blacklist"
                          className="p-2 rounded bg-maroon/10 text-maroon hover:bg-maroon/20"
                        >
                          <FaBan size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="text-center py-8 text-gray-500">No profiles match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for small/medium screens */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading…</p>
        ) : profiles.length ? (
          profiles.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-ink">{p.name || "—"} <span className="text-gray-400 font-normal">#{p.bioId}</span></p>
                  <p className="text-xs text-gray-500 break-all">{p.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${STATUS_BADGE[p.status] || "bg-gray-100 text-gray-600"}`}>
                  {p.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <p>{p.biodataType || "—"}, {p.age || "—"}y</p>
                <p>{p.presentDivision || p.permanentDivision || "—"}</p>
                <p>
                  {p.isPremium ? (
                    <span className="inline-flex items-center gap-1 text-gold-dark font-medium"><FaCrown /> {p.planType}</span>
                  ) : (
                    <span className="text-gray-400">Free</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.status !== "active" && (
                  <button onClick={() => updateStatus(p, "active", "Restore")} className="flex-1 py-2 rounded bg-forest/10 text-forest text-xs font-semibold">Restore</button>
                )}
                {p.status !== "archived" && (
                  <button onClick={() => updateStatus(p, "archived", "Archive")} className="flex-1 py-2 rounded bg-gold/20 text-gold-dark text-xs font-semibold">Archive</button>
                )}
                {p.status !== "blacklisted" && (
                  <button onClick={() => updateStatus(p, "blacklisted", "Blacklist")} className="flex-1 py-2 rounded bg-maroon/10 text-maroon text-xs font-semibold">Blacklist</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No profiles match these filters.</p>
        )}
      </div>

      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
        >
          Prev
        </button>
        <span className="px-4 py-1 text-sm">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminProfilesPage;
