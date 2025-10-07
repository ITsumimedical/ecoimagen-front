<template>
  <div>
    <v-data-table :headers="headers" :items="pilares" sort-by="calories" class="elevation-3">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Competencias</v-toolbar-title>
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
                      <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.porcentaje" type="number" label="Porcentaje"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.orden" type="number" label="Orden"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select v-model="editedItem.th_tipo_plantilla_id" :items="plantillas"  label="Tipo plantilla" item-text="nombre" item-value="id"></v-select>
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
      <template v-slot:[`item.th_tipo_plantilla_id`]="{ item }">
      <v-chip
        :color="getColor(item.th_tipo_plantilla_id)"
        dark
      >
        {{
            item.th_tipo_plantilla_id == 1 ? 'nivel directivo' : '' ||
            item.th_tipo_plantilla_id == 2 ? 'nivel táctico con perso a cargo' : '' ||
            item.th_tipo_plantilla_id == 3 ? 'nivel táctico sin perso a cargo' : '' ||
            item.th_tipo_plantilla_id == 4 ? 'nivel técnico asistencial' : ''
        }}
      </v-chip>
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
    name: 'WorkspaceJsonPilarComponent',

    data() {
      return {
        dialog: false,
        dialogDelete: false,
        headers: [{
            text: 'Nombre',
            align: 'start',
            value: 'nombre',
          },
          {
            text: 'Porcentaje',
            value: 'porcentaje'
          },
          {
            text: 'Orden',
            value: 'orden'
          },
          {
            text: 'Tipo Plantilla',
            value: 'th_tipo_plantilla_id'
          },
          {
            text: 'Estado',
            value: 'fat'
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          },
        ],
        pilares: [],
        plantillas: [],
        editedIndex: -1,
        editedItem: {
          nombre: '',
          porcentaje: '',
          orden: '',
          th_tipo_plantilla_id: '',
          esta_activo: 1
        },
        defaultItem: {
          nombre: '',
          porcentaje: '',
          orden: '',
          th_tipo_plantilla_id: '',
          esta_activo: 1
        },
      };
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nuevo Pilar' : 'Editar Pilar'
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

    mounted() {
      this.listarPilares()
      this.listarPlantillas()
    },

    methods: {

      listarPilares(){
        this.$axios.get('/th-pilares').then(res => {
          console.log('as', res.data);
          this.pilares = res.data;
        })
      },

      listarPlantillas(){
        this.$axios.get('/th-tipo-plantillas').then(res => {
          this.plantillas = res.data;
        })
      },

      editItem(item) {
        this.editedIndex = this.pilares.indexOf(item)
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
          this.$axios.put('/th-pilares/' + this.editedItem.id, this.editedItem).then(res => {
            this.$toast.success('Pilar actualizado con exito!.')
            this.listarPlantillas()
            this.listarPilares()
          }).catch(error => {
            this.$toast.error(error.response.data.mensaje)
          })
        } else {
          this.$axios.post('/th-pilares/crear', this.editedItem).then(res => {
            this.$toast.success('Pilar creado con exito!.')
            this.listarPlantillas()
            this.listarPilares()
          }).catch(error => {
            this.$toast.error(error.response.data.mensaje)
          })
        }
        this.close()
      },
      getColor (th_tipo_plantilla_id) {
        if (th_tipo_plantilla_id == 1) return 'green'
        else if (th_tipo_plantilla_id == 2) return 'orange'
        else if (th_tipo_plantilla_id == 3) return 'blue'
        else return 'purple'
      },
    },
  };

</script>

<style lang="scss" scoped>

</style>
