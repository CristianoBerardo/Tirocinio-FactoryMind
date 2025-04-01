<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
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
      :rules="[val => !!val || 'Grade is required']"
    />
    
    <q-input
      v-model.number="form.gpa"
      label="GPA"
      type="number"
      step="0.01"
      min="0"
      max="4.0"
      :rules="[
        val => val !== null || 'GPA is required',
        val => val >= 0 && val <= 4.0 || 'GPA must be between 0 and 4.0'
      ]"
    />
    
    <q-input
      v-model="form.enrollment_date"
      label="Enrollment Date"
      type="date"
      :rules="[val => !!val || 'Enrollment date is required']"
    />
    
    <q-toggle v-model="form.active" label="Active" />
    
    <div class="row justify-end q-mt-md">
      <q-btn label="Cancel" color="negative" flat class="q-ml-sm" @click="$emit('cancel')" />
      <q-btn label="Submit" type="submit" color="primary" class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script>
export default {
  name: 'StudentForm',
  props: {
    student: {
      type: Object,
      default: () => ({
        name: '',
        email: '',
        grade: '',
        gpa: null,
        enrollment_date: '',
        active: true
      })
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { ...this.student }
    }
  },
  watch: {
    student(newStudent) {
      this.form = { ...newStudent }
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.form)
    }
  }
}
</script>