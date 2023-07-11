export async function checkToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    // Faire une requête à l'API sur /api/games/ pour vérifier le token
    const url = 'http://localhost:8000/api/games/';

    let response =  await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    
    return response.ok;
}