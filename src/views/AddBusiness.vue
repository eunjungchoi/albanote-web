<template>
  <div>
    <h4 class="my-3 font-weight-bold">사업장을 등록해주세요</h4>
    <hr>
    <b-form @submit.prevent="add">
      <b-form-group label="사업자상호" label-for="license-name">
        <b-form-input id="license-name" type="text" v-model="form.license_name"></b-form-input>
      </b-form-group>
      <b-form-group label="사업자등록번호" label-for="license-number">
        <b-form-input id="license-number" type="text" v-model="form.license_number" placeholder="예: 123 45 67890"></b-form-input>
      </b-form-group>
      <b-form-group label="사업자 주소" label-for="address">
        <b-form-input id="address" type="text" v-model="form.address"></b-form-input>
      </b-form-group>
      <b-button class="btn-block btn-lg cashnote-green" type="submit" variant="secondary">등록</b-button>
    </b-form>
    <div class="my-3 text-muted text-center">
      <span>* 본인과 관계 없는 사업장을 등록하는 경우 이용이 제한될 수 있습니다.</span></div>

  </div>
</template>
<script>
export default {
  name: 'addBusiness',
  data () {
    return {
      form: {
        license_name: null,
        license_number: null,
        address: null
      }
    }
  },
  methods: {
    add () {
      this.$store.dispatch('ADDBUSINESS', this.form)
    }
  }
}
</script>
