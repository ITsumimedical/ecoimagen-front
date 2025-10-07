<template>
  <div>
    <v-data-table :headers="headers" :items="tipolistar" class="elevation-1" :loading="loading"
      loading-text="Cargando..." no-data-text="No hay información que mostrar" hide-default-footer :search="buscarTipo">
      <template v-slot:top>
        <v-card-title>
            <span> Prioridad:</span>
            <span>
              <v-icon color="error">mdi-checkbox-marked-circle-outline</v-icon> Alta
            </span>
            <span>
              <v-icon color="yellow">mdi-checkbox-marked-circle-outline</v-icon> Media
            </span>
            <span>
              <v-icon color="success">mdi-checkbox-marked-circle-outline</v-icon> Baja
            </span>
          <v-spacer></v-spacer>
            <v-autocomplete v-model="tiposEstado" :items="estadostutela" label="Nombre"></v-autocomplete>
          <v-spacer></v-spacer>
            <v-text-field v-model="buscarTipo" label="Buscar" append-icon="mdi-magnify" hide-details single-line></v-text-field>
        </v-card-title>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7"
          @input="listarTipoAsignado()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>
<script>
  import {
    listarTutela,
    guardarTutela
  } from '@/api/tutelas/tutela'

  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'tipoRequerimiento',
    data: () => ({
      paginate: {
        total: 0,
        page: 1
      },
      items: [],
      estadostutela: ['GESTIONADO'],
      tiposEstado: '',
      loading: false,
      buscarTipo: '',
      tipolistar: [],
      dialogo: false,

      headers: [{
          text: 'id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {
          text: 'Fecha asignada',
          value: 'created_at'
        },
        {
          text: 'Resposable',
          value: 'dias'
        },
        {
          text: 'Respuesta',
          value: 'respuestas_tutela.responsable'
        },
        {
          text: 'Tipo requerimiento',
          value: 'tipo_requerimientos.nombre'
        },
        {
          text: 'Documento',
          value: 'radicado'
        },
        {
          text: 'Tiempo Cumplimiento',
          value: 'tipo_requerimientos.dias'
        },
        {
          text: 'Estado',
          value: 'estados.nombre'
        },
        {
          text: 'Acciones',
          align: 'rigth',
          value: 'actions',
          sortable: false
        }
      ],
    }),

    created() {
      this.listarTipoAsignado();
    },

    methods: {
      async listarTipoAsignado() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTutela(this.paginate.page))
          this.tipolistar = data.data
          this.paginate.total = data.last_page
          this.paginate.page = data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },

      cerrar() {
        this.dialogo = false
        this.limpiardata()
      },

      async guardarTipo() {
        try {
          const {
            data
          } = await this.$loadingPostRequest(guardarTipoRequerimientos(), this.tipoRequerimiento)
          this.$toast.success(data.mensaje)
          this.limpiarError()
          this.listarTipoAsignado()
          this.cerrar()
        } catch (error) {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        }
      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiardata() {
        for (const key in this.usuario) {
          this.usuario[key] = ''
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },
    },
  }

</script>
