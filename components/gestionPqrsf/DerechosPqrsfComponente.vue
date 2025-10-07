<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="12" sm="12" align="end">
        <v-btn color="success" small dark @click="abrirModalCrear">
          Nuevo
          <v-icon right> mdi-plus-circle-outline </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-data-table
          :headers="headersDerechos"
          :items="derechos"
          :loading="loading.derechos"
          loading-text="Cargando... Por favor espere"
          no-data-text="Sin datos para mostrar"
          dense
        >
          <template v-slot:[`item.acciones`]="{ item }">
            <div style="display: flex; justify-content: center; gap: 0.2rem">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="warning"
                    v-bind="attrs"
                    v-on="on"
                    @click="abrirModalEditar(item)"
                  >
                    mdi-pencil
                  </v-icon>
                </template>
                <span>Editar Derecho</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    :color="item.activo ? 'green' : 'red'"
                    v-bind="attrs"
                    v-on="on"
                    @click="cambiarEstadoDerecho(item)"
                  >
                    {{
                      item.activo
                        ? "mdi-toggle-switch"
                        : "mdi-toggle-switch-off"
                    }}
                  </v-icon>
                </template>
                <span>{{ item.activo ? "Inactivar" : "Activar" }} Derecho</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Modales -->
    <modalCrearDerecho
      :mostrarModalCrear.sync="mostrarModalCrear"
      @listarDerechos="listarDerechos"
    />

    <modalEditarDerecho
      :mostrarModalEditar.sync="mostrarModalEditar"
      :derecho="derechoSeleccionado"
      @listarDerechos="listarDerechos"
    />
  </div>
</template>
<script>
import { mapActions } from "vuex";
import modalCrearDerecho from "@/components/gestionPqrsf/modalCrearDerecho.vue";
import modalEditarDerecho from "@/components/gestionPqrsf/modalEditarDerecho.vue";

export default {
  components: {
    modalCrearDerecho,
    modalEditarDerecho,
  },
  data() {
    return {
      derechos: [],
      headersDerechos: [
        { text: "ID", value: "id", align: "center" },
        { text: "Derecho", value: "descripcion" },
        {
          text: "Acciones",
          value: "acciones",
          sortable: false,
          align: "center",
        },
      ],
      loading: {
        derechos: false,
      },
      mostrarModalCrear: false,
      mostrarModalEditar: false,
      derechoSeleccionado: {},
    };
  },
  mounted() {
    this.listarDerechos();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarDerechos() {
      this.loading.derechos = true;
      this.$axios
        .get("/derechos/listarDerechos")
        .then((res) => {
          this.derechos = res.data;
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        })
        .finally(() => {
          this.loading.derechos = false;
        });
    },

    abrirModalCrear() {
      this.mostrarModalCrear = true;
    },

    abrirModalEditar(derecho) {
      this.mostrarModalEditar = true;
      this.derechoSeleccionado = derecho;
    },

    cambiarEstadoDerecho(derecho) {
      this.$swal({
        title: "¿Está seguro?",
        text: `¿Desea ${
          derecho.activo ? "inactivar" : "activar"
        } este derecho?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.value) {
          this.setPreload(true);
          this.$axios
            .post(`/derechos/cambiarEstadoDerecho/${derecho.id}`)
            .then((res) => {
              this.$toast.success(res.data.mensaje);
              this.listarDerechos();
            })
            .catch((error) => {
              this.$toast.error(error.response.data.mensaje);
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
