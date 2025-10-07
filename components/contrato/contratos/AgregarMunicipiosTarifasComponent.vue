<template>
  <!-- Tabla de datos que muestra los cups asociados a una tarifa -->
  <v-data-table :headers="headers" :items="municipioTarifa" :search="search" :loading="loading" dense>

    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on" @click="eliminarMunicipioTarifaIndividual(item)">
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
          <strong>Agregar Municipio a {{ manual }} - código de tarifa: {{ tarifa_id }}</strong>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-if="reload = true" color="error" v-bind="attrs" v-on="on" @click="getMunicipioTarifa()">
                mdi-reload
              </v-icon>
            </template>
            <span>Recargar Municipios</span>
          </v-tooltip>
        </div>
      </v-alert>

      <!-- Formulario para agregar un nuevo cup -->
      <v-row>
        <v-col cols="12" md="10">
          <!-- Autocompletado para seleccionar un cup -->
          <v-autocomplete dense v-model="municipio_id" :items="municipios" label="Buscar Municipio .." item-value="id"
            item-text="nombre" outlined>
          </v-autocomplete>
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
        municipio_id: null, // ID del cup seleccionado para agregar
        headers: [{
            text: 'Id',
            value: 'id'
          },
          {
            text: 'Municipio',
            value: 'nombre'
          },
          {
            text: 'Departamento',
            value: 'departamentos_nombre'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false,
            align: 'center'
          },
        ],
        municipios: [], // Lista de cups disponibles para seleccionar
        municipioTarifa: [] // Lista de cups ya asociados a la tarifa
      }
    },

    watch: {
      // Observa cambios en tarifa_id para actualizar cupsTarifa
      tarifa_id: {
        handler(value, oldValue) {
          if (value) {
            this.getMunicipioTarifa();
          }
        },
        immediate: true,
      }
    },

    created() {
      // Al crear el componente, obtiene los cups y cupsTarifa
      this.getMunicipios();
      this.getMunicipioTarifa();
    },

    methods: {
      // Mapea la acción setPreload del módulo 'app' en Vuex
      ...mapActions('app', ['setPreload']),


      // Obtener los municipios
      async getMunicipios() {
        try {
          const {
            data
          } = await this.$axios.get("/municipios/listar");
          if (data.length >= 2) {
            this.municipios = data.map((municipio) => {
              return {
                id: municipio.id,
                 nombre: `${municipio.nombre} - ${municipio.departamento.nombre}`,
              }
            })
          } else if (data.length == 1) {
            this.municipios = data.map((municipio) => {
              return {
                id: municipio.id,
                 nombre: `${municipio.nombre} - ${municipio.departamento.nombre}`,
              }
            })
          }
        } catch (error) {
          this.$toast.error("Problemas al consultar los municipios.");
        }
      },

      // Obtiene los cups asociados a la tarifa actual
      async getMunicipioTarifa() {
        try {
          this.loading = true; // Muestra el spinner
          const {
            data
          } = await this.$axios.get('/tarifa/municipios-tarifa/' + this.tarifa_id);
          this.municipioTarifa = data;
        } catch (error) {
          console.log(error);
        } finally {
          this.loading = false; // Oculta el spinner
        }
      },

      // Agrega un cup a la tarifa
      async agregar() {
        if (!this.municipio_id) {
          return this.$toast.error('Debe escoger un municipio.');
        }
        try {
          this.setPreload(true);
          await this.$axios.post('/tarifa/tarifa-municipio/' + this.tarifa_id, {
            municipio_id: this.municipio_id
          }); // Envía un array con el municipio_id
          this.$toast.success('El municipio se agregó correctamente.');
          this.getMunicipioTarifa(); // Actualiza la lista de cupsTarifa
          this.limpiar(); // Limpia el campo municipio_id
        } catch (error) {
          this.$toast.error('El municipio no se agregó correctamente.');
        } finally {
          this.setPreload(false);
        }
      },

      // Limpia el campo de selección de cup
      limpiar() {
        this.municipio_id = null;
      },

      open() {
        this.$toast.info('Edición abierta');
      },
      close() {
        this.$toast.info('Edición cerrada');
      },

      //Elimina el cups parametrizado en la tarifa
      eliminarMunicipioTarifaIndividual(item) {
        this.$swal({
          title: "¿Está seguro?",
          text: `Se quitará el Municipio "${item.nombre}"`,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
        }).then(res => {
          if (res.value) {
            this.setPreload(true);
            this.$axios.post('/tarifa/deleteMunicipioTarifas', {
              municipio_tarifas_id: item.id
            }).then(() => {
              this.getMunicipioTarifa();
              this.$toast.success('Se elimino correctamente');
            }).catch(error => {
              this.$toast.error('No se ha podido eliminar el municipio');
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
