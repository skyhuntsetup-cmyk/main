const RAPIDAPI_KEY = '7626b7722emsh4b361da5bafaadcp14f4aejsndea0e27edaf3';
const headers = (host) => ({
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': host,
});

async function run() {
  const destRes = await fetch(`https://airbnb19.p.rapidapi.com/api/v1/searchDestination?query=London`, { headers: headers('airbnb19.p.rapidapi.com') });
  const destData = await destRes.json();
  const placeId = destData?.data?.[0]?.id;
  console.log("Place ID:", placeId);
  
  const propRes = await fetch(`https://airbnb19.p.rapidapi.com/api/v2/searchPropertyByPlaceId?placeId=${placeId}&adults=1&guestFavorite=false&ib=false&currency=USD`, { headers: headers('airbnb19.p.rapidapi.com') });
  const propData = await propRes.json();
  console.log(JSON.stringify(propData).substring(0, 500));
}
run();
