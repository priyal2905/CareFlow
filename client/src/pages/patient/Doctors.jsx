import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] =
    useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/doctors");

        setDoctors(response.data.data || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load doctors."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const user = doctor.user || doctor;
    const profile = doctor.profile || doctor;

    const name =
      user.name?.toLowerCase() || "";

    const doctorSpecialization =
      profile.specialization?.toLowerCase() || "";

    const searchValue =
      search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      name.includes(searchValue) ||
      doctorSpecialization.includes(searchValue);

    const matchesSpecialization =
      !specialization ||
      doctorSpecialization ===
        specialization.toLowerCase();

    return (
      matchesSearch &&
      matchesSpecialization
    );
  });

  const specializations = [
    ...new Set(
      doctors
        .map((doctor) => {
          const profile =
            doctor.profile || doctor;

          return profile.specialization;
        })
        .filter(Boolean)
    ),
  ];

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <Loading text="Loading doctors..." />
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <section
          style={{
            padding: "45px 0 30px",
          }}
        >
          <p
            style={{
              color: "#176b87",
              fontWeight: 700,
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            CAREFLOW
          </p>

          <h1
            style={{
              fontSize: "36px",
              marginBottom: "8px",
            }}
          >
            Find a Doctor
          </h1>

          <p
            style={{
              color: "#697386",
            }}
          >
            Browse healthcare specialists and
            book your appointment.
          </p>
        </section>

        {error && (
          <div
            className="card"
            style={{
              padding: "18px",
              marginBottom: "25px",
              color: "#d9534f",
              background: "#fff0ef",
            }}
          >
            {error}
          </div>
        )}

        <section
          className="card"
          style={{
            padding: "25px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.5fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label className="label">
                Search
              </label>

              <input
                className="input"
                type="text"
                placeholder="Search by doctor name or specialization"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div>
              <label className="label">
                Specialization
              </label>

              <select
                className="input"
                value={specialization}
                onChange={(e) =>
                  setSpecialization(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Specializations
                </option>

                {specializations.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </section>

        {filteredDoctors.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "60px 30px",
              textAlign: "center",
              marginBottom: "60px",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                marginBottom: "15px",
              }}
            >
              🩺
            </div>

            <h2>
              No doctors found
            </h2>

            <p
              style={{
                color: "#697386",
                marginTop: "10px",
              }}
            >
              Try changing your search or
              specialization filter.
            </p>
          </div>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
              paddingBottom: "60px",
            }}
          >
            {filteredDoctors.map(
              (doctor) => {
                const user =
                  doctor.user || doctor;

                const profile =
                  doctor.profile || doctor;

                const doctorId =
                  doctor._id ||
                  doctor.user.id;

                return (
                  <div
                    className="card"
                    key={doctorId}
                    style={{
                      padding: "25px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "65px",
                          height: "65px",
                          borderRadius: "50%",
                          background:
                            "#e9f5f6",
                          color: "#176b87",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize: "25px",
                          fontWeight: 800,
                        }}
                      >
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "D"}
                      </div>

                      <div>
                        <h3>
                          Dr.{" "}
                          {user.name ||
                            "Doctor"}
                        </h3>

                        <p
                          style={{
                            color:
                              "#176b87",
                            fontWeight: 600,
                            fontSize:
                              "14px",
                            marginTop:
                              "4px",
                          }}
                        >
                          {profile.specialization ||
                            "Healthcare Specialist"}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop:
                          "1px solid #e7ebf0",
                        paddingTop: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <small
                            style={{
                              color:
                                "#697386",
                            }}
                          >
                            Qualification
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                              marginTop:
                                "3px",
                            }}
                          >
                            {profile.qualification ||
                              "Medical Professional"}
                          </strong>
                        </div>

                        <div>
                          <small
                            style={{
                              color:
                                "#697386",
                            }}
                          >
                            Experience
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                              marginTop:
                                "3px",
                            }}
                          >
                            {profile.experience ||
                              0}{" "}
                            years
                          </strong>
                        </div>

                        <div>
                          <small
                            style={{
                              color:
                                "#697386",
                            }}
                          >
                            Consultation Fee
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                              marginTop:
                                "3px",
                            }}
                          >
                            ₹
                            {profile.consultationFee ||
                              0}
                          </strong>
                        </div>
                      </div>

                      <Link
                        to={`/patient/doctors/${doctorId}`}
                        className="btn btn-primary"
                        style={{
                          display: "block",
                          textAlign:
                            "center",
                          width: "100%",
                          marginTop:
                            "20px",
                        }}
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                );
              }
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Doctors;