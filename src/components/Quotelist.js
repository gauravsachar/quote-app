import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchQuotes = async () => {
      try {
        const response = await axios.get(
          `https://assignment.stage.crafto.app/getQuotes?limit=${pagination.limit}&offset=${pagination.offset}
          `,
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (
          response.data &&
          response.data.data &&
          response.data.data.length === 0
        ) {
          setError("No more quotes available.");
        } else {
          const sortedQuotes = response.data.data.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Sort descending (newest first)
          });

          setQuotes((prevQuotes) => [...prevQuotes, ...sortedQuotes]);
        }
      } catch (err) {
        setError("Error fetching quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [pagination, navigate]);

  const loadMoreQuotes = () => {
    setPagination((prev) => ({
      limit: prev.limit,
      offset: prev.offset + prev.limit,
    }));
  };

  const handleCreateQuote = () => {
    navigate("/create-quote");
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hours = "" + d.getHours(),
      minutes = "" + d.getMinutes(),
      seconds = "" + d.getSeconds();

    // Add leading zeros for single-digit months, days, hours, minutes, and seconds
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;
    if (seconds.length < 2) seconds = "0" + seconds;

    // Return the formatted date with time in "YYYY-MM-DD HH:mm:ss" format
    return (
      [year, month, day].join("-") + " " + [hours, minutes, seconds].join(":")
    );
  }

  return (
    <div className="quote-list">
      {loading ? (
        <p>Loading quotes...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Quotes</h2>
          {quotes.map((quote, index) => (
            <div key={index} className="quote-card">
              <img
                src={quote.mediaUrl}
                alt="Quote"
                className="quote-image"
                height={80}
                width={80}
              />
              <div className="quote-overlay">{quote.text}</div>
              <p>
                <strong>{quote.username}</strong> |{" "}
                {formatDate(quote.createdAt)}
              </p>
            </div>
          ))}
          {quotes.length > 0 && (
            <button onClick={loadMoreQuotes}>Load More Quotes</button>
          )}
        </div>
      )}
      <span
        color="primary"
        aria-label="add"
        className="floating-button"
        onClick={handleCreateQuote}
        style={{ cursor: "pointer" }}
      >
        +
      </span>
    </div>
  );
};

export default QuoteList;
