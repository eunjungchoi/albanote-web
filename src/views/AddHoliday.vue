<template>
  <div>
    <h6 class="my-4" v-if="member">{{ member.business.license_name }}</h6>
    <hr>
    <div v-if="!added">
      <h5 class="py-4"><strong>약정 휴일을 등록하세요</strong></h5>
      <b-form @submit.prevent="add">
        <b-form-group label="종류" label-for="type">
          <b-form-select id="type" v-model="form.type" :options="holidayOptions"></b-form-select>
        </b-form-group>
        <b-form-group label="유급 여부">
          <b-form-radio v-model="form.paid" name="paid" value=0>무급</b-form-radio>
          <b-form-radio v-model="form.paid" name="paid" value=1>유급</b-form-radio>
        </b-form-group>
      <b-form-group label="상세" label-for="memo">
        <b-form-input id="memo" v-model="form.memo" type="text"></b-form-input>
      </b-form-group>
      <b-button class="btn-block btn-lg cashnote-green" type="submit">추가</b-button>
    </b-form>
    </div>
    <div v-else>
      <div>{{ successMessage }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addHoliday',
  data () {
    return {
      // member: null,
      form: {
        type: null,
        paid: 0,
        memo: ''
      },
      holidayOptions: [
        { text: '공휴일', value: '0' },
        { text: '창립기념일', value: '1' },
        { text: '병가', value: '2' },
        { text: '경조사', value: '3' },
        { text: '기타', value: '4' }
      ],
      added: false,
      successMessage: '휴일 정책이 추가됐습니다.'
      // newlyAddedMember: null
    }
  },
  computed: {
    member () {
      if (!this.$store.state.members) return
      let member = this.$store.state.members.find(m => {
        return m.business.id === this.$route.params.id
      })
      console.log(member)
      return member
    }
  },
  methods: {
    add () {
      Object.assign(this.form, { 'business_id': this.member.business.id })
      this.$api.post(`/api/v1/holiday-policies/`, this.form).then(res => {
        console.log(res.data)
        this.added = true
        // this.newlyAddedMember = res.data
        this.$router.back()
      })
    }
  },
  mounted () {
    this.added = false
    // this.member = this.$store.state.members.find(m => {
    //   return m.business.id === this.$route.params.id
    // })
    // console.log(this.member)
  }
}
</script>
