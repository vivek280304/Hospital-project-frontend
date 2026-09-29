import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
} from "lucide-react";

import receptionistService from "../../services/receptionistService";

export default function ReceptionistProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data =
          await receptionistService.getProfile();

        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-5 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() =>
            navigate("/receptionist/dashboard")
          }
          className="flex items-center gap-2 text-slate-500 mb-6"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="bg-[#10264a] p-8 text-white">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                {(profile?.name || "R")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.name || "Receptionist"}
                </h1>

                <p className="text-blue-200">
                  Receptionist
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8">
              Loading...
            </div>
          ) : error ? (
            <div className="p-8 text-red-500">
              {error}
            </div>
          ) : (
            <div className="p-8 space-y-5">
              <div className="border rounded-xl p-5 flex items-center gap-4">
                <UserRound className="text-blue-600" />

                <div>
                  <p className="text-sm text-slate-400">
                    Full Name
                  </p>

                  <p className="font-semibold">
                    {profile?.name}
                  </p>
                </div>
              </div>

              <div className="border rounded-xl p-5 flex items-center gap-4">
                <Mail className="text-blue-600" />

                <div>
                  <p className="text-sm text-slate-400">
                    Email
                  </p>

                  <p className="font-semibold">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}