<template>
    <div style="height: 100vh">
        <div class="d-flex flex-column h-100" v-if="authenticated">
            <Header></Header>
            <div class="main d-flex" style="flex: 1 0 auto; height: calc(100% - 124px)">
                <div class="nav sidebar d-inline-flex flex-column" style="width: 13rem; min-width: 13rem; border-right: 1px solid #E5E5E5;">
                    <div class="sidebar_currentBusiness" style="padding: 40px 1rem 1rem;">
                        <div class="text-center" v-if="$store.state.user">
                            <div class="text-muted">username: {{ $store.state.user.username }}</div>
                            <div class="my-2">{{ $store.state.user.name }} </div>
                            <router-link :to="{ name: 'business' }" class="border-circle">프로필 수정 </router-link>
                            <span @click="logout" class="border-circle">로그아웃</span>
                        </div>
                    </div>
                    <hr class="sidebar_divider m-0">
                    <div class="mt-2">
                      <router-link :to="{ name: 'dashboard'}" class="sidebar-menu">대시보드 </router-link>
                    </div>
                    <div class="mt-2">
                        <div class="sidebar-menu">사업장</div>
                        <ul>
                            <li :key="member.business.license_name" v-for="member in $store.state.members">
                              <router-link :to="{ name: 'business', params: { id: member.business.id }}" class="">{{ member.business.license_name }} </router-link>
                            </li>
                            <li><router-link :to="{ name: 'add-business'}" class="li">+ 새 사업장 추가하기</router-link></li>
                        </ul>
                    </div>
                    <hr>
                  </div>
                <Main></Main>
            </div>
            <footer class="colophon_footer d-flex w-100 text-center justify-content-between" style="position:relative; height: 3.25rem; padding: 1rem; border-top: 1px solid #E5E5E5;">
                <p style="margin: auto;color: #7F7F7F;font-size: 0.75rem;">
                    주식회사 한국신용데이터 | 서울시 강남구 테헤란로 127, 10층 | 대표 김동호 |
                    사업자등록번호 734-88-00358 | 대표전화 02-533-0262 | 통신판매업신고
                    제2017-서울강남-00280호
                </p>
            </footer>
        </div>
        <div v-else>
            <div :class="$route.name" class="h-100">
            <b-container class="h-100">
                <router-view />
            </b-container>
        </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header'
import Main from '@/components/Main'

export default {
  name: 'App',
  components: {
    Main,
    Header
  },
  data () {
    return {
      authenticated: this.$store.state.token,
      user: this.$store.state.user
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT').then(() => {
        window.location.href = '/'
      })
    }
  },
  mounted () {
    this.$store.dispatch('USER')
    this.$store.dispatch('MEMBERS')
  }
}
</script>
<style lang="scss">
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
table thead, table tbody tr {
  border: 1px solid lightgrey;
  height: 35px;
}
table th {
  height: 35px;
}
button.cashnote-green {
  background-color: rgb(0, 204, 204);
  border-color: rgb(0, 204, 204);
  color: #fff;
}
ol, ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
a,
a:hover {
  color: inherit;
  text-decoration: none;
}

.nav .sidebar-menu {
  color: rgb(51, 62, 72);
  font-weight: bold;
  font-size: 0.875rem;
  padding: 0.5rem 2rem 0.5rem calc(2rem - 8px);
}
.nav li a {
  display: block;
  color: rgb(127, 127, 127);
  font-size: 0.875rem;
  padding: 0.5rem 2rem 0.5rem calc(2rem - 8px);
  margin: 0 0 0.5rem;
  border-left: 8px solid transparent;
}
.border-circle {
  border-radius: 10px;
  padding: 3px;
  border: 1px solid lightgrey;
  margin: 2px;
  font-size: 0.875rem;
  /*background-color: #7F7F7F;*/
  /*color: #fff;*/
}
</style>
