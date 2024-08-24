import { setBlockedIP } from "../../actions/cookies";

export async function checkBlackliste() {
    try {
      const response = await fetch(`/api/orders/ip`);
      if (response.ok) {
        
        if(response.redirected){
          window.location.href = response.url;
          setBlockedIP()
          return true
        }
        return false
        
      } else {
        console.error('Failed to fetch IP check:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  }