import DataTable from "./../components/Table.js";
const template = `
<v-app>
  <v-app-bar app color="primary" dark :fixed="false">
    <v-container>
      <h3 class="h3">Lista de contatos</h3>
    </v-container>
  </v-app-bar>
  <v-divider class="my-10"></v-divider>
  <v-container>
    <data-table></data-table>
  </v-container>
</v-app>

`
// Render Layer
new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return {
      //
    };
  },
  components: {
    DataTable,
  },
  template,
});