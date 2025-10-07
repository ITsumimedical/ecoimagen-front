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
        <v-autocomplete :items="cups" return-object item-text="nombre" label="Buscar CUP" :loading="loading"
          :search-input.sync="nombre" chips small-chips multiple solo v-model="selectedCups" dense
          no-data-text="Debe introducir 4 dígitos para buscar" />
      </v-col>
      <v-col md="2" sm="12" cols="6">
        <v-btn color="info" dense dark @click="confirmAgregarCup">Agregar</v-btn>
      </v-col>
    </v-row>
    <v-data-table dense :headers="headers" :items="cupsPorPaquete" class="elevation-1 text-center" :loading="loading"
      no-data-text="Sin datos para mostrar" hide-default-footer disable-pagination loading-text="Cargando...">
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
            <v-icon color="error" small v-bind="attrs" v-on="on" @click="confirmEliminarCup(item.id)">
              mdi-delete
            </v-icon>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-row justify="center">
      <v-col md="2" sm="12" cols="6">
        <v-pagination class="my-4" :total-visible="9" @input="listarCupsPaquetes" :length="totalPages"
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
      cups: [],
      cupsPorPaquete: [],
      loading: false,
      preload: false,
      nombre: '',
      selectedCups: [],
      headers: [
        { text: 'Codigo', value: 'codigo', align: 'center' },
        { text: 'Nombre', value: 'nombre', align: 'center' },
        { text: 'Genero', value: 'genero', align: 'center' },
        { text: 'Edad inicial', value: 'edad_inicial', align: 'center' },
        { text: 'Edad final', value: 'edad_final', align: 'center' },
        { text: 'Archivo', value: 'archivo', align: 'center' },
        { text: 'Quirurgico', value: 'quirurgico', align: 'center' },
        { text: 'Diagnóstico requerido', value: 'diagnostico_requerido', align: 'center' },
        { text: 'Requiere auditoria', value: 'requiere_auditoria', align: 'center' },
        { text: 'Periodicidad', value: 'periodicidad', align: 'center' },
        { text: 'Ambito', value: 'ambito.nombre', align: 'center' },
        { text: 'Estado', value: 'activo', align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
      ],
      cupIdToDelete: null,
      currentPage: 1,
      totalPages: 0,
    }
  },
  watch: {
    nombre: function (newVal) {
      if (newVal && newVal.length === 4) {
        this.listarCups();
      }
    },
    paquete_servicio_id: function (newVal) {
      if (newVal) {
        this.listarCupsPaquetes();
        this.selectedCups = [];
      }

    },

    isOpen: function (newVal) {
      if (!newVal) {
        this.selectedCups = [];
      }
    },
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.listarCupsPaquetes();
      }
    }
  },
  methods: {
    listarCups() {
      this.loading = true;
      this.$axios.get('/cup/BuscarCup/' + this.nombre).then(res => {
        this.cups = res.data.original;
      }).catch(error => {
        this.$toast.error('Ocurrió un error al buscar los CUP, por favor recargue la página.');
      }).finally(() => {
        this.loading = false;
      });
    },

    confirmAgregarCup() {
      if (this.selectedCups.length === 0) {
        this.$toast.error('Debe seleccionar al menos un CUP');
        return;
      }

      this.$swal({
        title: "Confirmar Agregar",
        text: "¿Está seguro de que desea agregar los CUP seleccionados?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.agregarCup();
        }
      });
    },

    agregarCup() {
      const existeCup = this.selectedCups.some(cup =>
        this.cupsPorPaquete.find(item => item.codigo === cup.codigo)
      );

      if (existeCup) {
        this.$toast.error('El CUP ya existe en este paquete');
        this.selectedCups = [];
        return;
      }

      this.preload = true;
      this.$axios.post('/paquete-servicio/agregarCup/' + this.paquete_servicio_id, this.selectedCups).then(() => {
        this.listarCupsPaquetes();
        this.$toast.success('CUPs agregados correctamente');
      }).catch(() => {
        this.$toast.error('Error al agregar CUP, por favor intente de nuevo.');
      }).finally(() => {
        this.preload = false;
        this.selectedCups = [];
      });
    },

    listarCupsPaquetes() {
      this.loading = true;
      this.$axios.get(`/paquete-servicio/listarCupsPorPaquete/${this.paquete_servicio_id}?page=${this.currentPage}`).then(res => {
        const response = res.data;
        this.cupsPorPaquete = response.data;
        this.totalPages = response.last_page;
        this.currentPage = response.current_page; 
      }).catch(error => {
        this.$toast.error('Ocurrió un error al cargar los CUPs de este paquete, por favor recargue la página.');
      }).finally(() => {
        this.loading = false;
      });
    },


    confirmEliminarCup(cup_id) {
      this.cupIdToDelete = cup_id;
      this.$swal({
        title: "Confirmar Eliminar",
        text: "¿Está seguro de que desea eliminar este CUP?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.eliminarCup();
        }
      });
    },

    eliminarCup() {
      this.preload = true;

      this.$axios.delete('/paquete-servicio/eliminarCupPaquete', {
        data: {
          cup_id: this.cupIdToDelete,
          paquete_id: this.paquete_servicio_id
        }
      })
        .then(() => {
          this.listarCupsPaquetes();
          this.$toast.success('Se elimino correctamente el CUP de este paquete.');
        })
        .catch(error => {
          this.$toast.error('Error al eliminar CUP de este paquete.');
        }).finally(() => {
          this.preload = false;
          this.cupIdToDelete = null;
        });
    }
  },
  mounted() {
    this.listarCupsPaquetes();
  }
}
</script>
