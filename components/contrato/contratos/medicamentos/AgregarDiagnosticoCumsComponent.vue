<template>
  <!-- Tabla de datos que muestra los cups asociados a una tarifa -->
  <v-data-table
    :headers="headers"
    :items="municipioTarifa"
    :search="search"
    :loading="loading"
    dense
  >
    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="error"
            small
            class="mr-2"
            v-bind="attrs"
            v-on="on"
            @click="eliminarDiagnosticoTarifaIndividual(item)"
          >
            mdi-delete</v-icon
          >
        </template>
        <span>Quitar Diagnóstico</span>
      </v-tooltip>
    </template>

    <template v-slot:top>
      <!-- Alerta informativa en la parte superior -->
      <v-alert
        text
        dense
        border="left"
        type="info"
        icon="mdi-file-document-outline"
      >
        <div class="d-flex justify-space-between">
          <!-- Título y componente para carga masiva -->
          <strong
            >Agregar Diagnostico a {{ manual }} - código de tarifa:
            {{ tarifa_id }}</strong
          >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="(reload = true)"
                color="error"
                v-bind="attrs"
                v-on="on"
                @click="getDiagnosticoTarifa()"
              >
                mdi-reload
              </v-icon>
            </template>
            <span>Recargar Diagnosticos</span>
          </v-tooltip>
        </div>
      </v-alert>

      <!-- Formulario para agregar un nuevo dx -->
      <v-row>
        <v-col cols="12" md="10">
          <!-- Autocompletado para seleccionar un dx -->
          <v-autocomplete
            v-model="cie10_id"
            :loading="loading"
            :items="cie10s"
            item-text="Codigo_Nombre"
            label="Diagnóstico"
            item-value="id"
            :search-input.sync="cie10"
            dense
            outlined
            solo
            no-data-text="Por favor escriba el nombre del diagnostico"
            required
            return-object
            :rules="diagnosticoRequerido"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="2">
          <!-- Botón para agregar el dx seleccionado -->
          <v-btn dark color="primary" @click="agregar()">Agregar</v-btn>
        </v-col>
      </v-row>

      <!-- Campo de búsqueda en la tabla -->
      <v-text-field
        v-model="search"
        label="Buscar en tabla..."
        outlined
        dense
      ></v-text-field>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    tarifa_id: {
      type: Number,
      default: null,
    },
    manual: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      loading: false, // Estado de carga para mostrar spinners
      search: "", // Texto de búsqueda en la tabla
      cie10: null, // Texto de búsqueda para filtrar dx
      cie10s: [], // Lista de dx disponibles para seleccionar
      cie10_id: null, // ID del dx seleccionado para agregar
      diagnosticoRequerido: [(v) => !!v || "Este campo es requerido"],
      headers: [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "Codigo Cie10",
          value: "codigo_cie10",
        },

        {
          text: "Nombre",
          value: "descripcion",
        },
        {
          text: "Acciones",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
    };
  },

  watch: {
    // Observa cambios en tarifa_id para actualizar cupsTarifa
    tarifa_id: {
      handler(value, oldValue) {
        if (value) {
          this.getDiagnosticoTarifa();
        }
      },
      immediate: true,
    },

    cie10(val) {
      if (val) {
        if (val.length === 4) {
          this.listarCie10();
        } else if (val.length < 4) {
          this.cie10s = [];
        }
      } else {
        this.cie10s = [];
      }
    },
  },

  created() {
    this.getDiagnosticoTarifa();
  },

  methods: {
    // Mapea la acción setPreload del módulo 'app' en Vuex
    ...mapActions("app", ["setPreload"]),

    async listarCie10() {
      const data = {
        valor: this.cie10,
      };
      this.loading = true;
      await this.$axios
        .$post("cie10/listarFiltro", data)
        .then((res) => {
          this.cie10s = res;
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error(err.response.data.mensaje);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Obtiene los diagnosticos asociados a la tarifa actual
    async getDiagnosticoTarifa() {
      try {
        this.loading = true; // Muestra el spinner
        const { data } = await this.$axios.get(
          "/tarifa/diagnostico-tarifa/" + this.tarifa_id
        );
        this.municipioTarifa = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false; // Oculta el spinner
      }
    },

    // Agrega un diagnostico a la tarifa
    async agregar() {
      if (!this.cie10_id) {
        return this.$toast.error("Debe escoger un Diagnóstico.");
      }
      try {
        this.setPreload(true);
        await this.$axios.post("/tarifa/tarifa-diagnostico/" + this.tarifa_id, {
          cie10_id: this.cie10_id.id,
        }); // Envía un array con el cie10_id
        this.$toast.success("El diagnóstico se agregó correctamente.");
        this.getDiagnosticoTarifa(); // Actualiza la lista de cupsTarifa
        this.limpiar(); // Limpia el campo cie10_id
      } catch (error) {
        this.$toast.error("El diagnóstico no se agregó correctamente.");
      } finally {
        this.setPreload(false);
      }
    },

    // Limpia el campo de selección de diagnóstico
    limpiar() {
      this.cie10_id = null;
    },

    open() {
      this.$toast.info("Edición abierta");
    },
    close() {
      this.$toast.info("Edición cerrada");
    },

    //Elimina el diagnostico parametrizado en la tarifa
    eliminarDiagnosticoTarifaIndividual(item) {
      this.$swal({
        title: "¿Está seguro?",
        text: `Se quitará el diagnostico "${item.descripcion}" de la tarifa.`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((res) => {
        if (res.value) {
          this.setPreload(true);
          this.$axios
            .post("/tarifa/delete-diagnostico-tarifas", {
              diagnostico_tarifa_id: item.id,
            })
            .then(() => {
              this.getDiagnosticoTarifa();
              this.$toast.success("Se elimino correctamente");
            })
            .catch((error) => {
              this.$toast.error("No se ha podido eliminar el municipio");
              console.log(error);
            })
            .finally(() => {
              this.setPreload(false);
            });
        }
      });
    },
  },
};
</script>
