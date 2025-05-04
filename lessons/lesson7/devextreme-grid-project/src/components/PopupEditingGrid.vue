
<template>
  <div class="popup-editing-grid-container">
    <div id="editingGridContainer"></div>
  </div>
</template>

<script>
// Correzione dell'importazione di DataGrid
import DataGrid from 'devextreme/ui/data_grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

export default {
  name: 'PopupEditingGrid',
  data() {
    return {
      dataGrid: null,
      employees: [
        { ID: 1, FirstName: "Mario", LastName: "Rossi", Position: "Sviluppatore", BirthDate: new Date(1985, 4, 15), HireDate: new Date(2012, 3, 20), Email: "mario.rossi@example.com", Phone: "+39 123 456 7890", Address: "Via Roma 123, Milano" },
        { ID: 2, FirstName: "Laura", LastName: "Bianchi", Position: "Project Manager", BirthDate: new Date(1982, 8, 22), HireDate: new Date(2010, 5, 15), Email: "laura.bianchi@example.com", Phone: "+39 098 765 4321", Address: "Via Verdi 45, Roma" },
        { ID: 3, FirstName: "Giuseppe", LastName: "Verdi", Position: "UX Designer", BirthDate: new Date(1990, 2, 8), HireDate: new Date(2015, 9, 1), Email: "giuseppe.verdi@example.com", Phone: "+39 333 444 5566", Address: "Via Garibaldi 67, Torino" },
        { ID: 4, FirstName: "Francesca", LastName: "Neri", Position: "Sviluppatore Senior", BirthDate: new Date(1983, 11, 12), HireDate: new Date(2011, 2, 10), Email: "francesca.neri@example.com", Phone: "+39 111 222 3333", Address: "Via Mazzini 89, Firenze" },
      ]
    };
  },
  mounted() {
    this.initializeGrid();
  },
  methods: {
    initializeGrid() {
      const dataSource = new DataSource({
        store: new ArrayStore({
          data: this.employees,
          key: 'ID'
        })
      });

      this.dataGrid = new DataGrid(document.getElementById('editingGridContainer'), {
        dataSource: dataSource,
        showBorders: true,
        columnAutoWidth: true,
        hoverStateEnabled: true,
        
        editing: {
          mode: 'popup',
          allowAdding: true,
          allowUpdating: true,
          allowDeleting: true,
          popup: {
            title: 'Dipendente',
            showTitle: true,
            width: 700,
            height: 'auto',
            position: {
              my: 'center',
              at: 'center',
              of: window
            }
          },
          form: {
            items: [
              {
                itemType: 'group',
                colCount: 2,
                items: ['FirstName', 'LastName', 'Position', 'BirthDate', 'HireDate']
              },
              {
                itemType: 'group',
                colCount: 2,
                items: ['Email', 'Phone', 'Address']
              }
            ]
          }
        },
        
        toolbar: {
          items: [
            {
              name: 'addRowButton',
              location: 'after',
              widget: 'dxButton',
              options: {
                icon: 'add',
                text: 'Aggiungi Dipendente',
                onClick: function() {
                  this.dataGrid.addRow();
                }.bind(this)
              }
            }
          ]
        },
        
        columns: [
          { dataField: 'ID', caption: 'ID', width: 50, allowEditing: false },
          { dataField: 'FirstName', caption: 'Nome', validationRules: [{ type: 'required' }] },
          { dataField: 'LastName', caption: 'Cognome', validationRules: [{ type: 'required' }] },
          { dataField: 'Position', caption: 'Posizione' },
          { dataField: 'BirthDate', caption: 'Data di nascita', dataType: 'date' },
          { dataField: 'HireDate', caption: 'Data assunzione', dataType: 'date' },
          { dataField: 'Email', caption: 'Email', validationRules: [{ type: 'email' }] },
          { dataField: 'Phone', caption: 'Telefono' },
          { dataField: 'Address', caption: 'Indirizzo', visible: false },
          {
            type: 'buttons',
            width: 110,
            buttons: ['edit', 'delete']
          }
        ],
        
        onRowInserting: (e) => {
          e.data.ID = Math.max(...this.employees.map(item => item.ID)) + 1;
        },
        
        onInitNewRow: (e) => {
          e.data.HireDate = new Date();
        },
        
        onEditorPreparing: (e) => {
          if (e.dataField === 'BirthDate' && e.parentType === 'dataRow') {
            e.editorOptions.max = new Date();
          }
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
.popup-editing-grid-container {
  padding: 20px;
  height: 600px;
}
</style>