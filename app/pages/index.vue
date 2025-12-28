<template>
  <section>
    <div class="main-top">
      <img src="/img/disney/dlp_castle.jpg" alt="">
      <h3>Welcome</h3>
    </div>
    <div class="schedule-park">
      <h5>Opening hours</h5>
      <div class="schedule-container">
        <h6>{{ new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</h6>
        <div class="schedule-card">
          <div class="left">
            <i class="ri-time-line"></i>
          </div>
          <div class="right">
            <p><strong>Disneyland Park</strong></p>
            <p>09:00 to 22:00</p>
          </div>
        </div>
        <div class="schedule-card">
          <div class="left">
            <i class="ri-time-line"></i>
          </div>
          <div class="right">
            <p><strong>Walt Disney Studios Park</strong></p>
            <p>09:00 to 22:00</p>
          </div>
        </div>
      </div>
    </div>
    <div class="discover">
      <h5>Discover</h5>
      <div class="discover-container">
        <div class="discover-card" @click="pushToSearch('attraction')">
          <img src="/img/disney/discover_ride.jpg" alt="">
          <div class="discover-link">
            <p><strong>Discover our rides</strong></p>
            <div class="discover-link-icon">
              <i class="ri-arrow-right-s-line"></i>
            </div>
          </div>
        </div>
        <div class="discover-card" @click="pushToSearch('show')">
          <img src="/img/disney/discover_showw.jpg" alt="">
          <div class="discover-link">
            <p><strong>Discover our shows</strong></p>
            <div class="discover-link-icon">
              <i class="ri-arrow-right-s-line"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const router = useRouter()

const pushToSearch = (type) => {
  router.push(`/search?type=${type}`)
} 
</script>

<style scoped>
section {
  position: relative;
  background: var(--color-white);
  min-height: 100vh;
}

.main-top {
  width: 100%;
  height: 250px;
  position: relative;
}

.main-top img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.main-top h3 {
  position: absolute;
  bottom: 5%;
  left: 5%;
  color: var(--color-white);
  text-shadow: 0px 0px 10px var(--color-black),
             0px 0px 15px var(--color-black),
             0px 0px 20px var(--color-black),
             0px 0px 25px var(--color-black),
             0px 0px 30px var(--color-black),
             0px 0px 35px var(--color-black);

}

.schedule-park {
  margin-top: 40px;
}

.schedule-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.schedule-card {
  width: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  height: 50px;
  background: var(--color-white);
  filter: drop-shadow(0px 0px 2px #3a3a3a);
}

.schedule-card .left {
  height: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.schedule-card .left i {
  font-size: 1.9rem;
}

.schedule-card .right {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.discover {
  margin-top: 40px;
}

.discover-container {
  margin-top: 30px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.discover-card {
  height: 180px;
  width: 100%;
  position: relative;
  cursor: pointer;
}

.discover-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.discover-link {
  position: absolute;
  bottom: -0.5%;
  right: -0.5%;
  min-width: 50%;
  max-width: 70%;
  border-radius: 15px 0 0 0;
  background: var(--color-white);
  display: flex;
  padding: 10px;
  margin: 0;
}
</style>
