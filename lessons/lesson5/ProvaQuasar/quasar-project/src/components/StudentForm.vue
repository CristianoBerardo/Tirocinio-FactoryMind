<template>
  <q-form @submit.prevent="submitForm" class="q-gutter-md">
    <q-input
      v-model="form.name"
      label="Name"
      :rules="[val => !!val || 'Name is required']"
    />
    
    <q-input
      v-model="form.email"
      label="Email"
      type="email"
      :rules="[
        val => !!val || 'Email is required',
        val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Please enter a valid email'
      ]"
    />
    
    <q-select
      v-model="form.grade"
      :options="['A', 'B', 'C', 'D', 'F']"
      label="Grade"
    />
    
    <q-input
      v-model.number="form.gpa"
      label="GPA"
      type="number"
      :rules="[
        val => val !== null && val !== undefined || 'GPA is required',
        val => val >= 0 && val <= 4 || 'GPA must be between 0 and 4'
      ]"
    />
    
    <q-input
      v-model="form.enrollment_date"
      label="Enrollment Date"
      type="date"
    />
    
    <q-toggle v-model="form.active" label="Active" />
    
    <div class="row justify-end q-mt-md">
      <q-btn flat label="Cancel" color="grey" @click="cancel" class="q-ml-sm" />
      <q-btn type="submit" label="Save" color="primary" class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script>
export default {
  name: 'StudentForm',
  props: {
    student: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        grade: 'B',
        gpa: 3.0,
        enrollment_date: '',
        active: true
      }
    }
  },
  watch: {
    student: {
      handler(newValue) {
        this.form = { ...newValue }
      },
      immediate: true
    }
  },
  methods: {
    submitForm() {
      // Emit the form data to parent
      this.$emit('submit', { ...this.form })
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>