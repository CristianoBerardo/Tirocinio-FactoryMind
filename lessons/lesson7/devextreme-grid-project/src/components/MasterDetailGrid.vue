<template>
  <div class="master-detail-grid-container">
    <div id="masterDetailGridContainer"></div>
  </div>
</template>

<script>
// Correzione dell'importazione di DataGrid
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import DataGrid from "devextreme/ui/data_grid";

export default {
  name: "MasterDetailGrid",
  data() {
    return {
      dataGrid: null,
      suppliers: [
        {
          ID: 1,
          CompanyName: "Elettronica S.p.A.",
          ContactName: "Roberto Ferrari",
          ContactTitle: "Direttore Vendite",
          City: "Milano",
          Country: "Italia",
        },
        {
          ID: 2,
          CompanyName: "Arredamenti Moderni",
          ContactName: "Silvia Verdi",
          ContactTitle: "Proprietario",
          City: "Roma",
          Country: "Italia",
        },
        {
          ID: 3,
          CompanyName: "Tech Solutions",
          ContactName: "John Smith",
          ContactTitle: "CEO",
          City: "Londra",
          Country: "Regno Unito",
        },
      ],
      products: [
        {
          ID: 1,
          ProductName: "Laptop XPS-15",
          SupplierID: 1,
          UnitPrice: 1299.99,
          UnitsInStock: 15,
          Discontinued: false,
        },
        {
          ID: 2,
          ProductName: "Monitor UltraWide",
          SupplierID: 1,
          UnitPrice: 349.99,
          UnitsInStock: 25,
          Discontinued: false,
        },
        {
          ID: 3,
          ProductName: "Tastiera Meccanica",
          SupplierID: 1,
          UnitPrice: 129.99,
          UnitsInStock: 30,
          Discontinued: false,
        },
        {
          ID: 4,
          ProductName: "Scrivania Ergonomica",
          SupplierID: 2,
          UnitPrice: 599.99,
          UnitsInStock: 5,
          Discontinued: false,
        },
        {
          ID: 5,
          ProductName: "Sedia da Ufficio",
          SupplierID: 2,
          UnitPrice: 249.99,
          UnitsInStock: 10,
          Discontinued: false,
        },
        {
          ID: 6,
          ProductName: "Software Gestionale",
          SupplierID: 3,
          UnitPrice: 799.99,
          UnitsInStock: 0,
          Discontinued: false,
        },
        {
          ID: 7,
          ProductName: "Server Cloud",
          SupplierID: 3,
          UnitPrice: 1999.99,
          UnitsInStock: 3,
          Discontinued: false,
        },
      ],
    };
  },
  mounted() {
    this.initializeGrid();
  },
  methods: {
    initializeGrid() {
      const suppliersDataSource = new DataSource({
        store: new ArrayStore({
          data: this.suppliers,
          key: "ID",
        }),
      });

      this.dataGrid = new DataGrid(
        document.getElementById("masterDetailGridContainer"),
        {
          dataSource: suppliersDataSource,
          showBorders: true,
          columnAutoWidth: true,
          hoverStateEnabled: true,

          columns: [
            { dataField: "ID", caption: "ID", width: 50 },
            { dataField: "CompanyName", caption: "Azienda" },
            { dataField: "ContactName", caption: "Contatto" },
            { dataField: "ContactTitle", caption: "Titolo" },
            { dataField: "City", caption: "Città" },
            { dataField: "Country", caption: "Paese" },
          ],

          masterDetail: {
            enabled: true,
            template: (container, options) => {
              const supplier = options.data;
              const supplierProducts = this.products.filter(
                (product) => product.SupplierID === supplier.ID
              );
              const detailGridContainer = document.createElement("div");
              container.appendChild(detailGridContainer);

              new DataGrid(detailGridContainer, {
                dataSource: supplierProducts,
                columnAutoWidth: true,
                showBorders: true,
                columns: [
                  { dataField: "ID", caption: "ID", width: 50 },
                  { dataField: "ProductName", caption: "Prodotto" },
                  {
                    dataField: "UnitPrice",
                    caption: "Prezzo",
                    dataType: "number",
                  },
                  {
                    dataField: "UnitsInStock",
                    caption: "Disponibilità",
                    dataType: "number",
                  },
                  {
                    dataField: "Discontinued",
                    caption: "Fuori prod.",
                    dataType: "boolean",
                    cellTemplate: (container, options) => {
                      const div = document.createElement("div");
                      div.innerHTML = options.value ? "✓" : "✗";
                      container.appendChild(div);
                    },
                  },
                ],
                summary: {
                  totalItems: [
                    {
                      column: "UnitPrice",
                      summaryType: "sum",
                      displayFormat: "Totale: {0}",
                    },
                    {
                      column: "UnitsInStock",
                      summaryType: "sum",
                      displayFormat: "Totale prodotti: {0}",
                    },
                  ],
                },
                onContentReady: () => {
                  if (supplierProducts.length === 0) {
                    const noDataElement = document.createElement("div");
                    noDataElement.className = "no-data-available";
                    noDataElement.textContent =
                      "Nessun prodotto disponibile per questo fornitore";
                    container.innerHTML = "";
                    container.appendChild(noDataElement);
                  }
                },
              });
            },
          },
        }
      );
    },
  },
  beforeUnmount() {
    if (this.dataGrid) {
      this.dataGrid.dispose();
    }
  },
};
</script>

<style>
.master-detail-grid-container {
  padding: 20px;
  height: 600px;
}

.no-data-available {
  padding: 20px;
  text-align: center;
  font-style: italic;
  color: #999;
}
</style>
