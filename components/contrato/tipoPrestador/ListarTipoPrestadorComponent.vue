<template>
  <v-data-table dense :headers="headers" :items="tipo_prestadores" :search="buscar" :loading="loading"
    loading-text="cargando..." class="elevation-1">
    <template v-slot:top>
      <v-card-title>
        <v-toolbar flat>
          <v-dialog persistent v-model="dialogs.form" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn small color="boton" dark class="mb-2" v-bind="attrs" v-on="on">
                crear tipo de prestador
              </v-btn>
            </template>
            <FormTipoPrestador :editar="editando" :tipo_prestador_id="tipo_prestador_id"
              @cerrar="dialogs.form = false, editando = false, tipo_prestador_id = null"
              @submit="getTipoPrestadores()" />
          </v-dialog>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar..." class="mx-4"></v-text-field>
        </v-toolbar>
      </v-card-title>
    </template>
    <template v-slot:[`item.activo`]="{ item }">
      <v-chip small :color="getColor(item.activo)" dark>
        {{ item.activo == '1' ? 'Activo' : 'Inactivo' }}
      </v-chip>
    </template>
    <template v-slot:item.acciones="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small class="mr-2" v-bind="attrs" v-on="on" @click="editarItem(item)" color="warning">mdi-pencil
          </v-icon>
        </template>
        <span>Editar</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small v-bind="attrs" v-on="on" @click="cambiarEstadoItem(item)"
            :color="item.activo === true ? 'error' : 'success'">mdi-toggle-switch-off</v-icon>
        </template>
        <span>{{ item.activo === true ? 'Inactivar' : 'Activar' }}</span>
      </v-tooltip>
    </template>
    <template v-slot:no-data>
      <p>Sin data que mostrar</p>
    </template>
  </v-data-table>
</template>

<script>
  import FormTipoPrestador from "~/components/contrato/tipoPrestador/FormTipoPrestadorComponent.vue"
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    components: {
      FormTipoPrestador
    },
    name: "ListarTipoPreastadorComponent",

    data() {
      return {
        editando: false,
        tipo_prestador_id: null,
        headers: [{
            text: '#',
            value: 'id'
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Estado',
            value: 'activo'
          },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
            align: 'center'
          }
        ],
        tipo_prestadores: [],
        buscar: null,
        loading: false,
        dialogs: {
          form: false
        }
      }
    },

    mounted() {
      this.getTipoPrestadores()
    },

    methods: {

      async getTipoPrestadores() {
        try {
          this.loading = true
          const {
            data
          } = await this.$axios.get('/tipo-prestador')
          this.tipo_prestadores = data
          this.loading = false
        } catch (error) {
          this.loading = false
          this.$toast.error('Error al cargar los datos');
        }
      },

      async cambiarEstadoItem(item) {
        try {
          if (!confirm('¿ Desea cambiar el estado de este tipo de prestador ?')) return false;
          await this.$axios.put('/tipo-prestador/cambiar-estado/' + item.id)
          this.$toast.success('El tipo de prestador cambió de estado correctamente');
          this.getTipoPrestadores()
        } catch (error) {
          this.$toast.error('Error al cambiar el estado');
        }
      },

      getColor(activo) {
        if (activo == 1) return 'success'
        else return 'error'
      },

      editarItem(item) {
        this.editando = true
        this.tipo_prestador_id = item.id
        this.dialogs.form = true
      }

    },

  }

</script>
