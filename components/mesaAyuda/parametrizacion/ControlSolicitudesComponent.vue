<template>
  <div>
    <v-card-title>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete label="Categorias" :items="categorias" v-model="form.categoria_mesa_ayuda_id"
          item-text="nombreCategoria" item-value="categoria_id" @click="fetchCategorias()"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="5">
        <v-autocomplete label="Empleados" :items="empleados" v-model="form.empleado_id" item-text="nombre_completo"
          item-value="id" @click="fetchEmpleados()"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-btn small color="success" class="mr-4" @click="guardarSolicitud()">
          <v-icon left>
            mdi-plus-box
          </v-icon>
          guardar
        </v-btn>
      </v-col>
    </v-card-title>

    <v-card-title>
      Solicitudes
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="solicitudes" dense :loading="loading" :search="search">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="red" @click="remover(item)">
          mdi-delete-forever
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
    name: 'FrontHorusControlSolicitudesComponent',

    data() {
      return {
        search: '',
        categorias: [],
        empleados: [],
        solicitudes: [],
        form: {
          categoria_mesa_ayuda_id: '',
          empleado_id: '',
        },
        headers: [{
            text: 'id',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Categoria',
            value: 'nombreCategoria'
          },
          {
            text: 'Empleado',
            value: 'nombreCompleto'
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    created() {
      this.fetchSolicitudes()
    },

    methods: {

      /**
       * Consultar todas las categorias activas
       * @author Calvarez
       */
      fetchCategorias() {
        this.loading = true
        this.$axios.get('/CategoriaMesaAyuda/listar').then(res => {
          this.loading = false
          this.categorias = res.data
        }).catch(error => {
          this.toast.error('No se encontraron categorias')
        })
      },

      /**
       * Consultar todos los empleados activos
       * @author Calvarez
       */
      fetchEmpleados() {
        this.loading = true
        this.$axios.get('/empleados/listar').then(res => {
          this.loading = false
          this.empleados = res.data.data
        }).catch(error => {
          this.toast.error('No se encontraron empleados')
        })
      },

      fetchSolicitudes() {
        this.loading = true
        this.$axios.get('/solicitudes/listar').then(res => {
          this.loading = false
          this.solicitudes = res.data
        }).catch(error => {

        })
      },

      /**
       * Guardar parametrizacion de solicitudes mesa ayuda
       * @author Calvarez
       */
      guardarSolicitud() {
        this.loading = true
        this.$axios.post('/solicitudes/crear', this.form).then(res => {
          this.loading = false
        }).catch(error => {
          this.toast.error('No se encontraron empleados')
        })
      },

      remover(item){
        console.log('eso Julian');
      }
    },
  };

</script>

<style lang="scss" scoped>

</style>
