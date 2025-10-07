<template>
  <div>
    <v-data-table :headers="headers" :items="competencias" sort-by="calories" class="elevation-3">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Conductas asociadas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="900px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                Crear
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.competencia" label="competencia"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.descripcion" label="Descripcion"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select v-model="editedItem.th_pilar_id" :items="pilares"  label="Selecciona el pilar" item-text="nombre" item-value="id"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="success" @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="warning" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonCompetenciaComponent',

    data() {
      return {
        dialog: false,
        dialogDelete: false,
        headers: [{
            text: 'competencia',
            align: 'start',
            value: 'competencia',
          },
          {
            text: 'descripcion',
            value: 'descripcion'
          },
          {
            text: 'Pilar',
            value: 'th_pilar_id'
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          },
        ],
        pilares: [],
        competencias: [],
        editedIndex: -1,
        editedItem: {
          descripcion: '',
          competencia: '',
          th_pilar_id: '',
        },
        defaultItem: {
          descripcion: '',
          competencia: '',
          th_pilar_id: '',
        },
      };
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nuevo Competencia' : 'Editar Competencia'
      },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },

    created() {
      this.listarPilares()
      this.listarCompetencias()
    },

    methods: {

      listarPilares(){
        this.$axios.get('/th-pilares').then(res => {
          this.pilares = res.data;
        })
      },

      listarCompetencias(){
        this.$axios.get('/th-competencias').then(res => {
          this.competencias = res.data;
        })
      },

      editItem(item) {
        this.editedIndex = this.competencias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save() {
        if (this.editedIndex > -1) {
          this.$axios.put('/th-competencias/' + this.editedItem.id, this.editedItem).then(res => {
            this.$toast.success('Competencia actualizada con exito!.')
            this.listarCompetencias()
          }).catch(error => {
            this.$toast.error(error.response.data.mensaje)
          })
        } else {
          this.$axios.post('/th-competencias/crear', this.editedItem).then(res => {
            this.$toast.success('Competencia creada con exito!.')
            this.listarCompetencias()
          }).catch(error => {
            this.$toast.error(error.response.data.mensaje)
          })
        }
        this.close()
      },
    },
  };

</script>

<style lang="scss" scoped>

</style>
