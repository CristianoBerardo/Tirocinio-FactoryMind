<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Student Management System
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <student-table />
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center text-subtitle2">
            Vue.js + Django + Quasar Student Management System © {{ new Date().getFullYear() }}
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import StudentTable from './components/StudentTableBeforeUpdating.vue';

export default {
  name: 'App',
  components: {
    StudentTable
  }
}
</script>