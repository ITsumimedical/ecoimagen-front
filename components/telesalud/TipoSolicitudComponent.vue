<template>
  <div>
    <v-card>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-card-title>
        <v-btn tile small color="success" @click="dialog = true">
          <v-icon left> mdi-plus-box </v-icon>
          Crear tipo solicitud
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="buscarTipoSolicitud"
          dense
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        >
        </v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :search="buscarTipoSolicitud"
        :items="tipoSolitudes"
        sort-by="id"
        :loading="loading"
        loading-text="Cargando..."
        hide-default-footer
        dense
        no-data-text="Sin datos para mostrar"
      >
        <template v-slot:[`item.activo`]="{ item }">
          <v-chip small :color="chipEstado(item.activo)" dark>{{
            item.activo == "1" ? "Activo" : "Inactivo"
          }}</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="warning"
                small
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="editar(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="info"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="deleteItemConfirm(item)"
              >
                mdi-list-status
              </v-icon>
            </template>
            <span>{{ item.activo == true ? "Inactivar" : "Activar" }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-row no-gutters>
      <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
        <v-pagination
          v-model="pagina"
          class="my-4"
          :length="total"
          :total-visible="9"
          @input="listarTipoSolicitud"
        >
        </v-pagination>
      </v-col>
      <v-col
        md="3"
        lg="3"
        xl="1"
        sm="1"
        class="px-2"
        cols
        style="min-width: 100px"
      >
        <v-select
          class="my-4"
          v-model="opcionActual"
          :items="opciones"
          dense
          solo
          small
          @change="listarTipoSolicitud"
        >
        </v-select>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="750px">
      <v-card>
        <v-card-title class="titulo black--text">
          <span class="text-h5">{{ titulo }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <form @submit.prevent="guardarTipoSolicitud">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  dense
                  v-model="tipoSolicitud.nombre"
                  label="Nombre"
                  :error-messages="errors.nombre"
                  autofocus
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  dense
                  v-model="tipoSolicitud.descripcion"
                  label="Descripción"
                  :error-messages="errors.descripcion"
                  @keyup.enter="guardarTipoSolicitud"
                >
                </v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="12" md="2" v-if="editedIndex > -1">
                    <v-checkbox dense v-model="tipoSolicitud.activo" label="Activo" :error-messages="errors.activo">
                    </v-checkbox>
                  </v-col> -->
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="close()"> Cancelar </v-btn>
            <v-btn small color="primary" dark @click="guardarTipoSolicitud()">
              Guardar
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  guardarTipoSolicitud,
  actualizarTipoSolicitud,
} from "@/api/teleapoyo/tipoSolicitud";
export default {
  middleware({ $can, redirect }) {
    if (!$can("telesalud.parametrizacion")) {
      return redirect("/");
    }
  },
  name: "WorkspaceJsonTipoSolicitud",

  data() {
    return {
      preload: false,
      loading: false,
      dialog: false,
      dialogoEditar: false,
      buscarTipoSolicitud: "",
      tipoSolitudes: [],
      tipoSolicitud: {
        nombre: "",
        descripcion: "",
        activo: true,
      },
      editedIndex: -1,
      defecto: {
        nombre: "",
        descripcion: "",
        activo: true,
      },
      errors: {
        nombre: "",
        descripcion: "",
        activo: "",
      },
      pagina: 1,
      total: 0,
      opcionActual: 5,
      opciones: [5, 10, 20, 50, 100],
      headers: [
        {
          text: "id",
          sortable: false,
          value: "id",
        },
        {
          text: "Nombre",
          value: "nombre",
        },
        {
          text: "Descripción",
          value: "descripcion",
        },
        {
          text: "Estado",
          value: "activo",
        },
        {
          text: "Acciones",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },

  mounted() {
    this.listarTipoSolicitud();
  },

  computed: {
    titulo() {
      return this.editedIndex === -1
        ? "Crear tipo solicitud"
        : "Editar tipo solicitud";
    },
  },

  watch: {
    dialogoBloqueos(val) {
      val || this.cerrarDialogo();
    },
  },

  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.tipoSolicitud = Object.assign({}, this.defecto);
        this.editedIndex = -1;
      });
      this.limpiarError();
    },

    listarTipoSolicitud() {
      this.preload = true;
      this.$axios
        .get(
          "tipo-solicitud/listar?page=" +
            this.pagina +
            "&cantidad=" +
            this.opcionActual
        )
        .then((res) => {
          this.tipoSolitudes = res.data.data;
          this.total = res.data.last_page;
          this.preload = false;
        })
        .catch((e) => {
          console.log(e);
          this.preload = false;
        });
    },

    async guardarTipoSolicitud() {
      this.limpiarError();
      if (this.editedIndex > -1) {
        this.preload = true;
        try {
          const { data } = await this.$loadingPutRequest(
            actualizarTipoSolicitud(this.tipoSolicitud.id),
            this.tipoSolicitud
          );
          this.listarTipoSolicitud();
          this.close();
          this.preload = false;
        } catch (error) {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje);
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data);
          }
        }
      } else {
        try {
          this.preload = true;
          const { data } = await this.$loadingPostRequest(
            guardarTipoSolicitud(),
            this.tipoSolicitud
          );
          this.$toast.success(data.mensaje);
          this.listarTipoSolicitud();
          this.close();
          this.preload = false;
        } catch (error) {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje);
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data);
          }
        }
      }
    },

    ErrorEntrada(errors) {
      for (const key in this.errors) {
        if (key in errors) {
          this.errors[key] = errors[key].join(",");
        }
      }
    },

    limpiarError() {
      for (const key in this.errors) {
        this.errors[key] = "";
      }
    },

    editar(item) {
      this.editedIndex = this.tipoSolitudes.indexOf(item);
      this.tipoSolicitud = Object.assign({}, item);
      this.dialog = true;
    },

    chipEstado(estado) {
      if (estado == "1") return "success";
      else if (estado == "0") return "alerta";
      else return "warning";
    },

    deleteItemConfirm(item) {
      return this.$swal({
        title: "¿Está Seguro?",
        text: "Deseas cambiar el estado de esta solicitud",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.value) {
          const request = {
            activo: item.activo == 1 ? 0 : 1,
            created_at: item.created_at,
            deleted_at: item.deleted_at,
            descripcion: item.descripcion,
            id: item.id,
            nombre: item.nombre,
            updated_at: item.updated_at,
          };
          this.$axios
            .put("tipo-solicitud/" + item.id, request)
            .then((res) => {
              this.listarTipoSolicitud();
              this.close();
              this.preload = false;
            })
            .catch((error) => {
              this.preload = false;
              if (error.response.data.mensaje) {
                this.$toast.error(error.response.data.mensaje);
              } else if (error.response.data) {
                this.ErrorEntrada(error.response.data);
              }
            });
        }
      });
    },
  },
};
</script>
