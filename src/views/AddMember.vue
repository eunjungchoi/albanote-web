<template>
  <div class="mb-5">
    <div v-if="!added">
      <h5 class="py-3"><strong>직원을 등록하세요</strong></h5>
      <b-form @submit.prevent="addOrUpdate">
      <b-form-group label="직원 아이디" label-for="user-id">
        <b-form-input id="user-id" v-model="form.user_id" type="text"></b-form-input>
      </b-form-group>
      <b-form-group label="시급 (단위: 원)" label-for="hourly-wage">
        <b-form-input id="hourly-wage" v-model="form.hourly_wage" type="text"></b-form-input>
      </b-form-group>
      <b-form-group label="주휴일" label-for="weekly_holiday">
            <b-form-radio-group
              id="weekly_holiday"
              v-model="form.weekly_holiday"
              :options="dayOptions"
              name="weekly_holiday">
            </b-form-radio-group>
        </b-form-group>
      <b-form-group label="입사일" label-for="start_date">
        <b-form-input type="date" v-model="form.start_date"></b-form-input>
      </b-form-group>
      <b-form-group label="4대 보험 여부" label-for="insurance">
        <b-form-checkbox-group
        id="insurance"
        v-model="form.insurance"
        :options="options"
        name="insurance"
      ></b-form-checkbox-group>
      </b-form-group>
      <b-button class="btn-block btn-lg cashnote-green" type="submit">저장</b-button>
    </b-form>
    </div>
    <div v-else>
      <div>{{ successMessage }}</div>
      <div>{{ newlyAddedMember.user.name }} ({{ newlyAddedMember.user.phone }})</div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'saveMember',
  props: ['target-member'],
  data () {
    return {
      member: null,
      form: {
        user_id: this.targetMember ? this.targetMember.user.username : null,
        hourly_wage: this.targetMember ? this.targetMember.hourly_wage : 0,
        weekly_holiday: this.targetMember ? this.targetMember.weekly_holiday : 6,
        insurance: [],
        start_date: this.targetMember ? this.targetMember.start_date : moment().format('YYYY-MM-DD').toString()
      },
      options: [
        { text: '국민연금', value: '0' },
        { text: '건강보험', value: '1' },
        { text: '고용보험', value: '2' },
        { text: '산재보험', value: '3' }
      ],
      dayOptions: [
        { text: '월', value: '0' },
        { text: '화', value: '1' },
        { text: '수', value: '2' },
        { text: '목', value: '3' },
        { text: '금', value: '4' },
        { text: '토', value: '5' },
        { text: '일', value: '6' }
      ],
      added: false,
      successMessage: '직원이 추가됐습니다.',
      newlyAddedMember: null
    }
  },
  methods: {
    addOrUpdate () {
      let businessId = null
      if (this.targetMember) {
        businessId = this.targetMember.business.id
      } else {
        businessId = this.member.business.id
      }
      Object.assign(this.form, { 'business_id': businessId })
      if (this.targetMember) {
        this.$api.put(`/api/v1/members/${this.targetMember.id}/`, this.form).then(res => {
          this.$store.dispatch('UPDATE_MEMBER', res.data)
          this.$emit('saved-member')
        })
      } else {
        this.$api.post(`/api/v1/members/`, this.form).then(res => {
          this.added = true
          this.newlyAddedMember = res.data
          this.$router.back()
        })
      }
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
