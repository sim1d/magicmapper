import { ref, watch } from 'vue'
import { liveData } from './useLiveData'
import { resetNextDataReload, startNextDataReload } from './useNextDataReload'

export const data = ref(null)
export const isLoading = ref(false)
export const error = ref(null)

const LOCAL_STORAGE_KEY = 'MagicMapperData'
const LOCAL_STORAGE_TS = 'MagicMapperDataTimestamp'


async function fetchData() {
    isLoading.value = true;
    error.value = null;

    try {

        console.log(liveData.value)

        let dlp = []
        let wds = []

        if (liveData.value) {
          dlp = await getParkLiveData("dae968d5-630d-4719-8b06-3d107e944401", "Disneyland Park");
          wds = await getParkLiveData("ca888437-ebb4-4d50-aed2-d227f7096968", "Walt Disney Studios Park");
        } else {
          // RECUPERER LES DATA FREEZE PUIS RANDOMIZE
          dlp = await getFreezeDataAndRandomize('/src/data/dlp-freeze.json')
          wds = await getFreezeDataAndRandomize('/src/data/wds-freeze.json')
        }

        const combined = [...dlp.liveData, ...wds.liveData];
        
        const posRes = await fetch('/src/data/pos.json');
        const posData = await posRes.json();

        combined.forEach(item => {
            const coords = posData[item.name]?.pos || null;
            item.pos = coords;
        });

        let currentPosition = {}

        if (liveData.value) {
          currentPosition = await getLocation(); // Attendre la promesse
          
          // VÉRIFIER si on a une position
          if (currentPosition === "NODATA" || !currentPosition.lat || !currentPosition.lon) {
              // Si pas de position, pas de calcul de distance
              const uniqueCombined = combined.filter((item, index, self) =>
                  index === self.findIndex((t) => t.name === item.name)
              );

              data.value = uniqueCombined;

              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(uniqueCombined));
              localStorage.setItem(LOCAL_STORAGE_TS, Date.now());
              return;
          }
        } else {
          // RANDOM POSITION IN PARK
          const randomPos = [
            [48.874311, 2.774765],
            [48.874498, 2.779634],
            [48.872306, 2.772376],
            [48.870590, 2.776601],
            [48.871374, 2.778402],
            [48.868753, 2.781575],
            [48.867410, 2.779218],
            [48.867388, 2.776680],
            [48.865373, 2.779434]
          ]

          const randomIndex = Math.floor(Math.random() * randomPos.length)
          currentPosition = {lat: randomPos[randomIndex][0], lon: randomPos[randomIndex][1]}
          console.log('current position')
          console.log(currentPosition)
        }

        let closestItem = null;
        let minDistance = Infinity;

        combined.forEach(item => {
            // Vérifier si l'élément a des coordonnées
            if (item.pos && Array.isArray(item.pos) && item.pos.length === 2) {
                const distance = calculateDistanceMeters(
                    currentPosition.lat, 
                    currentPosition.lon, 
                    item.pos[0], 
                    item.pos[1]
                );
                
                item.distance = distance;
                item.walkingTime = Math.ceil(distance / 1.39 / 60)

                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = {
                        ...item,
                        distance: distance
                    };
                }
            } else {
                // Marquer comme sans distance calculable
                item.distance = null;
            }
        });

        console.log("Élément le plus proche:", closestItem);

        const uniqueCombined = combined.filter((item, index, self) =>
            index === self.findIndex((t) => t.name === item.name)
        );

        data.value = uniqueCombined;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(uniqueCombined));
        localStorage.setItem(LOCAL_STORAGE_TS, Date.now());

    } catch (err) {
        error.value = err.message;
        console.error(err);
    } finally {
        isLoading.value = false;
    }
}

async function getFreezeDataAndRandomize(path) {
  const res = await fetch(path);
  const data = await res.json();

  data.liveData.forEach(ride => {
    ride.park = path == '/src/data/dlp-freeze.json' ? 'Disneyland Park' : 'Walt Disney Studios Park'
    if (ride.entityType == "ATTRACTION") {

      const randomStatus = Math.floor(Math.random() * 30)
      
      if (randomStatus == 0 || randomStatus == 1) {
        // ATTRACTION CLOSED
        ride.status = randomStatus == 0 ? "CLOSED" : "DOWN"

        ride.queue.STANDBY.waitTime = null

        if (ride.queue.SINGLE_RIDER) {
          ride.queue.SINGLE_RIDER.waitTime = null
        }

      } else {
        // ATTRACTION NORMAL
        ride.status = 'OPERATING'

        const steps = Math.floor(120 / 5) + 1
        const wait = Math.floor(Math.random() * steps) * 5

        ride.queue.STANDBY.waitTime = wait

        if (ride.queue.SINGLE_RIDER) {
          const singleSteps = Math.floor(40 / 5) + 1
          const singleWait = Math.floor(Math.random() * singleSteps) * 5
          ride.queue.SINGLE_RIDER.waitTime = singleWait
        }

      }

    }

  })

  return data
}

async function getParkLiveData(id,park) {
    try {

        const res = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/live`)
        if (!res.ok) throw new Error('Erreur API (getParkLiveData)')
        const json = await res.json()

        if (json.liveData && Array.isArray(json.liveData)) {
            json.liveData = json.liveData.map(item => ({
                ...item,
                park: park
            }))

            return json
        }

    } catch (err) {
        error.value = err.message
        console.error(err)
    }
}

async function getLocation() {
  // 1. Essayer l'API navigateur
  if ("geolocation" in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 60000
        });
      });
      return {
        source: 'gps',
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy // en mètres
      };
    } catch (error) {
      console.log("GPS échoué:", error.message);
    }
  }
  
  // 2. Fallback: API IP (moins précis)
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      source: 'ip',
      lat: data.latitude,
      lon: data.longitude,
      accuracy: 50000 // ~50km de précision
    };
  } catch (error) {
    // 3. Fallback ultime
    return "NODATA"
  }
}

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  // Validation rapide
  if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
    return 0;
  }
  
  const R = 6371000; // Rayon terrestre en mètres
  
  // Conversion degrés → radians
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  // Formule de Haversine
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Arrondi au mètre près
  return Math.round(distance*1.75);
}

export function startAutoRefresh() {
  if (!process.client) return

  onMounted(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    const ts = localStorage.getItem(LOCAL_STORAGE_TS)
    const CACHE_DURATION = 2 * 60 * 1000 // 1 minute

    if (saved) data.value = JSON.parse(saved)

    const now = Date.now()
    let initialDelay = 0
    startNextDataReload()

    if (ts) {
      const elapsed = now - Number(ts)
      if (elapsed < CACHE_DURATION) {
        console.log('VALUE ALREADY PRESENT')
        initialDelay = CACHE_DURATION - elapsed
        resetNextDataReload(Math.floor(initialDelay / 1000))
        console.log(data.value)
      }
    }

    const fetchAndStore = async () => {
      await fetchData()
      resetNextDataReload(120)
    }

    setTimeout(() => {
      fetchAndStore()
      setInterval(fetchAndStore, CACHE_DURATION)
    }, initialDelay)
  })
}