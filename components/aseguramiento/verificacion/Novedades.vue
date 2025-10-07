<template>
  <div>
    <v-data-table :headers="headers" :search="buscarProveedor" :items="listaProveedores" sort-by="id"
      class="elevation-1" :loading="loading" loading-text="Cargando..." hide-default-footer>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon small color="warning" @click="ModalEditarProveedor(item)">
                mdi-pencil
              </v-icon>
            </v-btn>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        No hay información para mostrar
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarPrestador()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  // import {
  //   listarPrestador,
  // } from '@/api/admin/proveedores/prestador'
  // import CrearProveedoresComponent from '@/components/admin/proveedores/CrearProveedores.vue'
  // import EditarProveedoresComponent from '@/components/admin/proveedores/EditarProveedores.vue'

  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    // components: {
    //   CrearProveedoresComponent,
    //   EditarProveedoresComponent
    // },
    data() {
      return {
        datos: {},
        loading: false,
        dialogo: false,
        componente: null,
        buscarProveedor: '',
        listaProveedores: [],
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Tipo Novedad',
            value: 'tipo_documento'
          },
          {
            text: 'Fecha de Novedad',
            value: 'numero_documento'
          },
          {
            text: 'Fecha de Creacion',
            value: 'nombre'
          },
          {
            text: 'Fecha de Actualizacion',
            value: 'nombre'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    mounted() {
      this.listarPrestador();
    },

    methods: {

      cerrar() {
        this.dialog = false
        this.limpiarError()
        this.limpiarData()
      },

      ModalCrearProveedor() {
        this.dialogo = true
        this.componente = 'CrearProveedoresComponent'
      },

      ModalEditarProveedor(item) {
        this.dialogo = true
        this.datos = item
        this.componente = 'EditarProveedoresComponent'
      },

      async listarPrestador() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarPrestador(this.paginate.page))
          this.listaProveedores = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      }
    },
  };

</script>
