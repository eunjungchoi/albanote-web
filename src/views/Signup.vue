<template>
    <div class="signup text-center mx-auto" style="margin-top: 100px; max-width: 500px">
        <img alt="logo" class="m-3" src="../assets/logo-text.png">
        <div class="text-muted m-3">간편한 알바 관리</div>
        <div>
            <b-form @submit.prevent="signup">
                <b-form-group label="아이디" label-for="input-id">
                  <b-form-input id="input-id" v-model="form.username"></b-form-input>
                </b-form-group>
                <b-form-group label="비밀번호" label-for="input-password1">
                  <b-form-input id="input-password1" type="password" v-model="form.password1"></b-form-input>
                </b-form-group>
                <b-form-group label="비밀번호 확인" label-for="input-password2">
                  <b-form-input id="input-password2" type="password" v-model="form.password2"></b-form-input>
                </b-form-group>
                <b-button type="submit" class="btn-block btn-lg" variant="primary">회원가입</b-button>
          </b-form>
        </div>
        <div class="mt-5 text-center">
          <router-link to="login">계정이 있으신가요? </router-link>
        </div>
  </div>
</template>
<script>
export default {
  name: 'signup',
  data () {
    return {
      form: {
        username: null,
        password1: null,
        password2: null
      }
    }
  },
  methods: {
    signup () {
      this.$store.dispatch('SIGNUP', this.form).then(() => {
        this.$router.replace('/login')
      })
    }
  }
}
</script>
