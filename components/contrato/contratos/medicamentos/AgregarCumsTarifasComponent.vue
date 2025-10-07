<template>
    <!-- Tabla de datos que muestra los cups asociados a una tarifa -->
    <v-data-table :headers="headers" :items="municipioTarifa" :search="search" :loading="loading" dense>
    
        <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on"
                        @click="eliminarCumTarifaIndividual(item)">
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
                    <strong>Agregar Cums a {{ manual }} - código de tarifa: {{ tarifa_id }}</strong>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-if="reload = true" color="error" v-bind="attrs" v-on="on"
                                @click="getCumTarifas()">
                                mdi-reload
                            </v-icon>
                        </template>
                        <span>Recargar Cums</span>
                    </v-tooltip>
                </div>
            </v-alert>
    
            <!-- Formulario para agregar un nuevo cup -->
            <v-row>
                <v-col cols="12" md="10">
                    <!-- Autocompletado para seleccionar un cup -->
                    <v-autocomplete outlined :loading="loading" item-text="fullname" :items="cums"
                        :search-input.sync="campoBusquedaCum" item-value="cum_validacion"
                        no-data-text="Debe introducir 4 caracteres para buscar" v-model="cum" label="Buscar Cum"
                        dense></v-autocomplete>
                </v-col>
    
                <v-col cols="12" md="2">
                    <!-- Botón para agregar el cup seleccionado -->
                    <v-btn dark color="primary" @click="agregar()">Agregar</v-btn>
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

export default {

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
      cum: null, // ID del cup seleccionado para agregar
      headers: [{
        text: 'Id',
        value: 'id'
      },
      {
        text: 'Codigo Agrupador',
        value: 'codigo'
      },
      {
        text: 'Cum-Validacion',
        value: 'cum_validacion'
      },
      {
        text: 'Producto',
        value: 'producto'
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
      campoBusquedaCum: '', // Campo de búsqueda para filtrar cups
      cums: [], // Lista de cums disponibles para seleccionar
    }
  },

  watch: {
    // Observa cambios en tarifa_id para actualizar cupsTarifa
    tarifa_id: {
      handler(value, oldValue) {
        if (value) {
          this.getCumTarifas();
        }
      },
      immediate: true,
    },

    campoBusquedaCum() {
      if (this.campoBusquedaCum && this.campoBusquedaCum.length >= 4) {
        this.listarCums();
      }
    }
  },

  created() {
    this.getCumTarifas();
  },

  methods: {
    ...mapActions('app', ['setPreload']),

    async listarCums() {
      this.loading = true;
      await this.$axios.get(`/cum/BuscarMedicamento/${this.campoBusquedaCum}`).then((res) => {
        this.cums = res.data.original.map((cum) => ({
          cum_validacion: cum.cum_validacion,
          fullname: `${cum.cum_validacion} ${cum.producto} (${cum.titular})`,
        }));
      }).catch((error) => {
        this.$toast.error('Error al buscar Expediente');
      }).finally(() => {
        this.loading = false;
      });
    },

    // Obtiene los cum asociados a la tarifa actual
    async getCumTarifas() {
      try {
        this.loading = true; // Muestra el spinner
        const {
          data
        } = await this.$axios.get('/tarifa/cum-tarifa/' + this.tarifa_id);
        this.municipioTarifa = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false; // Oculta el spinner
      }
    },

    // Agrega un cum a la tarifa
    async agregar() {
      if (!this.cum) {
        return this.$toast.error('Debe escoger un Cum.');
      }
      try {
        this.setPreload(true);
        await this.$axios.post('/tarifa/tarifa-cums/' + this.tarifa_id, {
          cum_id: this.cum
        }); // Envía un array con el cum_id
        this.$toast.success('El Cum se agregó correctamente.');
        this.getCumTarifas(); // Actualiza la lista de cupsTarifa
        this.limpiar(); // Limpia el campo cum_id
      } catch (error) {
        this.$toast.error('El municipio no se agregó correctamente.');
      } finally {
        this.setPreload(false);
      }
    },

    // Limpia el campo de selección de cum
    limpiar() {
      this.cum = null;
    },

    open() {
      this.$toast.info('Edición abierta');
    },
    close() {
      this.$toast.info('Edición cerrada');
    },

    //Elimina el cum parametrizado en la tarifa
    eliminarCumTarifaIndividual(item) {
      this.$swal({
        title: "¿Está seguro?",
        text: `Se quitará el Cum "${item.cum_validacion}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then(res => {
        if (res.value) {
          this.setPreload(true);
          this.$axios.post('/tarifa/eliminar-cum-tarifa', {
            cum_tarifas_id: item.id
          }).then(() => {
            this.getCumTarifas();
            this.$toast.success('Se elimino correctamente');
          }).catch(error => {
            this.$toast.error('No se ha podido eliminar el cum');
            console.log(error);
          }).finally(() => {
            this.setPreload(false);
          });
        }
      });
    },
  }
}

</script>
