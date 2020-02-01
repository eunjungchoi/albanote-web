<template>
  <div>
    <div class="my-3 d-flex justify-content-between" v-if="member">
      <div v-if="business">
        <h5><strong>{{ business.license_name }}</strong></h5>
        <div class="text-muted">{{ business.address }}</div>
        <div class="text-muted">{{ member.type === 'manager' ? '관리자' : '일반 직원' }}</div>
      </div>
      <router-link :to="{ name: 'add-member', params: { id: member.business.id } }" v-if="member && member.type === 'manager'">+ 직원 추가</router-link>
    </div>
    <div class="d-flex justify-content-between my-3 py-3" style="border-bottom: 1px solid lightgray">
      <span class="px-4 tab" :class="{ 'selected': selectedTab === tab }" :key="tab" v-for="tab in tabs" @click="toggleTab(tab)">{{ tab }}</span>
    </div>
    <div v-if="selectedTab === '주별 근무 통계'">
      <table class="w-100">
        <thead>
        <th></th>
        <th>근로자</th>
        <th :key="day[0]" v-for="day in thisWeek" :class="{ 'red': day[0] === 'sunday' }"> {{ day[1].toString().slice(0, 8) }}</th>
        <th>주 근로시간</th>
        <th>월 근로시간</th>
        </thead>
         <tbody>
         <tr :key="member.user.username" v-for="member in memberSet">
           <td>{{ nthOfMonth }}주차</td>
           <td>{{ member.user.name }}</td>
           <template v-for="day in thisWeek">
             <td :key="day[0]">{{ getDuration(member, day) }}</td>
           </template>
           <td> {{ weeklySum(member) }}시간</td>
           <td>{{ getMemberSalary(member) ? getMemberSalary(member).total_hours : 0 }}시간</td>
         </tr>
      </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '월급 통계'">
      <h6>{{ selectedYear }} 년 {{ selectedMonth }}월 </h6>
      <table class="w-100">
        <thead>
        <th>담당자 </th>
        <th>총 근무시간</th>
        <th>시급 (원)</th>
        <th>기본급 (원) </th>
        <th>총 주휴수당</th>
        <th><strong>급여 총액</strong></th>
        </thead>
        <tbody>
        <tr :key="member.id" v-for="member in memberSet">
          <td>{{ member.user.name }}</td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).total_hours : 0}}시간 </td>
          <td>{{ member.hourly_wage}} </td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).base_salary : 0}} </td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).total_extra_pay : 0}}원 </td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).total_monthly_pay : 0}}원</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '근무내역 상세보기'">
      <table class="w-100">
        <thead>
          <th :key="column" v-for="column in workLogDetailColumns">{{ column }}</th>
        </thead>
        <tbody>
          <tr :key="work.start_time" v-for="work in $store.state.works">
            <td>{{ work.member.user.name }}</td>
            <td>{{ work.start_time.slice(0, 10) }}</td>
            <td>{{ work.start_time.slice(11, -4) }}</td>
            <td>{{ work.end_time.slice(11, -4) }}</td>
            <td>{{ work.duration.slice(0, -3) }}</td>
            <td>{{ work.late_come ? work.late_come.slice(0, -3) : '' }}</td>
            <td>{{ work.early_leave ? work.early_leave.slice(0, -3) : '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '+ 근무기록 추가'" class="m-auto" style="max-width: 400px;">
      <b-form @submit.prevent="add">
        <b-form-group label="시작일시" label-for="start">
          <b-form-input id="start" type="datetime-local" v-model="form.start_time"></b-form-input>
        </b-form-group>
        <b-form-group label="종료일시" lable-for="end">
          <b-form-input id="end" type="datetime-local" v-model="form.end_time"></b-form-input>
        </b-form-group>
        <b-button type="submit" class="btn-block btn-lg cashnote-green" variant="secondary">추가</b-button>
      </b-form>
    </div>
    <div v-if="selectedTab === '스케줄표'">
      <div class="my-3 text-right">
        <router-link :to="{ name: 'add-timetable', params: { id: member.business.id }}" class="border-circle p-2">+ 스케쥴 추가</router-link>
      </div>
      <table class="w-100">
        <thead>
        <th :key="column" v-for="column in timetableColumns"> {{ column }}</th>
        </thead>
        <tbody>
        <tr :key="time.day" v-for="time in $store.state.timetables">
          <td>{{ humanReadableDay(time.day) }}</td>
          <td>{{ time.start_time.slice(0, -3) }}</td>
          <td>{{ time.end_time.slice(0, -3) }}</td>
          <td>{{ time.member.user.name }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '직원 관리' && member && member.type === 'manager'">
      <table class="w-100">
        <thead>
          <th :key="column" v-for="column in memberListColumns">{{ column }}</th>
        </thead>
        <tbody>
        <tr :key="member.user.username" v-for="member in $store.state.allMembers">
          <td>{{ member.user.name }}</td>
          <td>{{ member.user.phone }}</td>
          <td>{{ member.latest_work_date ? member.latest_work_date.slice(0, 10) : ''}}</td>
          <td>{{ member.created.slice(0, 10) }}</td>
          <td>{{ member.user.sex === 'male' ? '남' : '여' }}</td>
          <td>{{ member.type === 'manager' ? '관리자' : '일반 직원'}}</td>
          <td>{{ member.hourly_wage }}</td>
          <td>{{ member.status === 'active' ? '재직 중' : '퇴사' }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'business',
  data () {
    return {
      member: null,
      works: [],
      business: null,
      selectedTab: '주별 근무 통계',
      salary: null,
      workLogDetailColumns: ['담당자', '날짜', '출근시간', '퇴근시간', '총 근무시간', '지각', '조퇴'],
      timetableColumns: ['요일', '시작시간', '종료시간', '담당자'],
      memberListColumns: ['이름', '전화번호', '최근 출근일', '가입일', '성별', '직급', '시급', '상태'],
      today: moment().format(),
      selectedYear: moment().year(),
      selectedMonth: moment().month(),
      form: {
        start_time: moment().format('YYYY-MM-DThh:mm').toString(),
        end_time: moment().format('YYYY-MM-DThh:mm').toString()
      }
    }
  },
  computed: {
    nthOfMonth () {
      return Math.ceil(moment().date() / 7)
    },
    memberSet () {
      if (!(this.member)) return
      if (this.member.type === 'manager') {
        return this.$store.state.allMembers
      }
      return [this.member]
    },
    tabs () {
      if (!(this.member)) return
      return this.member.type === 'manager' ? ['주별 근무 통계', '월급 통계', '근무내역 상세보기', '+ 근무기록 추가', '스케줄표', '직원 관리'] : ['주별 근무 통계', '월급 통계', '근무내역 상세보기', '+ 근무기록 추가', '스케줄표']
    },
    thisWeek () {
      return [
        ['sunday', moment().day('Sunday').format('M/D ddd YYYY')],
        ['monday', moment().day('Monday').format('M/D ddd YYYY')],
        ['tuesday', moment().day('Tuesday').format('M/D ddd YYYY')],
        ['wednesday', moment().day('Wednesday').format('M/D ddd YYYY')],
        ['thursday', moment().day('Thursday').format('M/D ddd YYYY')],
        ['friday', moment().day('Friday').format('M/D ddd YYYY')],
        ['saturday', moment().day('Saturday').format('M/D ddd YYYY')]
      ]
    }
  },
  watch: {
    '$route.params' () {
      if (this.$route.name === 'business') {
        this.getBusiness()
        this.load()
      }
    }
  },
  methods: {
    load () {
      this.$store.dispatch('WORKS', this.business.id)
      this.$store.dispatch('TIMETABLES', this.business.id)
      if (this.member.type !== 'manager') return
      this.$store.dispatch('ALL_MEMBERS_OF_BUSINESS', this.business.id)
    },
    humanReadableDay (day) {
      let map = {
        0: '월',
        1: '화',
        2: '수',
        3: '목',
        4: '금',
        5: '토',
        6: '일'
      }
      return map[day]
    },
    add () {
      Object.assign(this.form, { 'business_id': this.business.id })
      this.$store.dispatch('ADDWORKS', this.form)
    },
    toggleTab (tab) {
      this.selectedTab = tab
    },
    getDuration (member, day) {
      let date = moment(day[1], 'M/D ddd YYYY').format('YYYY-MM-DD')
      let work = this.$store.state.works.find(work => {
        return work.member.user.username === member.user.username && work.start_time.slice(0, 10) === date
      })
      if (work) return work.duration.slice(0, -3)
    },
    weeklySum (member) {
      if (!this.salary) return
      let memberSalary = this.getMemberSalary(member)
      let firstDayOfTheWeek = this.thisWeek[0][1]
      let date = moment(firstDayOfTheWeek, 'M/D ddd YYYY').format('YYYY-MM-DD')
      return memberSalary ? memberSalary.weekly_hours[date] : 0
    },
    getMemberSalary (member) {
      let memberSalary = 0
      if (this.salary) {
        memberSalary = this.salary.members.find(m => {
          return m.id === member.id
        })
      }
      return memberSalary
    },
    getBusiness () {
      this.member = this.$store.state.members.find(m => {
        return m.business.id === this.$route.params.id
      })
      this.business = this.member.business
    }
  },
  mounted () {
    this.getBusiness()
    this.load()
    let year = this.selectedYear ? this.selectedYear : moment().year()
    let month = this.selectedMonth ? this.selectedMonth : moment().month() + 1
    this.$api.get(`/api/v1/works/get_monthly_salary/?business=${this.business.id}&year=${year}&month=${month}`).then(res => {
      this.salary = res.data
    }).catch(err => console.log(err))
  }
}
</script>
<style scoped>
.tab {
  color: rgb(127, 127, 127);
  padding: 4px;
  border-radius: 15px;
}
.tab:hover {
  color: rgb(51, 62, 72);
  cursor: pointer;
}
.tab.selected {
  border: 1px solid rgb(0, 204, 204);
  background-color: rgb(0, 204, 204);
  color: #fff;
}
th, td {
  color: rgb(51, 62, 72);
  font-size: 0.875rem;

}
th.red {
  color: red;
}
</style>
