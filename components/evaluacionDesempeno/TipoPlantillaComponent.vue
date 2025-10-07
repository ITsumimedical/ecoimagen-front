<template>
  <div>
    <v-data-table :headers="headers" :items="plantillas" sort-by="calories" class="elevation-3">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Tipos plantillas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
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
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedItem.nombre" label="nombre"></v-text-field>
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
    name: 'WorkspaceJsonTipoPlantillaComponent',

    data() {
      return {
        dialog: false,
        dialogDelete: false,
        headers: [{
            text: 'Id',
            align: 'start',
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Estado',
            value: 'esta_activo'
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          },
        ],
        plantillas: [],
        editedIndex: -1,
        editedItem: {
          nombre: '',
        },
        defaultItem: {
          nombre: '',
        },
      };
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nueva Plantilla' : 'Editas Plantilla'
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
      this.listarPlantillas()
    },

    methods: {
      listarPlantillas(){
        this.$axios.get('/th-tipo-plantillas').then(res => {
          this.plantillas = res.data;
        })
      },

      editItem(item) {
        this.editedIndex = this.plantillas.indexOf(item)
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
          this.$axios.put('/th-tipo-plantillas/' + this.editedItem.id, this.editedItem).then(res => {
            this.$toast.success('Plantilla actualizada con exito!.')
            this.listarPlantillas()
          }).catch(error => {
            this.$toast.error(error.response.data.mensaje)
          })
        } else {
          this.$axios.post('/th-tipo-plantillas/crear', this.editedItem).then(res => {
            this.$toast.success('Plantilla creada con exito!.')
            this.listarPlantillas()
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
