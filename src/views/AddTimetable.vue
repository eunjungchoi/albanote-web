<template>
  <div>
    <h5 class="py-4"><strong>근무 스케쥴을 추가하세요</strong></h5>
    <b-form class="my-3" @submit.prevent="add">
      <b-form-group label="근로자 선택" label-for="member">
        <b-form-select id="member" v-model="form.member" :options="memberOptions"></b-form-select>
      </b-form-group>
      <b-form-group label="요일" label-for="day">
        <b-form-checkbox-group
        id="day"
        v-model="form.day"
        :options="dayOptions"
        name="flavour-1"
      ></b-form-checkbox-group>
      </b-form-group>
      <b-form-group label="시작시간" label-for="start_time">
        <b-form-input id="start_time" type="time" v-model="form.start_time"></b-form-input>
      </b-form-group>
      <b-form-group label="종료시간" label-for="end_time">
        <b-form-input id="end_time" type="time" v-model="form.end_time"></b-form-input>
      </b-form-group>
      <b-button class="btn-lg btn-block cashnote-green" type="submit">추가</b-button>
    </b-form>
    <div class="text-muted my-2">* 요일별로 근무시간이 다를 때에는 개별로 입력해주세요. </div>
  </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'timetable',
  data () {
    return {
      form: {
        member: null,
        day: null,
        start_time: moment().format('hh:mm').toString(),
        end_time: moment().format('hh:mm').toString()
      },
      member: null,
      business: null,
      dayOptions: [
        { text: '월', value: '0' },
        { text: '화', value: '1' },
        { text: '수', value: '2' },
        { text: '목', value: '3' },
        { text: '금', value: '4' },
        { text: '토', value: '5' },
        { text: '일', value: '6' }
      ]
    }
  },
  computed: {
    memberOptions () {
      if (!(this.$store.state.allMembers)) return
      let options = []
      this.$store.state.allMembers.forEach(member => {
        let sex = member.user.sex === 'male' ? '남' : '여'
        options.push({
          value: member.id,
          text: member.user.name + ' ' + sex + ' ' + member.user.phone })
      })
      return options
    }
  },
  methods: {
    add () {
      // this.$store.dispatch('ADDTIMETABLE', this.form)
      const baseURL = 'http://localhost:8000'
      Object.assign(this.form, { 'business_id': this.member.business.id })
      axios.post(`${baseURL}/api/v1/timetables/`, this.form, {
        headers: { 'Authorization': 'Token ' + this.$store.state.token }
      }).then(res => {
        console.log(res.data)
      })
    }
  },
  mounted () {
    this.member = this.$store.state.members.find(m => {
      return m.business.id === this.$route.params.id
    })
  }
}
</script>
