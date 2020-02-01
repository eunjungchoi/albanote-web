<template>
  <div v-if="$store.state.user">
    <div>
      <h6 class="my-3"><strong>내 사업장</strong></h6>
      <div :key="member.business.license_number" v-for="member in $store.state.members">
        {{ member.business.license_name }} ({{ member.type === 'member' ? '일반 직원' : '관리자'}})
      </div>
    </div>
    <hr>
    <div>
      <h6><strong>이달 누적 월급</strong></h6>
      <div>: 총 00000원 </div>
      <div :key="member.business.license_number" v-for="member in $store.state.members">
        <div>{{ member.business.license_name }} : 총 00 시간  /  000 원 </div>
      </div>
    </div>
    <hr>
    <div>
      <h6 class="font-weight-bold"> 스케쥴</h6>
      <table class="w-100">
        <thead>
        <th>요일</th>
        <th>사업장</th>
        <th>시작시간</th>
        <th>종료시간</th>
        </thead>
        <tbody>
        <tr :key="time.day" v-for="time in $store.state.timetables">
          <td>{{ humanReadableDay(time.day) }}</td>
          <td>{{ time.member.business.license_name}}</td>
          <td>{{ time.start_time.slice(0 ,-3) }}</td>
          <td>{{ time.end_time.slice(0, -3) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <hr>
    <div>
      <h6><strong>{{ $store.state.user.name}} 님의 최근 근무내역</strong></h6>
      <table class="w-100">
        <thead>
          <th> 시작일시 </th>
          <th> 종료일시 </th>
          <th> 총 근무시간 </th>
          <th> 사업장 </th>
        </thead>
        <tbody>
          <tr :key="work.start_time" v-for="work in $store.state.works">
            <td>{{ work.start_time.slice(0, 16) }}</td>
            <td>{{ work.end_time.slice(0, 16) }}</td>
            <td>{{ work.duration.slice(0, -3) }}</td>
            <td>{{ work.member.business.license_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dashboard',
  data () {
    return {
      members: this.$store.state.members,
      works: this.$store.state.works
    }
  },
  methods: {
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
    }
  },
  mounted () {
    this.$store.dispatch('WORKS')
    this.$store.dispatch('TIMETABLES')
  }
}
</script>
