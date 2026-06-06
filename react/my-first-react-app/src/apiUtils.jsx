// Utility for GET requests (now properly handles the AbortSignal)
export const getRequestWithNativeFetch = async (url, signal = null) => {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`HTTP error: Status ${response.status}`);
  }

  return response.json();
};

// Utility for POST requests
export const postRequestWithFetch = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: Status ${response.status}`);
  }

  return response.json();
};
