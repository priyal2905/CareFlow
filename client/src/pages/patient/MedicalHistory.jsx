import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const MedicalHistory = () => {
  const [records, setRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response =
          await api.get(
            "/medical-records/my-records"
          );

        setRecords(
          response.data.data || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load medical history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          style={{
            padding: "45px 0 30px",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
            }}
          >
            Medical History
          </h1>

          <p
            style={{
              color: "#697386",
              marginTop: "8px",
            }}
          >
            Your consultation records,
            diagnoses and prescriptions.
          </p>
        </div>

        {loading && (
          <Loading text="Loading medical records..." />
        )}

        {error && (
          <div
            className="card"
            style={{
              padding: "20px",
              color: "#d9534f",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          records.length === 0 && (
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
                📋
              </div>

              <h2>
                No medical records yet
              </h2>

              <p
                style={{
                  color: "#697386",
                  marginTop: "8px",
                }}
              >
                Your consultation records
                will appear here after
                appointments.
              </p>
            </div>
          )}

        <div
          style={{
            display: "grid",
            gap: "20px",
            paddingBottom: "60px",
          }}
        >
          {records.map(
            (record) => (
              <div
                className="card"
                key={
                  record._id ||
                  record.id
                }
                style={{
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom:
                      "25px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color:
                          "#697386",
                        fontSize:
                          "13px",
                      }}
                    >
                      Consultation
                    </p>

                    <h2
                      style={{
                        marginTop:
                          "5px",
                      }}
                    >
                      {record.diagnosis ||
                        "Medical Consultation"}
                    </h2>
                  </div>

                  <span
                    style={{
                      color:
                        "#176b87",
                      fontWeight:
                        700,
                    }}
                  >
                    {record.createdAt
                      ? new Date(
                          record.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div
                  className="grid grid-2"
                >
                  <div>
                    <h4
                      style={{
                        marginBottom:
                          "8px",
                      }}
                    >
                      Diagnosis
                    </h4>

                    <p
                      style={{
                        color:
                          "#697386",
                        lineHeight:
                          1.6,
                      }}
                    >
                      {record.diagnosis ||
                        "No diagnosis recorded."}
                    </p>
                  </div>

                  <div>
                    <h4
                      style={{
                        marginBottom:
                          "8px",
                      }}
                    >
                      Symptoms
                    </h4>

                    <p
                      style={{
                        color:
                          "#697386",
                        lineHeight:
                          1.6,
                      }}
                    >
                      {record.symptoms ||
                        "No symptoms recorded."}
                    </p>
                  </div>

                  <div>
                    <h4
                      style={{
                        marginBottom:
                          "8px",
                      }}
                    >
                      Prescription
                    </h4>

                    <p
                      style={{
                        color:
                          "#697386",
                        lineHeight:
                          1.6,
                      }}
                    >
                      {record.prescription ||
                        record.medications ||
                        "No prescription recorded."}
                    </p>
                  </div>

                  <div>
                    <h4
                      style={{
                        marginBottom:
                          "8px",
                      }}
                    >
                      Doctor's Notes
                    </h4>

                    <p
                      style={{
                        color:
                          "#697386",
                        lineHeight:
                          1.6,
                      }}
                    >
                      {record.notes ||
                        "No additional notes."}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicalHistory;