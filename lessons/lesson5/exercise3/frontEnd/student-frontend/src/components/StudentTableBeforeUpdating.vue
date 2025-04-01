<template>
  <div class="student-table">
    <h2>Student Management System</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <p>Loading students...</p>
    </div>
    
    <!-- Error state -->
    <q-banner v-if="error" class="bg-negative text-white q-mb-md">
      {{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Retry" @click="fetchStudents" />
      </template>
    </q-banner>
    
    <!-- Search and filters -->
    <div class="q-pa-md">
      <q-input
        v-model="filter"
        dense
        clearable
        placeholder="Search students"
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="gradeFilter"
            :options="['All', 'A', 'B', 'C', 'D', 'F']"
            label="Grade"
            dense
            outlined
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-toggle v-model="activeOnly" label="Active students only" />
        </div>
      </div>
    </div>
    
    <!-- Student Table -->
    <q-table
      :rows="filteredStudents"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <!-- Custom header slot if needed -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>Actions</q-th>
        </q-tr>
      </template>
      
      <!-- Body slot for custom rendering -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <!-- Special formatting for specific columns -->
            <template v-if="col.name === 'active'">
              <q-badge :color="props.row.active ? 'positive' : 'negative'">
                {{ props.row.active ? 'Active' : 'Inactive' }}
              </q-badge>
            </template>
            <template v-else-if="col.name === 'gpa'">
              <q-chip
                :color="getGpaColor(props.row.gpa)"
                text-color="white"
                size="sm"
              >
                {{ props.row.gpa }}
              </q-chip>
            </template>
            <template v-else-if="col.name === 'enrollment_date'">
              {{ formatDate(props.row.enrollment_date) }}
            </template>
            <template v-else>
              {{ props.row[col.name] }}
            </template>
          </q-td>
          
          <!-- Actions column -->
          <q-td auto-width>
            <q-btn size="sm" color="primary" icon="edit" dense flat />
            <q-btn size="sm" color="negative" icon="delete" dense flat />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import axios from 'axios'
import { date } from 'quasar'

export default {
  name: 'StudentTable',
  data() {
    return {
      students: [],
      loading: false,
      error: null,
      filter: '',
      gradeFilter: 'All',
      activeOnly: false,
      pagination: {
        rowsPerPage: 10
      },
      columns: [
        { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'left' },
        { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' },
        { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' },
        { name: 'grade', label: 'Grade', field: 'grade', sortable: true, align: 'center' },
        { name: 'gpa', label: 'GPA', field: 'gpa', sortable: true, align: 'center' },
        { name: 'enrollment_date', label: 'Enrollment Date', field: 'enrollment_date', sortable: true },
        { name: 'active', label: 'Status', field: 'active', sortable: true, align: 'center' }
      ]
    }
  },
  computed: {
    filteredStudents() {
      let filtered = [...this.students]
      
      // Apply grade filter
      if (this.gradeFilter !== 'All') {
        filtered = filtered.filter(student => student.grade === this.gradeFilter)
      }
      
      // Apply active filter
      if (this.activeOnly) {
        filtered = filtered.filter(student => student.active)
      }
      
      return filtered
    }
  },
  methods: {
    async fetchStudents() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('http://localhost:8000/api/students/')
        this.students = response.data
      } catch (error) {
        console.error('Error fetching students:', error)
        this.error = 'Failed to load students. Please try again.'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateStr) {
      return date.formatDate(dateStr, 'MMMM D, YYYY')
    },
    getGpaColor(gpa) {
      if (gpa >= 3.5) return 'positive'
      if (gpa >= 3.0) return 'primary'
      if (gpa >= 2.5) return 'warning'
      return 'negative'
    }
  },
  created() {
    this.fetchStudents()
  }
}
</script>

<style scoped>
.student-table {
  max-width: 1200px;
  margin: 0 auto;
}
</style>