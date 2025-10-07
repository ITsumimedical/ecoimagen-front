<template>
  <v-data-table :headers="headers" :items="contratos" :loading="loading" :disabled="loading" hide-default-footer dense>

    <template v-slot:top>
      <v-alert text dense border="left" type="info" icon="mdi-file-document-outline">
        <strong>Contratos</strong>
      </v-alert>

      <!-- formulario para editar -->
      <v-dialog v-model="dialogs.form" width="800">
        <FormContratoComponent :editando="editando" :contrato_id="contrato_id" class="pt-5"
          @cerrar="dialogs.form = false" />
      </v-dialog>

      <!-- Crear tarifas -->
      <v-dialog v-model="dialogs.tarifa" width="500">
        <FormTarifasComponent :prestador_id="prestador_id" :contrato_id="contrato_id"
          @cerrar="dialogs.tarifa = false" />
      </v-dialog>

    </template>

    <template v-slot:[`item.PGP`]="{ item }">
      <v-chip small dark :color="item.PGP ? 'success' : 'error'">
        {{ item.PGP ? "Sí" : "No" }}
      </v-chip>
    </template>

    <!-- Slot para mostrar un mensaje cuando no hay datos -->
    <template v-slot:no-data>
      <v-alert type="warning">
        El prestador no contiene contratos.
      </v-alert>
    </template>

    <template v-slot:[`item.capitado`]="{ item }">
      <v-chip small dark :color="item.capitado ? 'success' : 'error'">
        {{ item.capitado ? "Sí" : "No" }}
      </v-chip>
    </template>

    <template v-slot:[`item.fecha_inicio`]="{ item }">
      {{ $moment(item.fecha_inicio).format('DD/MM/YYYY') }}
    </template>

    <template v-slot:[`item.fecha_termina`]="{ item }">
      {{ $moment(item.fecha_termina).format('DD/MM/YYYY') }}
    </template>

    <template v-slot:[`item.evento`]="{ item }">
      <v-chip small dark :color="item.evento ? 'success' : 'error'">
        {{ item.evento ? "Sí" : "No" }}
      </v-chip>
    </template>

    <template v-slot:[`item.activo`]="{ item }">
      <v-chip small dark :color="item.activo ? 'success' : 'error'">
        {{ item.activo ? "Activo" : "Inactivo" }}
      </v-chip>
    </template>

    <template v-slot:[`item.actions`]="{ item }">

      <v-tooltip top v-if="$can('contrato.actualizar')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="warning" v-bind="attrs" v-on="on" @click="editar(item)">
            mdi-pencil
          </v-icon>
        </template>
        <span>Editar</span>
      </v-tooltip>

      <v-tooltip top v-if="$can('contratos.eliminar')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-if="item.activo" color="error" v-bind="attrs" v-on="on" @click="eliminarTarifa(item)">
            mdi-delete-forever
          </v-icon>
        </template>
        <span>Eliminar Contrato</span>
      </v-tooltip>

      <v-tooltip top v-if="$can('cups.guardar')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-if="item.activo" color="primary" v-bind="attrs" v-on="on" @click="crearTarifa(item)">
            mdi-clipboard-text
          </v-icon>
        </template>
        <span>Crear tarifa</span>
      </v-tooltip>

      <v-tooltip top v-if="$can('cups.guardar')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-if="item.activo" v-bind="attrs" v-on="on" @click="verTarifa(item)">
            mdi-eye
          </v-icon>
        </template>
        <span>Ver tarifas</span>
      </v-tooltip>

    </template>
  </v-data-table>

</template>
<script>
  import FormContratoComponent from '@/components/contrato/contratos/FormContratoComponent.vue';
  import FormTarifasComponent from '@/components/contrato/tarifas/FormTarifasComponent.vue';
  import { mapActions } from "vuex";

  export default {

    name: "ListarContratosPorPrestador",
    components: {
      FormContratoComponent,
      FormTarifasComponent
    },

    props: ['prestador_id'],

    data() {
      return {
        loading: false,
        editando: false,
        contratos: [],
        contrato_id: null, // este es el contrato que se va a editar y/o el que se va a enviar a los componentes
        dialogs: {
          form: false,
          tarifa: false
        },
        headers: [
          { text: '# Contrato', value: 'id' },
          {
            text: 'Ambito',
            value: 'ambito.nombre'
          },
          {
            text: 'Entidad',
            value: 'entidad.nombre'
          },
          {
            text: 'Fecha inicio',
            value: 'fecha_inicio'
          },
          {
            text: 'Fecha termina',
            value: 'fecha_termina'
          },
          {
            text: 'PGP',
            value: 'PGP'
          },
          {
            text: 'Capitado',
            value: 'capitado'
          },
          {
            text: 'Evento',
            value: 'evento'
          },
          {
            text: 'Estado',
            value: 'activo'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false,
            align: 'center'
          },
        ]
      }
    },

    watch: {
      prestador_id() {
        this.getContratos();
      },

      'dialogs.form'(value) {
        if (!value) {
          this.editando = false;
          this.contrato_id = null;
        }
      },

      'dialogs.tarifa'(value) {
        if (!value) {
          this.contrato_id = null;
        }
      }
    },

    methods: {

      ...mapActions('app', ['setPreload']),

      async getContratos() {
        try {
          this.loading = true
          const {
            data
          } = await this.$axios.get(`/contrato/listar-por-prestador/${this.prestador_id}`);
          this.contratos = data
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      },

      editar(item) {
        console.log('entro');
        this.contrato_id = item.id
        this.editando = true
        this.dialogs.form = true
      },

      crearTarifa(item) {
        this.contrato_id = item.id
        this.dialogs.tarifa = true
      },

      verTarifa(item) {
        this.$emit('input', item.id)
        this.$emit('tarifas', item.id)

      },

      eliminarTarifa(item){
        const msg = "Esta seguro de desea eliminar el contrato con codigo: " + item.id;
      this.$swal({
        title: msg,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }).then(async resultado => {
        if (resultado.value) {
          this.setPreload(true);
          await this.$axios.post('/contrato/eliminar/' + item.id).then(
            res => {
              this.$swal({
                title: "¡Contrato eliminado con exito!",
                timer: 2000,
                type: "success",
              });
              this.getContratos();
            }).catch(error => {
              this.$toast.error(error.response.data.mensaje)
            }).finally(()=>{
              this.setPreload(false);
            })
        }
      });
      }

    }

  }

</script>
