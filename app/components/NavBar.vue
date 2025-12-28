<template>
    <div class="nav-container">
        <nav>
            <div @click="router.push('/')">
                <i :class="{'ri-home-9-line': !isActive('/'), 'ri-home-9-fill': isActive('/')}"></i>
            </div>
            <div @click="router.push('/search')">
                <i :class="{'ri-search-2-line': !isActive('/search'), 'ri-search-2-fill': isActive('/search')}"></i>
            </div>
            <div @click="router.push('/saved')">
                <i :class="{'ri-bookmark-line': !isActive('/saved'), 'ri-bookmark-fill': isActive('/saved')}"></i>
            </div>
            <div @click="router.push('/settings')">
                <i :class="{'ri-settings-4-line': !isActive('/settings'), 'ri-settings-4-fill': isActive('/settings')}"></i>
            </div>
        </nav>
    </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const isActive = (path) => path === '/' ? route.path === '/' : route.path.startsWith(path)

</script>

<style scoped>
.nav-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 70px;
}

nav {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

nav > div {
    height: 35px;
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 10px;
}

nav > div > i {
    font-size: 1.6rem;
}
</style>