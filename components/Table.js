import MaskTextField from "./MaskTextField.js";
import { minMax } from "./../js/utils.js";

const template = `
<div>
  <v-data-table :headers="header" :items="data" :items-per-page="10">
    <template v-slot:top>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-dialog v-model="modalIsOpen" max-width="600">
          <template v-slot:activator="{ on, attr}">
            <v-btn @click="newContact" dark class="blue" :on="on" :bind="attr">
              Adicionar Contato
            </v-btn>
          </template>
          <v-card elevation="0">
            <v-card-title class="text-h5">{{ setTitle }}</v-card-title>
            <v-card-text>
              <v-container>
              <v-row>
                <v-subheader>Informações de contato</v-subheader>
                <v-col cols="12" class="pb-0">
                <v-text-field
                  hint="Aqui vai o nome do contato"
                  v-model="newUser.name"
                  persistent-hint
                  label="Nome"
                  :rules="[rules.required, rules.validityCharacters]"
                  outlined
                ></v-text-field>
                </v-col>
                <v-col cols="12">
                <mask-text-field
                  type="tel"
                  v-model="newUser.tel"
                  label="Telefone"
                  :properties="{
                    hint: 'Ex.: (55) 1234-5678',
                    outlined: true,
                    persistentHint: true,
                    rules: [rules.required, rules.validityNumber],
                  }"
                  :options="{
                    inputMask: '(##) # ####-####',
                    outputMask: '## #########',
                    empty: null,
                  }
                  "
                ></mask-text-field>
                </v-col>
              </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                outlined
                class="me-4 grey--text--darken-2"
                @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                class="px-3 blue white--text"
                elevation="0"
                outlined
                @click="saveUser"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <template v-slot:item="{ item }">
      <tr :class="item.tel.includes('11 ') && 'blue white--text'">
        <td class="text-center">
          <v-avatar
            :color="item.tel.includes('11 ') ? 'white' : 'blue'"
            :class="!item.tel.includes('11 ') ? 'white--text' : 'blue--text'"
            size="35"
          >
            {{ item.icon }}
          </v-avatar>
        </td>
        <td>
          {{item.name}}
        </td>
        <td>
          {{item.tel}}
        </td>
        <td>
          <v-icon small :color="item.tel.includes('11 ') ? 'white' : 'blue'" class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon small :color="item.tel.includes('11 ') ? 'white' : 'blue'" @click="deleteItem(item)"> mdi-delete </v-icon>   
        </td>
      </tr>
    </template>
  </v-data-table>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
  >
  {{ snackText }}
  <template v-slot:action="{ attrs }">
    <v-btn
      color="blue"
      text
      v-bind="attrs"
      @click="snackbar = false"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </template>
  </v-snackbar>
</div>
`;

const Table = Vue.component("DataTable", {
  template,
  data() {
    return {
      // Modal 
      modalIsOpen: false,
      modeDialog: -1,
      newUser: {
        name: '',
        tel: '',
      },
      isValidity: false,
      // Table list itens
      header: [
        { text: "#", value: "icon", align: "center" },
        { text: "Nome", value: "name" },
        { text: "Telefone", value: "tel" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      data: [],
      // Validity 
      rules: {
        required: value => !!value || 'Campo obrigatório',
        validityCharacters: value => minMax(value, 3, "Preencha com o nome do contato!"),
        validityNumber: value => minMax(value, 8, "Preencha com o número completo!"),
      },
      // Snack 
      snackbar: false,
      timeout: 1800,
      snackText: ""
    };
  },
  components: {
    MaskTextField
  },
  methods: {
    // Modal
    close() {
      this.modalIsOpen = false;
    },
    open() {
      this.modalIsOpen = true;
    },
    // Table
    newContact() {
      this.newUser = { name: '', tel: '' };
      this.modeDialog = -1;
      this.open();
    },
    saveUser() {
      this.validityUser();

      let user = { ...this.newUser, icon: this.factoryInitialLetter(this.newUser.name) };
      this.isValidity
        ?
        this.modeDialog === -1
          ? this.data.push(user) &&
            (this.alertUser("Contato adicionado com sucesso!") ??
            this.close())

          : Object.assign(this.data[this.modeDialog], user) &&
            (this.alertUser("Contato atualizado com sucesso!") ??
            this.close())
        : this.alertUser("Os campos estão vazios!");

    },
    editItem(item) {
      this.newUser = Object.assign({}, item);
      this.modeDialog = this.data.indexOf(item);
      this.open();
    },
    deleteItem(item) {
      this.data.splice(this.data.indexOf(item), 1);
    },
    factoryInitialLetter(word) {
      let wordArr = word.split(" ");
      return wordArr.length > 1
        ? wordArr
          .map((word) => word.substring(0, 1))
          .reduce((acc, word) => (acc ? acc + word : word), "")
          .slice(0, 2)
        : wordArr[0].substring(0, 1);
    },
    validityUser() {
      this.isValidity = !!this.newUser.name.length && !!this.newUser.tel.length;
    },
    // Toast
    alertUser(text) {
      this.snackText = text;
      this.snackbar = true;
    },
  },
  computed: {
    setTitle() {
      return this.modeDialog === -1 ? "Adicionar novo contato" : "Editar contato";
    },
  }
});
export default Table;