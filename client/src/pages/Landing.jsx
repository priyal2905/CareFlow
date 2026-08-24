import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="page">

      <nav
        style={{
          background: "white",
          borderBottom:
            "1px solid #e7ebf0",
        }}
      >
        <div
          className="container"
          style={{
            height: "72px",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
          }}
        >
          <div
            style={{
              fontFamily:
                "Manrope",
              fontSize:
                "25px",
              fontWeight: 800,
              color:
                "#176b87",
            }}
          >
            CareFlow
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Link
              to="/login"
              className="btn btn-secondary"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section
          className="container"
          style={{
            padding:
              "90px 0 70px",
            display: "grid",
            gridTemplateColumns:
              "1.1fr 0.9fr",
            gap: "60px",
            alignItems:
              "center",
          }}
        >

          <div>
            <div
              style={{
                display:
                  "inline-block",
                padding:
                  "7px 12px",
                borderRadius:
                  "20px",
                background:
                  "#e9f5f6",
                color:
                  "#176b87",
                fontWeight:
                  700,
                fontSize:
                  "13px",
                marginBottom:
                  "20px",
              }}
            >
              Smart Healthcare
              Management
            </div>

            <h1
              style={{
                fontSize:
                  "clamp(40px, 5vw, 65px)",
                lineHeight:
                  1.05,
                marginBottom:
                  "22px",
              }}
            >
              Healthcare
              appointments,
              <br />
              made{" "}
              <span
                style={{
                  color:
                    "#176b87",
                }}
              >
                effortless.
              </span>
            </h1>

            <p
              style={{
                fontSize:
                  "18px",
                lineHeight:
                  1.7,
                color:
                  "#697386",
                maxWidth:
                  "600px",
                marginBottom:
                  "30px",
              }}
            >
              CareFlow connects
              patients, doctors
              and healthcare
              administrators in
              one intelligent
              appointment
              management
              platform.
            </p>

            <div
              style={{
                display:
                  "flex",
                gap: "12px",
              }}
            >
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  padding:
                    "14px 24px",
                }}
              >
                Book an Appointment
              </Link>

              <Link
                to="/login"
                className="btn btn-secondary"
                style={{
                  padding:
                    "14px 24px",
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "30px",
              background:
                "#eef8f7",
            }}
          >
            <div
              style={{
                fontSize:
                  "14px",
                color:
                  "#697386",
                marginBottom:
                  "10px",
              }}
            >
              Your healthcare,
              organized.
            </div>

            <h2
              style={{
                fontSize:
                  "28px",
                marginBottom:
                  "25px",
              }}
            >
              Everything in
              one place
            </h2>

            {[
              [
                "01",
                "Find trusted doctors",
              ],
              [
                "02",
                "Book convenient slots",
              ],
              [
                "03",
                "Manage appointments",
              ],
              [
                "04",
                "Track your medical history",
              ],
            ].map(
              ([number, text]) => (
                <div
                  key={number}
                  style={{
                    display:
                      "flex",
                    gap: "15px",
                    padding:
                      "15px 0",
                    borderBottom:
                      "1px solid rgba(23,32,51,.08)",
                  }}
                >
                  <strong
                    style={{
                      color:
                        "#176b87",
                    }}
                  >
                    {number}
                  </strong>

                  <span>
                    {text}
                  </span>
                </div>
              )
            )}
          </div>

        </section>
      </main>

    </div>
  );
};

export default Landing;