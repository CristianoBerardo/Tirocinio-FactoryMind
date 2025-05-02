
<template>
  <div class="odata-grid-container">
    <div id="gridContainer"></div>
  </div>
</template>

<script>
// Correzione dell'importazione di DataGrid
import DataGrid from 'devextreme/ui/data_grid';
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

export default {
  name: 'ODataGrid',
  data() {
    return {
      dataGrid: null
    };
  },
  mounted() {
    this.initializeGrid();
  },
  methods: {
    initializeGrid() {
      // Resto del codice invariato
      const customODataStore = new ODataStore({
        url: 'https://js.devexpress.com/Demos/SampleData/odata/Products',
        key: 'ProductID',
        beforeSend: (request) => {
          request.headers['Custom-Header'] = 'CustomValue';
          console.log('Sending OData request:', request);
        },
        errorHandler: (error) => {
          console.error('OData Error:', error);
        }
      });

      const dataSource = new DataSource({
        store: customODataStore,
        paginate: true,
        pageSize: 10,
        sort: [
          { selector: 'ProductName', desc: false }
        ]
      });

      this.dataGrid = new DataGrid(document.getElementById('gridContainer'), {
        dataSource: dataSource,
        showBorders: true,
        remoteOperations: true,
        columnAutoWidth: true,
        hoverStateEnabled: true,
        paging: {
          pageSize: 10
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [5, 10, 20],
          showInfo: true
        },
        filterRow: {
          visible: true,
          applyFilter: 'auto'
        },
        headerFilter: {
          visible: true
        },
        searchPanel: {
          visible: true,
          width: 240,
          placeholder: 'Cerca...'
        },
        sorting: {
          mode: 'multiple'
        },
        columns: [
          { dataField: 'ProductID', caption: 'ID', width: 70 },
          { dataField: 'ProductName', caption: 'Prodotto' },
          { dataField: 'UnitPrice', caption: 'Prezzo', dataType: 'number', format: 'currency' },
          { dataField: 'UnitsInStock', caption: 'Disponibilità', dataType: 'number' },
          { dataField: 'Discontinued', caption: 'Fuori prod.', dataType: 'boolean' }
        ],
        onContentReady: (e) => {
          console.log('Grid content ready:', e);
        }
      });
    }
  },
  beforeUnmount() {
    if (this.dataGrid) {
      this.dataGrid.dispose();
    }
  }
}
</script>

<style>
.odata-grid-container {
  padding: 20px;
  height: 600px;
}
</style>