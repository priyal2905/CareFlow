import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const AdminPatients = () => {
  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response =
          await api.get(
            "/admin/patients"
          );

        setPatients(
          response.data.data || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients =
    patients.filter((patient) => {
      const text =
        `${patient.name || ""} ${
          patient.email || ""
        }`.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          style={{
            padding: "40px 0 25px",
          }}
        >
          <p
            style={{
              color: "#176b87",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            ADMIN
          </p>

          <h1
            style={{
              fontSize: "34px",
              marginTop: "5px",
            }}
          >
            Manage Patients
          </h1>
        </div>

        <div
          className="card"
          style={{
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <input
            className="input"
            placeholder="Search patients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {error && (
          <div
            style={{
              padding: "15px",
              background: "#fff0ef",
              color: "#d9534f",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <Loading text="Loading patients..." />
        ) : filteredPatients.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >
            No patients found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "15px",
              paddingBottom: "60px",
            }}
          >
            {filteredPatients.map(
              (patient) => (
                <div
                  className="card"
                  key={
                    patient._id ||
                    patient.id
                  }
                  style={{
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius:
                          "50%",
                        background:
                          "#eef8f7",
                        color:
                          "#176b87",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontWeight: 800,
                        fontSize:
                          "20px",
                      }}
                    >
                      {patient.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "P"}
                    </div>

                    <div>
                      <h3>
                        {patient.name ||
                          "Patient"}
                      </h3>

                      <p
                        style={{
                          color:
                            "#697386",
                          marginTop:
                            "5px",
                        }}
                      >
                        {patient.email}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPatients;