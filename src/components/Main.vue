<template>
    <div class="main_content h-100" style="flex: auto; overflow-x: hidden">
        <div :class="$route.name" class="h-100">
            <b-container v-if="$store.state.token" class="h-100">
                <router-view />
            </b-container>
        </div>
    </div>
</template>
