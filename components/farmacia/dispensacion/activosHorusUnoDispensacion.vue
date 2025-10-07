<template>
  <div>
    <v-row dense class="mt-2">
      <v-col cols="12" sm="12" md="12">
        <v-text-field
          dense
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          outlined
          v-model="search"
          no-results-text="No se encontraron resultados para su búsqueda"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-data-table
          dense
          :headers="headersActivos"
          :items="ordenesActivas"
          :loading="loading.tablaOrdenesActivas"
          no-data-text="El afiliado no cuenta con Ordenes Activas en Horus 1"
          loading-text="Cargando... Por favor espere"
          :search="search"
        >
          <template v-slot:[`item.Fechaorden`]="{ item }">
            {{ $moment(item.Fechaorden).format("DD-MM-YYYY") }}
          </template>
          <template v-slot:[`item.Estado_id`]="{ item }">
            <v-chip
              :color="obtenerEstado(parseInt(item.Estado_id)).color"
              small
              dark
            >
              {{ obtenerEstado(parseInt(item.Estado_id)).nombre }}
            </v-chip>
          </template>

          <template v-slot:[`item.acciones`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="warning"
                  v-bind="attrs"
                  v-on="on"
                  @click="transcribirOrden(item)"
                >
                  mdi-file-download
                </v-icon>
              </template>
              <span>Transcribir Orden</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "activosHorusUnoDispensacion",
  props: {
    afiliado: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      headersActivos: [
        { text: "N° Orden", value: "id", align: "center" },
        { text: "Fecha de Vigencia", value: "Fechaorden", align: "center" },
        { text: "Página", value: "paginacion", align: "center" },
        { text: "Estado", value: "Estado_id", align: "center" },
        { text: "Acciones", value: "acciones", align: "center" },
      ],
      ordenesActivas: [],
      loading: {
        tablaOrdenesActivas: false,
      },
    };
  },
  mounted() {
    this.listarOrdenesHorusUno();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarOrdenesHorusUno() {
      const data = {
        Num_Doc: this.afiliado.numero_documento,
      };

      this.loading.tablaOrdenesActivas = true;
      this.$axios
        .post("/ordenamiento/historialHorus1", data)
        .then((res) => {
          this.ordenesActivas = res.data.data;
        })
        .catch((e) => {
          this.$toast.error("Ocurrio un error al cargar las ordenes activas");
        })
        .finally(() => {
          this.loading.tablaOrdenesActivas = false;
        });
    },

    obtenerEstado(estado_id) {
      switch (estado_id) {
        case 1:
          return {
            color: "success",
            nombre: "Activo",
          };
        case 7:
          return {
            color: "success",
            nombre: "Autorizado",
          };
        case 18:
          return {
            color: "warning",
            nombre: "Pendiente",
          };
        case 19:
          return {
            color: "error",
            nombre: "Parcial",
          };
        default:
          return {
            color: "grey",
            nombre: "Desconocido",
          };
      }
    },

    transcribirOrden(item) {
      item.afiliado_id = this.afiliado.id;

      this.setPreload(true);

      this.$axios
        .post("/ordenamiento/transcribirFormulas", item)
        .then((res) => {
          this.$toast.success("Transcripción realizada exitosamente");
        })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al realizar la transcripción");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
