<template>
  <div>
    <v-card-title>
      <v-btn tile small color="success" @click="dialogPrioridad = true">
        Crear prioridad
        <v-icon right>
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" dense append-icon="mdi-magnify" label="Buscar" single-line hide-details>
      </v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="prioridades" dense :search="search" :loading="loading">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" color="warning" @click="editarPrioridad(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogPrioridad" persistent max-width="750px">
      <v-card>
        <v-alert dense text border="left" type="info">Creación de prioridad</v-alert>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="8" md="8">
              <v-text-field dense v-model="form.nombre" label="Nombre"></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field dense v-model="form.tiempo" label="Tiempo (minutos)"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea auto-grow dense v-model="form.descripcion" label="Descripción"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" dark @click="dialogPrioridad = false">
            Cerrar
          </v-btn>
          <v-btn small color="success" dark @click="guardarPrioridad()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEditarPrioridad" persistent max-width="750px">
      <v-card>
        <v-alert dense text border="left" type="info">Actualización de prioridad</v-alert>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="8" md="8">
                <v-text-field dense v-model="datosPrioridad.nombre" label="Nombre"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field dense v-model="datosPrioridad.tiempo" label="Tiempo (minutos)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea auto-grow dense v-model="datosPrioridad.descripcion" label="Descripción"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" dark @click="dialogEditarPrioridad = false">
            Cerrar
          </v-btn>
          <v-btn small color="success" dark @click="updatePrioridad()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    name: 'FrontHorusPrioridadesComponent',

    data() {
      return {
        loading: false,
        prioridades: [],
        dialogPrioridad: false,
        dialogEditarPrioridad: false,
        form: {
          nombre: '',
          descripcion: '',
          tiempo: ''
        },
        search: '',
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
            text: 'Descripcion',
            value: 'descripcion'
          },
          {
            text: 'Tiempo',
            value: 'tiempo'
          },
          // {
          //   text: 'Estado',
          //   value: 'estado_id'
          // },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        datosPrioridad: []
      };
    },

    created() {
      this.fetchPrioridades()
    },

    methods: {

      fetchPrioridades() {
        this.loading = true
        this.$axios.get('/prioridades/listar-prioridades').then(res => {
          this.prioridades = res.data
          this.loading = false
        }).catch(error => {
          this.toast.error('No se encontro prioridades')
        })
      },

      guardarPrioridad() {
        this.$axios.post('/prioridades/crear', this.form).then(res => {
          this.$toast.success(res.data.mensaje)
          this.dialogPrioridad = false
          this.fetchPrioridades()
        })
      },

      editarPrioridad(datos) {
        this.datosPrioridad = datos
        this.dialogEditarPrioridad = true
      },

      updatePrioridad() {

        this.$axios.put('/prioridades/' + this.datosPrioridad.id, this.datosPrioridad).then(res => {
          this.$toast.success(res.data.mensaje)
          this.dialogEditarPrioridad = false
          this.fetchPrioridades()
        })
      }

    },
  };

</script>

<style lang="scss" scoped>

</style>
