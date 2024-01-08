export const mutationLogin = async() => {
    const options = {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`
        }
      };
  
    const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new',options)
    const data = await response.json();
    console.log(data.guest_session_id);
    return data.guest_session_id;
}