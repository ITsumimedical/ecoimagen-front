<template>
  <div>
    <v-row dense>
      <v-col cols="12" sm="10" md="10">
        <v-text-field
          dense
          v-model="filtro.radicado_id"
          outlined
          label="N° Radicado"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2" md="2">
        <v-btn color="primary" style="width: 49%" @click="listarPqrsfAfiliado"
          >Buscar</v-btn
        >
        <v-btn color="error" style="width: 49%" @click="limpiarFiltro"
          >Limpiar</v-btn
        >
      </v-col>

      <v-col cols="12" sm="12" md="12">
        <v-data-table
          dense
          :headers="headersPqrsf"
          :items="pqrsf"
          :loading="loading.tabla"
          loading-text="Cargando..."
          no-data-text="No tiene PQRSF registradas"
        >
          <template v-slot:[`item.fechaCreacion`]="{ item }">
            {{ $moment(item.created_at).format("DD/MM/YYYY") }}
          </template>
          <template v-slot:[`item.estadoPQR`]="{ item }">
            <v-chip dark small :color="obtenerEstado(item.estado_id).color">{{
              obtenerEstado(item.estado_id).nombre
            }}</v-chip>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="info"
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  small
                  @click="abrirDetallesPqrsf(item)"
                  >mdi-eye</v-icon
                >
              </template>
              <span>Ver</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <modalDetallesPqrsf
      :pqrsf="pqrsfSeleccionado"
      :mostrarDetallesPqrsf.sync="mostrarDetallesPqrsf"
      @actualizarDatosContactoPQRSF="actualizarDatosContactoPQRSF"
    ></modalDetallesPqrsf>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import modalDetallesPqrsf from "@/components/pqrsf/modalDetallesPqrsf.vue";

export default {
  components: {
    modalDetallesPqrsf,
  },
  data() {
    return {
      headersPqrsf: [
        { text: "N° Radicado", value: "id", align: "center" },
        {
          text: "Tipo de Solicitud",
          value: "solicitud.nombre",
          align: "center",
        },
        { text: "Fecha Radicación", value: "fechaCreacion", align: "center" },
        { text: "Correo Electrónico", value: "correo", align: "center" },
        { text: "Telefóno o Celular", value: "telefono", align: "center" },
        { text: "Estado", value: "estadoPQR", align: "center" },
        {
          text: "Acciones",
          value: "acciones",
          sortable: false,
          align: "center",
        },
      ],
      pqrsf: [],
      loading: {
        tabla: false,
      },
      filtro: {
        radicado_id: "",
      },
      pqrsfSeleccionado: null,
      mostrarDetallesPqrsf: false,
    };
  },
  created() {
    this.listarPqrsfAfiliado();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarPqrsfAfiliado() {
      this.loading.tabla = true;

      this.$axios
        .post("formularios-pqrsf/listarPqrsfAutogestion", {
          radicado_id: this.filtro.radicado_id,
        })
        .then((res) => {
          this.pqrsf = res.data;
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar sus PQRSF");
        })
        .finally(() => {
          this.loading.tabla = false;
        });
    },

    limpiarFiltro() {
      this.filtro.radicado_id = "";
      this.listarPqrsfAfiliado();
    },

    obtenerEstado(estadoId) {
      switch (estadoId) {
        case 5:
          return { color: "red darken-2", nombre: "Anulado" };
        // En Gestión - Se usa esta modificacion visual ya que no es de interes para el usuario que la PQRSF esté en estado Asignado o PreSolucionado(Parcial)
        case 6:
        case 18:
          return { color: "blue darken-2", nombre: "En Gestión" };
        case 10:
          return { color: "yellow darken-2", nombre: "Pendiente" };
        case 17:
          return { color: "green darken-2", nombre: "Cerrado" };
        default:
          return { color: "gray", nombre: "Desconocido" };
      }
    },

    abrirDetallesPqrsf(item) {
      this.pqrsfSeleccionado = item;
      this.mostrarDetallesPqrsf = true;
    },

    actualizarDatosContactoPQRSF(data) {
      this.setPreload(true);
      this.$axios
        .post(
          `formularios-pqrsf/actualizarDatosContactoPqrsf/${data.pqrsf_id}`,
          data
        )
        .then((res) => {
          this.$toast.success("Datos de contacto actualizados con éxito");
          this.listarPqrsfAfiliado();
        })
        .catch((error) => {
          this.$toast.error(
            "Ocurrió un error al actualizar sus datos de contacto"
          );
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
