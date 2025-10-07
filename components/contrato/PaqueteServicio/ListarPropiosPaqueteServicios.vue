<template>
  <div>
    <div class="text-center">
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Tranquilo procesamos tu solicitud !
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <v-row justify="center">
      <v-col md="8" sm="12" cols="6">
        <v-autocomplete :items="codigosPropios" return-object item-text="nombre" label="Buscar Código Propio"
          :loading="loading" :search-input.sync="nombre" chips small-chips multiple solo dense
          v-model="selectedCodigosPropios" no-data-text="Debe introducir 4 dígitos para buscar"></v-autocomplete>
      </v-col>
      <v-col md="2" sm="12" cols="6">
        <v-btn color="info" dense dark @click="confirmarAgregarCodigosPropios">Agregar</v-btn>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="codigosPropiosPorPaquete" class="elevation-1 text-center" dense
      no-data-text="Sin datos para mostrar" hide-default-footer disable-pagination :loading="loading"
      loading-text="Cargando...">

      <template v-slot:[`item.quirurgico`]="{ item }">
        <v-chip dark :color="item.quirurgico ? 'success' : 'error'">
          {{ item.quirurgico ? "Si" : "No" }}</v-chip>
      </template>
      <template v-slot:[`item.diagnostico_requerido`]="{ item }">
        <v-chip dark :color="item.diagnostico_requerido ? 'success' : 'error'">
          {{ item.diagnostico_requerido ? "Si" : "No" }}</v-chip>
      </template>
      <template v-slot:[`item.requiere_auditoria`]="{ item }">
        <v-chip dark :color="item.requiere_auditoria ? 'success' : 'error'">
          {{ item.requiere_auditoria ? "Si" : "No" }}</v-chip>
      </template>
      <template v-slot:[`item.activo`]="{ item }">
        <v-chip small :color="item.activo == true ? 'success' : 'error'" dark>
          {{ item.activo == true ? 'Activo' : 'Inactivo' }}</v-chip>
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" small v-bind="attrs" v-on="on" @click="confirmEliminarCodigoPropio(item.id)">
              mdi-delete
            </v-icon>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-row justify="center">
      <v-col md="2" sm="12" cols="6">
        <v-pagination class="my-4" :total-visible="9" @input="listarCodigosPropiosPaquetes" :length="totalPages"
          v-model="currentPage"></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    paquete_servicio_id: {
      type: Number,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      codigosPropios: [],
      codigosPropiosPorPaquete: [],
      loading: false,
      preload: false,
      nombre: '',
      selectedCodigosPropios: [],
      headers: [
        { text: 'Codigo', value: 'codigo', align: 'center' },
        { text: 'Nombre', value: 'nombre', align: 'center' },
        { text: 'Genero', value: 'genero', align: 'center' },
        { text: 'Edad inicial', value: 'edad_inicial', align: 'center' },
        { text: 'Edad final', value: 'edad_final', align: 'center' },
        // { text: 'Archivo', value: 'archivo', align: 'center' },
        { text: 'Quirurgico', value: 'quirurgico', align: 'center' },
        { text: 'Diagnóstico requerido', value: 'diagnostico_requerido', align: 'center' },
        { text: 'Requiere auditoria', value: 'requiere_auditoria', align: 'center' },
        { text: 'Periodicidad', value: 'periodicidad', align: 'center' },
        { text: 'Ambito', value: 'ambito.nombre', align: 'center' },
        { text: 'Estado', value: 'activo', align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
      ],
      codigoPropioIdToDelete: null,
      currentPage: 1,
      totalPages: 0,
    }
  },
  watch: {
    nombre: function (newVal) {
      if (newVal && newVal.length === 4) {
        this.listarCodigosPropios()
      }
    },
    paquete_servicio_id: function (newVal) {
      if (newVal) {
        this.listarCodigosPropiosPaquetes()
      }
    },
    isOpen: function (newVal) {
      if (newVal) {
        this.selectedCodigosPropios = [];
      }
    },
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.listarCodigosPropiosPaquetes()
      }
    }
  },
  methods: {
    listarCodigosPropios() {
      this.loading = true;
      this.$axios.get('/codigo-propio/BuscarCodigoPropio/' + this.nombre).then(res => {
        this.codigosPropios = res.data.original;
      }).catch(error => {
        this.$toast.error('Ocurrio un error al buscar los Códigos Propios, por favor recargue la página.');
      }).finally(() => {
        this.loading = false;
      })
    },
    confirmarAgregarCodigosPropios() {
      if (this.selectedCodigosPropios.length === 0) {
        this.$toast.error('Debe seleccionar al menos un Código Propio');
        return;
      }

      this.$swal({
        title: "Confirmar Agregar",
        text: "¿Está seguro de que desea agregar los Codigos Propios seleccionados?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.agregarCodigoPropio();
        }
      })
    },

    agregarCodigoPropio() {
      const existeCodigoPropio = this.selectedCodigosPropios.some(codPropio => this.codigosPropiosPorPaquete.find(item => item.codigo === codPropio.codigo));

      if (existeCodigoPropio) {
        this.$toast.error('El Código Propio ya existe en este paquete');
        this.selectedCodigosPropios = [];
        return;
      }

      this.preload = true;
      this.$axios.post('/paquete-servicio/agregarCodigoPropio/' + this.paquete_servicio_id, this.selectedCodigosPropios).then(() => {
        this.listarCodigosPropiosPaquetes();
        this.$toast.success('Códigos Propios agregados correctamente');
      }).catch(() => {
        this.$toast.error('Error al agregar Códigos Propios, por favor intente de nuevo.');
      }).finally(() => {
        this.preload = false;
        this.selectedCodigosPropios = [];
      })
    },

    listarCodigosPropiosPaquetes() {
      this.loading = true;
      this.$axios.get(`/paquete-servicio/listarCodigosPropiosPorPaquete/${this.paquete_servicio_id}?page=${this.currentPage}`).then(res => {
        const response = res.data;
        this.codigosPropiosPorPaquete = response.data;
        this.totalPages = response.last_page;
        this.currentPage = response.current_page;
      }).catch(error => {
        this.$toast.error('Ocurrio un error al buscar los Códigos Propios, por favor recargue la página.');
      }).finally(() => {
        this.loading = false;
      })

    },

    confirmEliminarCodigoPropio(codigo_propio_id) {
      this.codigoPropioIdToDelete = codigo_propio_id;
      this.$swal({
        title: "Confirmar Eliminar",
        text: "¿Está seguro de que desea eliminar este Código Propio?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.eliminarCodigoPropio();
        }
      })
    },

    eliminarCodigoPropio() {
      this.dialogEliminar = false;
      this.preload = true;

      this.$axios.delete('/paquete-servicio/eliminarCodigoPropioPaquete', {
        data: {
          codigo_propio_id: this.codigoPropioIdToDelete,
          paquete_id: this.paquete_servicio_id
        }
      }).then(() => {
        this.listarCodigosPropiosPaquetes();
        this.$toast.success('Se elimino correctamente el Código Propio de este paquete.');
      }).catch(error => {
        this.$toast.error('Error al eliminar Código Propio de este paquete.');
      }).finally(() => {
        this.preload = false;
        this.codigoPropioIdToDelete = null;
      })
    }
  },

  mounted() {
    this.listarCodigosPropiosPaquetes();
  }
}
</script>