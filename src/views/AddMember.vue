<template>
  <div>
    <h6 class="my-4" v-if="member">{{ member.business.license_name }}</h6>
    <hr>
    <div v-if="!added">
      <h5 class="py-4"><strong>직원을 등록하세요</strong></h5>
      <b-form @submit.prevent="add">
      <b-form-group label="직원 아이디" label-for="user-id">
        <b-form-input id="user-id" v-model="form.user_id" type="text"></b-form-input>
      </b-form-group>
      <b-form-group label="시급 (단위: 원)" label-for="hourly-wage">
        <b-form-input id="hourly-wage" v-model="form.hourly_wage" type="text"></b-form-input>
      </b-form-group>
      <b-button class="btn-block btn-lg cashnote-green" type="submit">추가</b-button>
    </b-form>
    </div>
    <div v-else>
      <div>{{ successMessage }}</div>
      <div>{{ newlyAddedMember.user.name }} ({{ newlyAddedMember.user.phone }})</div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'addMember',
  data () {
    return {
      member: null,
      form: {
        user_id: null,
        hourly_wage: 0
      },
      added: false,
      successMessage: '직원이 추가됐습니다.',
      newlyAddedMember: null
    }
  },
  methods: {
    add () {
      Object.assign(this.form, { 'business_id': this.member.business.id })
      // const baseURL = 'http://albabasic-dev.us-west-2.elasticbeanstalk.com'
      const baseURL = 'http://localhost:8000'
      axios.post(`${baseURL}/api/v1/members/`, this.form, {
        headers: { 'Authorization': 'Token ' + this.$store.state.token }
      }).then(res => {
        this.added = true
        this.newlyAddedMember = res.data
        this.$router.back()
      })
    }
  },
  mounted () {
    this.added = false
    this.member = this.$store.state.members.find(m => {
      return m.business.id === this.$route.params.id
    })
  }
}
</script>
