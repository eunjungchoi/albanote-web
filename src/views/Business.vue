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
           <td>
             <div>{{ getMemberSalary(member) ? getMemberSalary(member).total_hours : 0 }}시간</div>
             <div>{{ getMemberSalary(member) ? getMemberSalary(member).working_days : 0 }}일
              (지각: {{ getMemberSalary(member) ? getMemberSalary(member).late_come_count : 0 }} 일)
             </div>
           </td>
         </tr>
      </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '월급 통계'">
      <h6>{{ selectedYear }} 년 {{ selectedMonth }}월 </h6>
      <table class="w-100">
        <thead>
          <th :key="column" v-for="column in monthlySalaryColumns"> {{ column }}</th>
        </thead>
        <tbody>
        <tr :key="member.id" v-for="member in memberSet">
          <td>{{ member.user.name }}</td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).working_days : 0}} 일 </td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).total_hours : 0}}시간 </td>
          <td>{{ member.hourly_wage}} </td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).base_salary : 0}} </td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).total_extra_pay : 0}}원 </td>
          <td>{{ getMemberSalary(member) ? getMemberSalary(member).total_monthly_pay : 0}}원</td>
        </tr>
        </tbody>
      </table>
      <hr>
      <h6>{{ prevMonth.year() }} 년 {{ prevMonth.month() + 1 }}월 </h6>
      <div class="text-right my-1" v-if="member.type === 'manager'">
        <b-button @click="savePayroll(prevMonth.year(), prevMonth.month() +1)">급여명세 생성 </b-button>
      </div>
      <table class="w-100">
         <thead>
          <th :key="column" v-for="column in monthlySalaryColumns"> {{ column }}</th>
        </thead>
        <tbody>
          <tr :key="member.id" v-for="member in memberSet">
            <td>{{ member.user.name }}</td>
            <td>{{ getMemberSalary(member, prevMonthSalary) ? getMemberSalary(member, prevMonthSalary).working_days : 0}} 일 </td>
            <td>{{ getMemberSalary(member, prevMonthSalary) ? getMemberSalary(member, prevMonthSalary).total_hours : 0}}시간 </td>
            <td>{{ member.hourly_wage}} </td>
            <td>{{ getMemberSalary(member, prevMonthSalary) ? getMemberSalary(member, prevMonthSalary).base_salary : 0}} </td>
            <td>{{ getMemberSalary(member, prevMonthSalary) ? getMemberSalary(member, prevMonthSalary).total_extra_pay : 0}}원 </td>
            <td>{{ getMemberSalary(member, prevMonthSalary) ? getMemberSalary(member, prevMonthSalary).total_monthly_pay : 0}}원</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '근무내역 상세보기'">
      <table class="w-100">
        <thead>
          <th :key="column" v-for="column in workLogDetailColumns">{{ column }}</th>
          <th></th>
        </thead>
        <tbody>
          <tr :key="work.start_time" v-for="work in $store.state.works">
            <td>{{ work.member.user.name }}</td>
            <td>{{ work.start_time ? work.start_time.slice(0, 10) : work.date ? work.date : '' }}</td>
            <td>{{ work.start_time ? work.start_time.slice(11, 16) : ''}}</td>
            <td>{{ work.end_time ? work.end_time.slice(11, 16) : ''}}</td>
            <td>{{ work.duration ? work.duration.slice(0, -3) : '' }}</td>
            <td>{{ work.late_come ? work.late_come.slice(0, -3) : '' }}</td>
            <td>{{ work.early_leave ? work.early_leave.slice(0, -3) : '' }}</td>
            <td>{{ work.absence ? absenceMap(work.reason) : '' }}</td>
            <td>
              <b-button class="button-gray" @click="deleteAttendance(work)">삭제</b-button>
            </td>
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
        <b-form-checkbox id="absence" v-model="form.absence" name="absence" value=1 unchecked-value=0>부재</b-form-checkbox>
        <b-form-group label="사유" label-for="reason" v-if="form.absence > 0">
            <b-form-radio-group id="reason" v-model="form.reason" :options="offReasonOptions" name="reason"></b-form-radio-group>
        </b-form-group>
        <b-form-group label="날짜" label-for="date" v-if="form.absence > 0">
          <b-form-input id="date" type="date" v-model="form.date"></b-form-input>
        </b-form-group>
        <b-button type="submit" class="btn-block btn-lg cashnote-green my-3" variant="secondary">추가</b-button>
      </b-form>
    </div>
    <div v-if="selectedTab === '스케줄표'">
      <div class="my-3 text-right" v-if="member.type === 'manager'">
        <router-link :to="{ name: 'add-timetable', params: { id: member.business.id }}" class="border-circle p-2">+ 스케쥴 추가</router-link>
      </div>
      <table class="w-100">
        <thead>
        <th :key="column" v-for="column in timetableColumns"> {{ column }}</th>
        </thead>
        <tbody>
        <tr :key="time.day + time.member.user.name" v-for="time in $store.state.timetables">
          <td>{{ humanReadableDay(time.day) }}</td>
          <td>{{ time.start_time.slice(0, -3) }}</td>
          <td>{{ time.end_time.slice(0, -3) }}</td>
          <td>{{ time.member.user.name }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '직원 정보'">
      <div v-if="editMemberMode">
        <save-member :target-member="targetMember" @saved-member="savedMember"></save-member>
      </div>
      <table class="w-100">
        <thead>
          <th :key="column" v-for="column in memberListColumns">{{ column }}</th>
          <th v-if="member && member.type === 'manager'"></th>
        </thead>
        <tbody>
        <tr :key="m.user.username" v-for="m in memberSet">
          <td>{{ m.user.name }}</td>
          <td>{{ m.user.phone }}</td>
          <td>{{ m.latest_work_date ? m.latest_work_date.slice(0, 10) : ''}}</td>
          <td>{{ m.start_date }}</td>
          <td>{{ m.user.sex === 'male' ? '남' : '여' }}</td>
          <td>{{ m.type === 'manager' ? '관리자' : '일반 직원'}}</td>
          <td>{{ m.hourly_wage }}</td>
          <td>{{ m.annual_leave }}</td>
          <td>{{ m.status === 'active' ? '재직 중' : '퇴사' }}</td>
          <td v-if="member && member.type === 'manager'">
            <b-button class="button-gray" @click="edit(member)">수정</b-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="selectedTab === '휴일 시스템'">
       <div class="my-3 text-right">
         <router-link :to="{ name: 'add-holiday', params: { id: member.business.id } }" v-if="member && member.type === 'manager'">+ 약정휴일 등록</router-link>
       </div>
       <table class="w-100">
        <thead>
          <th>종류</th>
          <th>유급 여부</th>
          <th>상세</th>
        </thead>
        <tbody>
          <tr :key="holiday.id" v-for="holiday in holidays">
            <td>{{ holidayMap(holiday.type) }} </td>
            <td>{{ holiday.paid ? '유급 휴일' : '무급 휴일' }} </td>
            <td>{{ holiday.memo }} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import saveMember from './AddMember'

export default {
  name: 'business',
  components: {
    'save-member': saveMember
  },
  data () {
    return {
      member: null,
      works: [],
      business: null,
      editMemberMode: false,
      targetMember: null,
      selectedTab: '주별 근무 통계',
      salary: null,
      prevMonthSalary: null,
      monthlySalaryColumns: ['담당자', '총 근무일수', '총 근무시간', '시급 (원)', '기본급(원)', '총 주휴수당', '급여 총액'],
      workLogDetailColumns: ['담당자', '날짜', '출근시간', '퇴근시간', '총 근무시간', '지각', '조퇴', '부재'],
      timetableColumns: ['요일', '시작시간', '종료시간', '담당자'],
      memberListColumns: ['이름', '전화번호', '최근 출근일', '가입일', '성별', '직급', '시급', '연차', '상태'],
      holidays: null,
      today: moment().format(),
      selectedYear: moment().year(),
      selectedMonth: moment().month() + 1,
      prevMonth: moment().subtract(1, 'months'),
      offReasonOptions: [
        { text: '법정휴일', value: 0 },
        { text: '약정휴일', value: 1 },
        { text: '연차', value: 2 },
        { text: '결근', value: 3 }
      ],
      form: {
        start_time: moment().format('YYYY-MM-DDThh:mm').toString(),
        end_time: moment().format('YYYY-MM-DDThh:mm').toString(),
        absence: 0,
        reason: 3,
        date: moment().format('YYYY-MM-DD').toString()
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
      return this.member.type === 'manager' ? ['주별 근무 통계', '월급 통계', '근무내역 상세보기', '+ 근무기록 추가', '스케줄표', '직원 정보', '휴일 시스템'] : ['주별 근무 통계', '월급 통계', '근무내역 상세보기', '+ 근무기록 추가', '스케줄표', '직원 정보']
    },
    thisWeek () {
      if (moment().weekday() === 0) {
        return [
          ['monday', moment().day('-6').format('M/D ddd YYYY')],
          ['tuesday', moment().day('-5').format('M/D ddd YYYY')],
          ['wednesday', moment().day('-4').format('M/D ddd YYYY')],
          ['thursday', moment().day('-3').format('M/D ddd YYYY')],
          ['friday', moment().day('-2').format('M/D ddd YYYY')],
          ['saturday', moment().day('-1').format('M/D ddd YYYY')],
          ['sunday', moment().day('0').format('M/D ddd YYYY')]
        ]
      }
      return [
        ['monday', moment().day('1').format('M/D ddd YYYY')],
        ['tuesday', moment().day('2').format('M/D ddd YYYY')],
        ['wednesday', moment().day('3').format('M/D ddd YYYY')],
        ['thursday', moment().day('4').format('M/D ddd YYYY')],
        ['friday', moment().day('5').format('M/D ddd YYYY')],
        ['saturday', moment().day('6').format('M/D ddd YYYY')],
        ['sunday', moment().day('7').format('M/D ddd YYYY')]
      ]
    }
  },
  watch: {
    '$route.params' () {
      if (this.$route.name === 'business') {
        this.getBusiness()
        this.load()
      }
    },
    'business' () {
      this.getSalaryInfo()
      this.getPrevSalaryInfo()
      this.getHolidayPolicies()
    }
  },
  methods: {
    load () {
      if (!this.business) return
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
    absenceMap (reason) {
      let map = {
        0: '법정휴일',
        1: '약정휴일',
        2: '연차',
        3: '결근'
      }
      return map[reason]
    },
    holidayMap (type) {
      let map = {
        0: '공휴일',
        1: '창립기념일',
        2: '병가',
        3: '경조사',
        4: '기타'
      }
      return map[type]
    },
    add () {
      Object.assign(this.form, { 'business_id': this.business.id })
      this.$store.dispatch('ADDWORKS', this.form).then(() => {
        this.selectedTab = '근무내역 상세보기'
      })
    },
    edit (member) {
      this.editMemberMode = true
      this.targetMember = member
    },
    savedMember () {
      this.editMemberMode = false
      this.targetMember = null
    },
    deleteAttendance (attendance) {
      let id = attendance.id
      this.$api.delete(`/api/v1/attendances/${id}`).then(res => {
        this.$store.dispatch('REMOVE_WORK', id)
      }).catch(err => console.log(err))
    },
    toggleTab (tab) {
      this.selectedTab = tab
    },
    getDuration (member, day) {
      if (!this.$store.state.works) return
      let date = moment(day[1], 'M/D ddd YYYY').format('YYYY-MM-DD')
      let work = this.$store.state.works.find(work => {
        return work.member.user.username === member.user.username && ((work.start_time && work.start_time.slice(0, 10) === date) || (work.date && work.date === date))
      })
      if (work && work.duration) return work.duration.slice(0, -6) + '시간' + work.duration.slice(-5, -3) + '분'
      else if (work && work.absence) return this.absenceMap(work.reason)
      return ''
    },
    weeklySum (member) {
      if (!this.salary) return
      let memberSalary = this.getMemberSalary(member)
      let firstDayOfTheWeek = this.thisWeek[0][1]
      let date = moment(firstDayOfTheWeek, 'M/D ddd YYYY').format('YYYY-MM-DD')
      return memberSalary ? memberSalary.weekly_hours[date] : 0
    },
    getMemberSalary (member, salary = null) {
      let memberSalary = 0
      if (!salary) {
        salary = this.salary
      }
      if (!salary) return
      memberSalary = salary.members.find(m => {
        return m.id === member.id
      })
      return memberSalary
    },
    getBusiness () {
      if (!this.$store.state.members) return
      this.member = this.$store.state.members.find(m => {
        return m.business.id === Number(this.$route.params.id)
      })
      if (this.member) {
        this.business = this.member.business
      }
      return this.business
    },
    getSalaryInfo () {
      let year = this.selectedYear ? this.selectedYear : moment().year()
      let month = this.selectedMonth ? this.selectedMonth : moment().month() + 1
      this.$api.get(`/api/v1/attendances/get_monthly_salary/?business=${this.business.id}&year=${year}&month=${month}`).then(res => {
        this.salary = res.data
      }).catch(err => console.log(err))
    },
    getPrevSalaryInfo () {
      this.$api.get(`/api/v1/attendances/get_monthly_salary/?business=${this.business.id}&year=${this.prevMonth.year()}&month=${this.prevMonth.month() + 1}`).then(res => {
        this.prevMonthSalary = res.data
      }).catch(err => console.log(err))
    },
    getHolidayPolicies () {
      this.$api.get(`/api/v1/holiday-policies/?business=${this.business.id}`).then(res => {
        this.holidays = res.data
      })
    },
    savePayroll (year, month) {
      this.$api.get(`/api/v1/attendances/get_monthly_salary/?business=${this.business.id}&year=${year}&month=${month}&save=true`)
    }
  },
  mounted () {
    if (!this.$store.state.members) {
      this.$store.dispatch('MEMBERS').then(() => {
        this.getBusiness()
        this.load()
      })
    }
    this.getBusiness()
    this.load()
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
