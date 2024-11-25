//Automatically attaches the authorization token to every request header. We use local storage for auth.
//Acts as a reusable wrapper for the fetch API, so that we don't repeat code for requests that need to be authenticated.
//Recieves the endpoint to which the request is being sent and options (method, body, headers).
export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('token');
  
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    const response = await fetch(url, {
      ...options,
      headers,
    });
  
    return response;
  }