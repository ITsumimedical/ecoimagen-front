<template>
  <!-- Tabla de datos que muestra los cups asociados a una tarifa -->
  <v-data-table :headers="headers" :items="cupsTarifa" :search="search" :loading="loading" dense>

    <!-- Slot personalizado para el campo "Valor" -->
    <template v-slot:[`item.valor`]="{ item }">
      <v-edit-dialog :return-value.sync="item.tarifa[0].pivot.valor" @save="actualizarValorCupTarifa(item)" @open="open" @close="close">
        {{ formatCurrency(item.tarifa[0].pivot.valor) }}
        <template v-slot:input>
          <v-text-field v-model="item.tarifa[0].pivot.valor" label="Editar Valor" single-line></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on" @click="eliminarCupTarifaIndividual(item)">
            mdi-delete</v-icon>
        </template>
        <span>Quitar Cup</span>
      </v-tooltip>
    </template>

    <template v-slot:top>
      <!-- Alerta informativa en la parte superior -->
      <v-alert text dense border="left" type="info" icon="mdi-file-document-outline">
        <div class="d-flex justify-space-between">
          <!-- Título y componente para carga masiva -->
          <strong>Agregar Paquete a {{ manual }} - código: {{ tarifa_id }}</strong>
          <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-if="reload = true" color="error" v-bind="attrs" v-on="on" @click="getCupsPaquetes()">
            mdi-reload
          </v-icon>
        </template>
        <span>Recargar Tarifas</span>
      </v-tooltip>
        </div>
      </v-alert>

      <!-- Formulario para agregar un nuevo cup -->
      <v-row>

        <v-col cols="12" md="10">
          <!-- Autocompletado para seleccionar un paquete -->
          <v-autocomplete v-model="selectedPaquete" outlined label="Buscar paquete" :items="paquetes"
          item-text="nombre" :loading="loading" :search-input.sync="campoBusqueda" dense return-object
          no-data-text="Debe introducir 6 dígitos para buscar"></v-autocomplete>
        </v-col>

        <v-col cols="12" md="2">
          <!-- Botón para agregar el cup seleccionado -->
          <v-btn block color="primary" @click="agregar()">Agregar</v-btn>
        </v-col>

      </v-row>

      <!-- Campo de búsqueda en la tabla -->
      <v-text-field v-model="search" label="Buscar en tabla..." outlined dense></v-text-field>
    </template>

  </v-data-table>
</template>

<script>
  import {
    mapActions
  } from 'vuex';
  import CargaMasivaTarifasComponent from './CargaMasivaTarifasComponent.vue';

  export default {

    components: {
      CargaMasivaTarifasComponent
    },

    props: {
      tarifa_id: {
        type: Number,
        default: null,
      },
      manual: {
        type: String,
        default: null,
      }
    },

    data() {
      return {
        loading: false, // Estado de carga para mostrar spinners
        search: '', // Texto de búsqueda en la tabla
        selectedPaquete: null, // ID del cup seleccionado para agregar
        headers: [{
            text: 'Id',
            value: 'id'
          },
          {
            text: 'Código Cups',
            value: 'cups.codigo'
          },
          {
            text: 'Código',
            value: 'codigo'
          },
          {
            text: 'Descripcion',
            value: 'nombre'
          },
          {
            text: 'Valor',
            value: 'valor'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false,
            align: 'center'
          },
        ],
        paquetes: [], // Lista de cups disponibles para seleccionar
        cupsTarifa: [], // Lista de cups ya asociados a la tarifa
        campoBusqueda:''
      }
    },

    watch: {
      // Observa cambios en tarifa_id para actualizar cupsTarifa
      tarifa_id: {
        handler(value, oldValue) {
          if (value) {
            this.getCupsPaquetes();
          }
        },
        immediate: true,
      },

    campoBusqueda: function (newVal) {
    if (newVal && newVal.length === 6) {
      this.getPaquetes()
    }
  },
    },

    created() {
      // Al crear el componente, obtiene los cups y cupsTarifa
      this.getPaquetes();
      this.getCupsPaquetes();
    },

    methods: {
      // Mapea la acción setPreload del módulo 'app' en Vuex
      ...mapActions('app', ['setPreload']),

      // Obtiene la lista de cups disponibles
      async getPaquetes() {
        try {
          this.loading=true;
          const {
            data
          } = await this.$axios.post('/paquete-servicio/listar', {
            paquete: this.campoBusqueda
          });
          this.loading=false;
          this.paquetes = data.map((paquete) => {
            return {
              paquete_id: paquete.id,
              nombre: `${paquete.codigo} - ${paquete.nombre}`,
              precio: `${paquete.precio}`,
            };
          });
        } catch (error) {
          this.$toast.error('Error al consultar los paquetes');
          this.loading=false;
        }
      },

      // Obtiene los cups asociados a la tarifa actual
      async getCupsPaquetes() {
        try {
          this.loading = true; // Muestra el spinner
          const {
            data
          } = await this.$axios.get('/tarifa/listarPaqueteTarifa/' + this.tarifa_id);
          this.cupsTarifa = data;
        } catch (error) {
          this.$toast.error('Error al consultar los paquetes parametrizados');
        } finally {
          this.loading = false; // Oculta el spinner
        }
      },

      // Agrega un cup a la tarifa
      async agregar() {
        if (!this.selectedPaquete) {
          return;
        }
        try {
          this.setPreload(true);
          await this.$axios.post('/tarifa/tarifa-paquete/' + this.tarifa_id, this.selectedPaquete); // Envía un array c
          this.$toast.success('El paquete se agregó correctamente.');
          this.getCupsPaquetes(); // Actualiza la lista de cupsTarifa
          this.limpiar(); // Limpia el campo cup_id
        } catch (error) {
          console.log(error);
        } finally {
          this.setPreload(false);
        }
      },

      // Limpia el campo de selección de cup
      limpiar() {
        this.cup_id = null;
      },

      // Formatea un valor numérico como moneda en pesos colombianos
      formatCurrency(value) {
        if (value !== null && value !== undefined) {
          // Utiliza Intl.NumberFormat para formatear el número
          return '$' + new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0
          }).format(value);
        } else {
          return '';
        }
      },

      //Actualiza el valor de la tarifa
      actualizarValorCupTarifa(item) {
        this.preload = true;
        this.$axios.put('/tarifa/actualizarPrecioPaquete', {
          tarifa_id: this.tarifa_id,
          paquete_id:item.id,
          precio: item.tarifa[0].pivot.valor
        }).then(res => {
          this.$toast.success('Se actualizó correctamente el valor');
          this.getCupsPaquetes();
        }).catch(error => {
          this.$toast.error('No se ha podido actualizar el valor');
          console.log(error);
        }).finally(() => {
          this.preload = false;
        });
      },

      open() {
        this.$toast.info('Edición abierta');
      },
      close() {
        this.$toast.info('Edición cerrada');
      },

      //Elimina el cups parametrizado en la tarifa
      eliminarCupTarifaIndividual(item) {
        this.$swal({
          title: "¿Está seguro?",
          text: `Se quitará el paquete "${item.codigo} - ${item.nombre}"`,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
        }).then(res => {
          if (res.value) {
            this.preload = true;
            this.$axios.delete('/tarifa/eliminarPaqueteTarifa/'+ this.tarifa_id + '/'+ item.id).then(() => {
              this.getCupsPaquetes();
              this.$toast.success('Se quitó el CUP correctamente');
            }).catch(error => {
              this.$toast.error('No se ha podido quitar el CUP');
              console.log(error);
            }).finally(() => {
              this.preload = false;
            });
          }
        });
      },
    }
  }

</script>
