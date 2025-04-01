<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> Vue.js + Django + Quasar </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <StudentTable />
        <StudentForm />
        <StudentTableBeforeUpdating />
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center text-subtitle2">Vue.js + Django + Quasar</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import StudentForm from './components/StudentForm.vue'
import StudentTable from './components/StudentTable.vue'
import StudentTableBeforeUpdating from './components/StudentTableBeforeUpdating.vue'

export default {
  name: 'App',
  components: {
    StudentTable,
    StudentForm,
    StudentTableBeforeUpdating,
  },
}
</script>
