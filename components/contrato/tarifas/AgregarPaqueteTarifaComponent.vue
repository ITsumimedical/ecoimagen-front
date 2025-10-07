<template>
  <v-card>
    <!-- Preload -->
    <template>
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
    </template>

    <v-alert dense text border="left" icon="mdi-package" type="info" color="info">
      <div class="d-flex justify-space-between">
        <b>Agregar Paquetes</b>
        <v-btn color="error" @click="$emit('cerrar')" small>cerrar</v-btn>
      </div>
    </v-alert>
    <v-row>
      <v-col col="12" sm="6" md="10">
        <v-autocomplete v-model="selectedPaquete" outlined label="Buscar código propio" :items="paquetes"
          item-text="CodigoNombre" :loading="loading" :search-input.sync="campoBusqueda" dense return-object
          no-data-text="Debe introducir 4 dígitos para buscar"></v-autocomplete>
      </v-col>
      <v-col col="12" sm="6" md="2">
        <v-btn color="primary" dark @click="agregar()" small>Agregar paquete</v-btn>
      </v-col>
    </v-row>
    <v-data-table dense :headers="headers" :items="paqueteTarifas" item-key="id" class="elevation-0" :loading="preload">

      <template v-slot:[`item.tarifa[0].pivot.valor`]="{ item }">
        <v-edit-dialog :return-value.sync="item.tarifa[0].pivot.valor" @save="save(item)" @open="open" @close="close">
          {{ item.tarifa[0].pivot.valor }}
          <template v-slot:input>
            <v-text-field v-model="item.tarifa[0].pivot.valor" label="Editar precio" single-line></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:[`item.acciones`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small @click="eliminar(item)" color="error" v-bind="attrs" v-on="on">mdi-delete</v-icon>
          </template>
          <span>Eliminar Paquete de Servicios</span>
        </v-tooltip>
      </template>
    </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  middleware({ $can, redirect }) {
    if (!$can('blog.vista')) {
      return redirect('/');
    }
  },

  name: 'AgregarCupsContrato',

  props: {
    tarifa_id: Number,
    editando: Boolean,
  },

  watch: {
    tarifa_id() {
      if (this.editando) {
        this.getPaqueteTarifa();
      }
    },

    campoBusqueda: function (newVal) {
      if (newVal && newVal.length === 4) {
        this.listarPaquetes();
      }
    },
  },

  data() {
    return {
      selectedPaquete: null,
      campoBusqueda: '',
      headers: [
        { text: "ID", value: "id" },
        { text: "Codigo", value: "codigo" },
        { text: "Cups", value: "cups.codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Precio", value: "tarifa[0].pivot.valor" },
        { text: "Acciones", value: "acciones", sortable: false, align: "center" },
      ],
      paquetes: [],
      paqueteTarifas: [],
      paquete: null,
      form: {
        paquete_id: null,
        tarifa_id: null,
        precio: null,
      },
      preload: false,
      loading: false,
    };
  },

  mounted() {
    if (this.editando) {
      this.getPaqueteTarifa();
    }
  },

  methods: {
    listarPaquetes() {
      this.preload = true;
      this.$axios.get(`/paquete-servicio/buscarPaqueteServicio/${this.campoBusqueda}`).then(res => {
        console.log('selected paquetes', res.data.original);
        this.paquetes = res.data.original;
      }).catch(error => {
        this.$toast.error('Ocurrió un error al buscar los Paquetes de Servicios, por favor recargue la página');
        console.log(error);
      }).finally(() => {
        this.preload = false;
      });
    },

    getPaqueteTarifa() {
      this.preload = true;
      this.$axios.get(`/tarifa/listarPaqueteTarifa/${this.tarifa_id}`).then(res => {
        this.paqueteTarifas = res.data;
        console.log(res.data);
      }).catch(error => {
        this.$toast.error('Error al cargar los paquetes de servicios');
        console.log(error);
      }).finally(() => {
        this.preload = false;
      });
    },

    agregar() {
      // Verificar que se haya seleccionado al menos un paquete
      if (!this.selectedPaquete) {
        return this.$toast.error("Debe seleccionar al menos una paquete");
      }

      // Verificar si el paquete ya existe 
      const existePaquete = this.paqueteTarifas.some(paquete => paquete.id === this.selectedPaquete.id);
      if (existePaquete) {
        return this.$toast.error("Este paquete ya existe");
      }

      this.preload = true;
      this.form.tarifa_id = this.tarifa_id;
      this.form.paquete_id = this.selectedPaquete.id;
      this.form.precio = this.selectedPaquete.precio;

      this.$axios.post("/tarifa/tarifa-paquete", this.form).then(res => {
        this.getPaqueteTarifa();
        this.$toast.success("El código se agregó correctamente");
        this.paquete = null;
      }).catch(error => {
        this.$toast.error('Error al agregar el paquete');
        console.log(error);
      }).finally(() => {
        this.preload = false;
        this.selectedPaquete = null;
      });
    },

    eliminar(item) {
      const tarifa_id = this.tarifa_id;
      const paquete_id = item.id;
      this.$swal({
        title: "Desea eliminar este Paquete de Servicios?",
        text: "Al aceptar este mensaje, se eliminará el Paquete de Servicios",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then(res => {
        if (res.value) {
          this.preload = true;
          this.$axios.delete(`/tarifa/eliminarPaqueteTarifa/${tarifa_id}/${paquete_id}`).then(res => {
            this.getPaqueteTarifa();
            this.$toast.success("Se eliminó correctamente el Paquete de Servicios");
          }).catch(error => {
            this.$toast.error("No se ha podido eliminar el Paquete de Servicios");
            console.log(error);
          }).finally(() => {
            this.preload = false;
          });
        }
      });
    },

    save(item) {

      this.preload = true;
      this.$axios.put('/tarifa/actualizarPrecioPaquete', {
        tarifa_id: this.tarifa_id,
        paquete_id: item.id,
        precio: item.tarifa[0].pivot.valor
      }).then(res => {
        this.$toast.success('Se actualizo correctamente el precio del Paquete de Servicios');
      }).catch(error => {
        this.$toast.error('Error al actualizar el precio del Paquete de Servicios');
        console.log(error);
      }).finally(() => {
        this.preload = false;
        this.getPaqueteTarifa();
      })

    },

    open() {
      this.$toast.info('Edición de abierta');
    },
    close() {
      this.$toast.info('Edición de cerrada');
    }
  },
};
</script>
