<template>
    <div class="login text-center mx-auto" style="margin-top: 100px; max-width: 500px">
        <img alt="logo" class="m-3" src="../assets/logo-text.png">
        <div class="text-muted m-3">간편한 알바 관리</div>
        <div>
            <b-form @submit.prevent="login">
                <b-form-group label="아이디" label-for="input-id">
                  <b-form-input id="input-id" v-model="form.username">
                  </b-form-input>
                </b-form-group>
                <b-form-group label="비밀번호" label-for="input-password">
                  <b-form-input
                    id="input-password"
                    type="password"
                    v-model="form.password"
                  >
                  </b-form-input>
                </b-form-group>
                <b-button type="submit" class="btn-block btn-lg" variant="primary">로그인</b-button>
          </b-form>
        </div>
        <div class="mt-5 text-center">
          <router-link to="signup">계정이 없으신가요? </router-link>
        </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      form: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    login () {
      this.$store.dispatch('LOGIN', this.form).then(() => {
        window.location.href = '/'
        // this.$router.push('/')
      })
    }
  }
}
</script>
