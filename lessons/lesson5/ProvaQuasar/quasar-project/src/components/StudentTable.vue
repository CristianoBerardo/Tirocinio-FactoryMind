// Updated StudentTable.vue (only showing the additions/changes)

<template>
  <div class="student-table">
    <!-- Rest of the template remains the same -->

    <!-- Add New Student Button -->
    <div class="q-pa-md">
      <q-btn color="primary" icon="add" label="Add New Student" @click="openStudentDialog()" />
    </div>

    <!-- Add after the q-table -->
    <!-- Student Form Dialog -->
    <q-dialog v-model="showStudentDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ isEditMode ? 'Edit Student' : 'Add New Student' }}</div>
        </q-card-section>

        <q-card-section>
          <student-form
            :student="currentStudent"
            :is-edit="isEditMode"
            @submit="saveStudent"
            @cancel="showStudentDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this student?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { date } from 'quasar'
import StudentForm from './StudentForm.vue'

export default {
  name: 'StudentTable',
  components: {
    StudentForm,
  },
  data() {
    return {
      // Keep existing data properties

      // Add new properties
      showStudentDialog: false,
      showDeleteDialog: false,
      isEditMode: false,
      currentStudent: {},
      studentToDelete: null,
      students: [],

      // Update the body slot in the template to include action buttons:
      // <q-td auto-width>
      //   <q-btn size="sm" color="primary" icon="edit" dense flat @click="editStudent(props.row)" />
      //   <q-btn size="sm" color="negative" icon="delete" dense flat @click="deleteStudent(props.row)" />
      // </q-td>
    }
  },
  methods: {
    // Keep existing methods

    // Add new methods
    openStudentDialog(student = null) {
      this.isEditMode = !!student
      this.currentStudent = student
        ? { ...student }
        : {
            name: '',
            email: '',
            grade: 'B',
            gpa: 3.0,
            enrollment_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
            active: true,
          }
      this.showStudentDialog = true
    },

    editStudent(student) {
      this.openStudentDialog(student)
    },

    deleteStudent(student) {
      this.studentToDelete = student
      this.showDeleteDialog = true
    },

    async confirmDelete() {
      if (!this.studentToDelete) return

      try {
        await axios.delete(`http://localhost:8000/api/students/${this.studentToDelete.id}/`)
        // Remove from local array
        this.students = this.students.filter((s) => s.id !== this.studentToDelete.id)
        this.$q.notify({
          color: 'positive',
          message: 'Student deleted successfully',
          icon: 'check',
        })
      } catch (error) {
        console.error('Error deleting student:', error)
        this.$q.notify({
          color: 'negative',
          message: 'Failed to delete student',
          icon: 'error',
        })
      }

      this.studentToDelete = null
    },

    async saveStudent(formData) {
      try {
        let response

        if (this.isEditMode) {
          if (!this.students) {
            this.students = []
          }

          // Update existing student
          response = await axios.put(`http://localhost:8000/api/students/${formData.id}/`, formData)

          // Update in local array
          const index = this.students.findIndex((s) => s.id === formData.id)
          if (index !== -1) {
            this.students[index] = response.data
          }

          this.$q.notify({
            color: 'positive',
            message: 'Student updated successfully',
            icon: 'check',
          })
        } else {
          // Create new student
          response = await axios.post('http://localhost:8000/api/students/', formData)

          // Add to local array
          this.students.push(response.data)

          this.$q.notify({
            color: 'positive',
            message: 'Student added successfully',
            icon: 'check',
          })
        }

        this.showStudentDialog = false
      } catch (error) {
        console.error('Error saving student:', error)
        this.$q.notify({
          color: 'negative',
          message: 'Failed to save student',
          icon: 'error',
        })
      }
    },
  },
}
</script>
