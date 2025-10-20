import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { submitReview, getReviewsForBusiness } from "../../services/reviewService";
import { pipeline } from "@xenova/transformers";

export default function BusinessReviewPage() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviews, setReviews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);
  const generatorRef = useRef(null);
  const lastInputRef = useRef("");

  // Load business reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviewsForBusiness(id);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    loadReviews();
  }, [id]);

  // Load model with progress callback
  useEffect(() => {
    const loadModel = async () => {
      try {
        generatorRef.current = await pipeline(
          "text-generation",
          "Xenova/distilgpt2",
          {
            quantized: true,
            progress_callback: (progress) => {
              console.log(`Model loading: ${Math.round(progress * 100)}%`);
            }
          }
        );
        console.log("Model loaded successfully");
      } catch (err) {
        console.error("Model loading failed:", err);
      }
    };
    loadModel();
  }, []);

  // Analyze text sentiment
  const analyzeSentiment = (text) => {
    const positiveWords = ['good', 'great', 'excellent', 'awesome', 'happy', 'satisfied' ,'amazing'];
    const negativeWords = ['bad', 'awful', 'terrible', 'poor', 'disappointed', 'horrible'];
    
    const lowerText = text.toLowerCase();
    if (negativeWords.some(word => lowerText.includes(word))) return "negative";
    if (positiveWords.some(word => lowerText.includes(word))) return "positive";
    return "neutral";
  };

  // Create prompt based on sentiment
  const createPrompt = (text, sentiment) => {
    const sentimentHint = sentiment === "positive" ? "Keep it positive:" :
                        sentiment === "negative" ? "Keep it negative:" : "";
    
    return `Complete this business review naturally in one sentence. ${sentimentHint}
Original: "${text}"
Completion: "`;
  };

  // Process model outputs
  const processOutputs = (text, outputs, sentiment) => {
    return outputs
      .map(({ generated_text }) => {
        const completion = generated_text.split('Completion: "')[1]?.split('"')[0]?.trim() || "";
        
        if (completion.length < 5) return null;
        if (completion.includes("...")) return null;
        
        const completionSentiment = analyzeSentiment(completion);
        if (sentiment !== "neutral" && completionSentiment !== sentiment) return null;
        
        return `${text} ${completion.replace(/\.$/, '')}`;
      })
      .filter(Boolean)
      .slice(0, 2);
  };

  const getFallbackSuggestions = (text, sentiment) => {
    if (sentiment === "positive") {
      return [
        `${text} I was thoroughly impressed with everything!`,
        `${text} The service was absolutely outstanding.`,
        `${text} Couldn't have asked for a better experience!`,
        `${text} 10/10 would definitely recommend to others.`,
        `${text} The team went above and beyond my expectations.`,
        `${text} I'm so pleased with how everything turned out.`,
        `${text} This was hands down the best experience I've had.`,
        `${text} Wonderful from start to finish!`,
        `${text} The quality and attention to detail were remarkable.`,
        `${text} I left feeling completely satisfied and happy.`
      ];
    } else if (sentiment === "negative") {
      return [
        `${text} I was extremely dissatisfied with the service.`,
        `${text} This fell far short of what was promised.`,
        `${text} I regret my experience and wouldn't recommend it.`,
        `${text} The quality was unacceptable for the price paid.`,
        `${text} This was a complete disappointment from start to finish.`,
        `${text} I encountered multiple issues that ruined the experience.`,
        `${text} The service was subpar and needs significant improvement.`,
        `${text} My expectations were not met in any way.`,
        `${text} I was frustrated throughout the entire process.`,
        `${text} This was not worth the time or money invested.`
      ];
    }
    return [
      `${text} It was neither exceptionally good nor bad.`,
      `${text} My experience was fairly average overall.`,
      `${text} There were some positives but also room for improvement.`,
      `${text} I had a mixed experience with both highs and lows.`,
      `${text} It met my basic expectations but didn't exceed them.`,
      `${text} Some aspects were good while others could be better.`,
      `${text} It was okay, though not particularly memorable.`,
      `${text} The experience was adequate but unremarkable.`,
      `${text} I have no strong feelings either way about it.`,
      `${text} It was about what I expected - nothing more, nothing less.`
    ];
  };

  // Improved suggestion generator
  const generateSuggestions = useCallback(async (text) => {
    const trimmedText = text.trim();
    if (trimmedText.length < 5 || trimmedText === lastInputRef.current) {
      return;
    }
    lastInputRef.current = trimmedText;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (!generatorRef.current) return;

      setIsLoading(true);
      try {
        const sentiment = analyzeSentiment(trimmedText);
        const prompt = createPrompt(trimmedText, sentiment);

        const outputs = await generatorRef.current(prompt, {
          max_new_tokens: 30,
          temperature: sentiment === "negative" ? 0.7 : 0.5,
          do_sample: true,
          top_k: 40,
          repetition_penalty: 1.5,
          num_return_sequences: 2,
        });

        const processed = processOutputs(trimmedText, outputs, sentiment);
        setSuggestions(processed.length > 0 ? processed : getFallbackSuggestions(trimmedText, sentiment));
      } catch (error) {
        console.error("Suggestion error:", error);
        setSuggestions(getFallbackSuggestions(trimmedText, analyzeSentiment(trimmedText)));
      } finally {
        setIsLoading(false);
      }
    }, 350);
  }, []);

  // Handle content changes
  const handleContentChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    
    const lastPart = newText.split(/[.!?]/).pop().trim();
    if (lastPart.length >= 5) {
      generateSuggestions(lastPart);
    } else {
      setSuggestions([]);
    }
  };

  // Submit review handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await submitReview(id, content);
      setSuccess("Review submitted successfully!");
      setContent("");
      setReviews([result, ...reviews]);
      setSuggestions([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Memoized review item component
  const ReviewItem = React.memo(({ review }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{review.emoji}</span>
        <span className="text-yellow-500 font-bold">{review.score}/10</span>
      </div>
      <p className="text-gray-700">{review.content}</p>
      <div className="text-sm text-gray-500 mt-2">
        {new Date(review.createdAt).toLocaleDateString()}
      </div>
    </div>
  ));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Write a Review</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
        <div className="relative">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Describe your experience (e.g., 'The service was...')"
            required
          />

          {isLoading && (
            <div className="absolute right-3 bottom-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}

          {suggestions.length > 0 && !isLoading && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setContent(suggestion);
                    setSuggestions([]);
                  }}
                >
                  <div className="font-medium">{suggestion}</div>
                  <div className="text-xs text-blue-600 mt-1">AI Suggestion</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
