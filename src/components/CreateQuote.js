// CreateQuote.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateQuote = () => {
  const navigate = useNavigate();
  const [quoteText, setQuoteText] = useState("");
  const [image, setImage] = useState(null);

  const [error, setError] = useState(""); // For error message

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", image);

    try {
      const uploadResponse = await axios.post(
        "https://crafto.app/crafto/v1.0/media/assignment/upload",
        formData,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );

      await axios.post(
        "https://assignment.stage.crafto.app/postQuote",
        {
          text: quoteText,
          mediaUrl: uploadResponse.data.mediaUrl,
          token,
        },
        {
          headers: {
            Authorization: `${token}`, // Add Authorization header
          },
        }
      );

      setQuoteText(""); // Clear the quote text field
      setImage(null); // Clear the selected image

      // Redirect to Quote List page after successful creation
      navigate("/quote-list");
    } catch (error) {
      setError("Failed to create quote.");
    }
  };

  return (
    <div>
      <h2>Create a New Quote</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your quote here"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          required
        />
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Create Quote</button>
        {error && (
          <p style={{ color: "red" }} className="error-message">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateQuote;
