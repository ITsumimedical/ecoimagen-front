<template>
  <v-dialog v-model="mostrarModalDerechos" max-width="900px" persistent>
    <v-card>
      <v-alert
        dense
        text
        border="left"
        icon="mdi-scale-balance"
        color="primary"
      >
        <b>Asignar Derechos</b>
      </v-alert>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="10" md="10">
            <v-autocomplete
              dense
              outlined
              label="Derechos"
              :items="opcionesDerechos"
              :loading="loading.opcionesDerechos"
              item-text="descripcion"
              item-value="id"
              multiple
              chips
              small-chips
              deletable-chips
              clearable
              v-model="derechosAsignar"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="2" md="2" align="end">
            <v-btn small color="success" @click="asignarDerechos()" block>
              <b>Asignar</b>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-data-table
              dense
              :headers="headersDerechosSubcategoria"
              :items="subcategoriaActual.derechos"
              :loading="loading.derechos"
              loading-text="Cargando... Por favor espere"
              no-data-text="La subcategoría no tienen derechos asociados"
              show-select
              v-model:select="derechosRemover"
            >
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small dark color="error" @click="cerrarModal()"> Cerrar </v-btn>
        <v-btn small color="warning" @click="removerDerechos()">
          Remover Derechos
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarModalDerechos: {
      type: Boolean,
      default: false,
    },
    subcategoriaSeleccionada: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      subcategoriaActual: {},
      headersDerechosSubcategoria: [
        { text: "ID", value: "id", align: "center" },
        { text: "Descripción", value: "descripcion" },
      ],
      loading: {
        derechos: false,
        opcionesDerechos: false,
      },
      opcionesDerechos: [],
      derechosAsignar: [],
      derechosRemover: [],
    };
  },
  watch: {
    mostrarModalDerechos(newValue) {
      if (newValue) {
        this.buscarSubcategoria();
        this.listarDerechosActivos();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.derechosAsignar = [];
      this.derechosRemover = [];
      this.$emit("update:mostrarModalDerechos", false);
    },

    buscarSubcategoria() {
      this.loading.derechos = true;
      this.$axios
        .get(`/subcategorias/listarPorId/${this.subcategoriaSeleccionada.id}`)
        .then((res) => {
          this.subcategoriaActual = res.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar la subcategoría");
        })
        .finally(() => {
          this.loading.derechos = false;
        });
    },

    listarDerechosActivos() {
      this.loading.opcionesDerechos = true;
      this.$axios
        .get("/derechos/listarActivos")
        .then((res) => {
          this.opcionesDerechos = res.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar los derechos");
        })
        .finally(() => {
          this.loading.opcionesDerechos = false;
        });
    },

    removerDerechos() {
      if (this.derechosRemover.length === 0) {
        this.$toast.error("Debe seleccionar al menos un derecho");
        return;
      }

      const derechosIDs = this.derechosRemover.map((derecho) => derecho.id);

      this.setPreload(true);
      this.$axios
        .post(
          `/subcategorias/eliminarDerechosAsignados/${this.subcategoriaActual.id}`,
          {
            derechos: derechosIDs,
          }
        )
        .then((res) => {
          this.$toast.success(res.data.mensaje);
          this.buscarSubcategoria();
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    asignarDerechos() {
      if (this.derechosAsignar.length === 0) {
        this.$toast.error("Debe seleccionar al menos un derecho");
        return;
      }

      // Extraer los IDs de los derechos ya asignados en la subcategoría actual
      const derechosYaAsignados = this.subcategoriaActual.derechos.map(
        (derecho) => derecho.id
      );

      // Filtrar solo los derechos que no han sido asignados previamente
      const nuevosDerechos = this.derechosAsignar.filter(
        (derechoId) => !derechosYaAsignados.includes(derechoId)
      );

      if (nuevosDerechos.length === 0) {
        return this.$toast.error(
          "Todos los derechos seleccionados ya fueron asignados"
        );
      }

      this.setPreload(true);

      // Enviar la asignación de los nuevos derechos
      this.$axios
        .post(`/subcategorias/asignarDerechos/${this.subcategoriaActual.id}`, {
          derechos: nuevosDerechos,
        })
        .then((res) => {
          this.$toast.success(res.data.mensaje);
          this.buscarSubcategoria(); // Actualizar la lista de derechos después de la asignación
          this.derechosAsignar = [];
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
