import React, { useState } from "react";

const Blog = () => {
  // Sample blog data with more detailed information
  const blogPosts = [
    {
      id: 1,
      title: "How to Reduce Food Waste in Your Daily Life",
      description: "Discover practical tips and strategies to minimize food waste, save money, and help the environment through simple changes to your shopping and cooking habits.",
      image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Sustainability",
      tags: ["food waste", "eco-friendly", "tips"],
      date: "May 15, 2023",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Sustainable Eating: Nourish Yourself and the Planet",
      description: "Learn how to adopt sustainable eating habits that benefit both your health and the environment, including seasonal eating and plant-based alternatives.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Health",
      tags: ["sustainability", "nutrition", "healthy living"],
      date: "June 2, 2023",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "The Transformative Power of Food Donations",
      description: "Explore how food donations can make a significant impact on communities in need while reducing food waste in your local area.",
      image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Community",
      tags: ["donations", "social impact", "volunteering"],
      date: "April 28, 2023",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "Zero-Waste Cooking: Recipes and Techniques",
      description: "Master the art of cooking delicious meals while minimizing food waste with these innovative techniques and creative recipes.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Cooking",
      tags: ["cooking", "zero waste", "recipes"],
      date: "March 15, 2023",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Composting 101: Turn Waste into Garden Gold",
      description: "A beginner's guide to composting at home, transforming your food scraps into nutrient-rich soil for your garden.",
      image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Sustainability",
      tags: ["composting", "gardening", "eco-friendly"],
      date: "July 10, 2023",
      readTime: "6 min read"
    },
    {
      id: 6,
      title: "Farm-to-Table: Building a Sustainable Food System",
      description: "How supporting local farmers and producers can create a more sustainable and resilient food system for your community.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Community",
      tags: ["local food", "sustainability", "farmers markets"],
      date: "August 5, 2023",
      readTime: "9 min read"
    },
  ];

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Get unique categories and tags
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  const allTags = blogPosts.flatMap((post) => post.tags);
  const tags = [...new Set(allTags)];

  // Filter blog posts based on search and filters
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(post.category);
    
    const matchesTag = 
      selectedTags.length === 0 || 
      post.tags.some((tag) => selectedTags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Toggle category filter
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Toggle tag filter
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-[#E84D1D] to-[#FF6B35]">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container relative px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">Sustainable Living Blog</h1>
            <p className="text-xl text-orange-100">
              Discover insights, tips, and stories about reducing waste, sustainable eating, and building greener communities.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="container px-4 mx-auto mt-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:border-transparent"
            />
            <svg
              className="absolute w-5 h-5 text-gray-400 left-4 top-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategories.length > 0 || selectedTags.length > 0) && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#E84D1D] bg-orange-100 rounded-full"
              >
                {category}
                <button
                  onClick={() => toggleCategory(category)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[#E84D1D] rounded-full hover:bg-orange-200"
                >
                  &times;
                </button>
              </span>
            ))}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#E84D1D] bg-orange-100 rounded-full"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[#E84D1D] rounded-full hover:bg-orange-200"
                >
                  &times;
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filter Options */}
        <div className="grid gap-6 mb-12 md:grid-cols-2">
          {/* Category Filter */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Categories</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    selectedCategories.includes(category)
                      ? "bg-orange-100 text-[#E84D1D]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="flex-grow text-left">{category}</span>
                  <span className={`w-5 h-5 border rounded flex items-center justify-center ${
                    selectedCategories.includes(category)
                      ? "bg-[#E84D1D] border-[#E84D1D] text-white"
                      : "border-gray-300"
                  }`}>
                    {selectedCategories.includes(category) && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-orange-100 text-[#E84D1D]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="container px-4 mx-auto mb-16">
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <span className="absolute bottom-0 left-0 px-3 py-1 text-xs font-medium text-white bg-[#E84D1D] rounded-tr-lg">
                    {post.category}
                  </span>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <div className="flex items-center mb-2 text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="mb-3 text-xl font-bold text-gray-800 hover:text-[#E84D1D]">
                    {post.title}
                  </h2>
                  
                  <p className="mb-4 text-gray-600 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium text-[#E84D1D] bg-orange-50 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More Button */}
                  <button className="px-5 py-2 text-sm font-medium text-white transition-colors bg-[#E84D1D] rounded-lg hover:bg-[#C53D0D] focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:ring-offset-2">
                    Read Article
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl p-8 mx-auto text-center bg-white rounded-lg shadow">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#E84D1D] rounded-md hover:bg-[#C53D0D] focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:ring-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gray-100 py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl p-8 mx-auto text-center bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Stay Updated</h2>
            <p className="mb-6 text-gray-600">
              Subscribe to our newsletter to receive the latest articles and tips on sustainable living.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:border-transparent"
              />
              <button className="px-6 py-3 font-medium text-white bg-[#E84D1D] rounded-r-lg hover:bg-[#C53D0D] focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:ring-offset-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;