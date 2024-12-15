import React, { useEffect, useState } from "react";
import CourseLayout from "../layout/layout-course";
import { FaCertificate } from "react-icons/fa"; // Icon for certificate

const CertificatePage = () => {
  const materialsId = localStorage.getItem("material_id");
  const [certificate, setCertificate] = useState(null); // State to store the fetched certificate
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // State for error handling
  
  // Fetch the certificate details from the backend
  useEffect(() => {
    const fetchCertificate = async () => {
      // Check if materialsId exists before making the request
      if (!materialsId) {
        console.error("Materials ID is missing from localStorage.");
        setError("Materials ID is missing.");
        setLoading(false);
        return;
      }
      console.log("Materials ID:", materialsId);  // Log the materialsId

      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Auth token is missing");
          setError("Auth token is missing.");
          setLoading(false);
          return;
        }
        console.log("Auth token found:", token);  // Log the auth token

        // Make the API request with the auth token in the Authorization header
        const response = await fetch(`http://localhost:8000/generate-certificate/${materialsId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "token": token  // Correct token header
          },
        });

        console.log("Response status:", response.status); // Log the response status

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();
        console.log("Fetched certificate data:", data);  // Log the fetched certificate data
        setCertificate(data.certificate); // Assuming 'certificate' is the data key
      } catch (error) {
        console.error("Error fetching certificate:", error);
        setError(error.message);  // Set the error state if the API call fails
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [materialsId]); // Only re-run if materialsId changes
  
  if (loading) {
    return (
      <CourseLayout>
        <div className="h-screen flex flex-col items-center justify-center bg-secondary-light">
          <h2 className="text-3xl font-bold text-secondary-dark mb-4">Loading certificate...</h2>
        </div>
      </CourseLayout>
    );
  }

  if (error) {
    return (
      <CourseLayout>
        <div className="h-screen flex flex-col items-center justify-center bg-secondary-light">
          <h2 className="text-3xl font-bold text-secondary-dark mb-4">{error}</h2>
        </div>
      </CourseLayout>
    );
  }

  if (!certificate) {
    return (
      <CourseLayout>
        <div className="h-screen flex flex-col items-center justify-center bg-secondary-light">
          <h2 className="text-3xl font-bold text-secondary-dark mb-4">Certificate not found</h2>
        </div>
      </CourseLayout>
    );
  }

  return (
    <CourseLayout>
      <div className="h-screen flex flex-col items-center justify-start bg-secondary-light px-6 pt-12">
        {/* Certificate Details */}
        <div className="bg-white shadow-lg rounded-lg py-12 px-8 text-center max-w-3xl w-full">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-secondary-dark mb-4">
            Certificate of Completion
          </h2>

          {/* Check icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-yellow-100 rounded-full p-8">
              <FaCertificate className="text-yellow-500 text-5xl" />
            </div>
          </div>

          {/* Certificate Title */}
          <h3 className="text-xl font-semibold text-secondary-dark mb-4">
            {certificate.title}
          </h3>

          {/* Certificate Issuer */}
          <p className="text-lg text-secondary-dark mb-4">Issued by: {certificate.issuer}</p>

          {/* Certificate Issue Date */}
          <p className="text-gray-600 text-sm mb-6">Issued on: {certificate.issuedDate}</p>

          {/* Link to download or view certificate */}
          <a
            href={certificate.certificateLink} // This could be a link to a PDF or certificate details page
            className="bg-primary text-white font-bold text-lg px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
          >
            View Certificate
          </a>
        </div>
      </div>
    </CourseLayout>
  );
};

export default CertificatePage;
