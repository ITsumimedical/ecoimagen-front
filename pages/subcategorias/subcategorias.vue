<template>
  <div>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-data-table
      key="id"
      dense
      :headers="headers"
      :search="buscarSubcategoria"
      :items="subcategorias"
      sort-by="id"
      class="elevation-1"
      :loading="loading"
      loading-text="Cargando..."
      hide-default-footer
      no-data-text="Sin datos para mostrar"
    >
      <template v-slot:[`item.nombreEstado`]="{ item }">
        <v-chip small :color="item.estado_id == 1 ? 'green' : 'red'" dark>
          {{ item.estado_id == 1 ? "Activo" : "Inactivo" }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn
            small
            color="boton"
            class="mb-2 white--text"
            @click="nuevo = true"
          >
            Nuevo
            <v-icon> mdi-plus-circle-outline </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="buscarSubcategoria"
            label="Buscar"
            append-icon="mdi-magnify"
            hide-details
            single-line
          >
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div style="display: flex; gap: 0.4rem; justify-content: center">
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
                color="primary"
                small
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="abrirModalDerechos(item)"
              >
                mdi-scale-balance
              </v-icon>
            </template>
            <span>Parametrizar Derechos</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :color="item.estado_id == 1 ? 'green' : 'red'"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="cambiarEstadoSubcategorias(item)"
              >
                {{
                  item.estado_id == 1
                    ? "mdi-toggle-switch-off"
                    : "mdi-toggle-switch"
                }}
              </v-icon>
            </template>
            <span>{{ item.estado_id == 1 ? "Desactivar" : "Activar" }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
    <v-row no-gutters style="background-color: white">
      <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
        <v-pagination
          v-model="pagina"
          class="my-4"
          :length="total"
          :total-visible="9"
          @input="listarSubcategorias"
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
          @change="listarSubcategorias()"
        >
        </v-select>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogEditar" max-width="800" persistent>
      <v-card>
        <v-alert dense text outlined color="info" icon="mdi-pencil-box-outline">
          <b> {{ modoEdicion ? "Editar" : "Crear" }} Subcategoria</b>
        </v-alert>
        <v-card-title>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              label="Nombre"
              v-model="subcategoriaEditar.nombre"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-autocomplete
              label="Categoria"
              v-model="subcategoriaEditar.categoria_id"
              :items="categorias"
              item-text="nombre"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-textarea
              label="Descripcion"
              v-model="subcategoriaEditar.descripcion"
            ></v-textarea>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small dark @click="dialogEditar = false">
            Cerrar
          </v-btn>
          <v-btn color="warning" small @click="actualizar()" v-if="modoEdicion">
            Actualizar
          </v-btn>
          <v-btn color="success" small @click="crearSubcategoria()" v-else>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="nuevo" max-width="800" persistent>
      <v-card>
        <v-alert
          dense
          text
          outlined
          color="info"
          icon="mdi-plus-box-multiple-outline"
          ><b>Crear Subcategoria</b>
        </v-alert>
        <v-card-title>
          <v-col cols="12" sm="12" md="6">
            <v-text-field label="Nombre" v-model="subcategoriaCrear.nombre">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-autocomplete
              label="Categoria"
              v-model="subcategoriaCrear.categoria_id"
              :items="categorias"
              item-text="nombre"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-textarea
              label="Descripción"
              v-model="subcategoriaCrear.descripcion"
            >
            </v-textarea>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small dark @click="cerrarDialogo()">
            Cerrar
          </v-btn>
          <v-btn color="success" small @click="crearSubcategoria()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <modalAsignarDerechos
      :mostrarModalDerechos.sync="mostrarModalDerechos"
      :subcategoriaSeleccionada="subcategoriaSeleccionada"
    />
  </div>
</template>

<script>
import modalAsignarDerechos from "@/components/gestionPqrsf/modalAsignarDerechos.vue";

export default {
  components: {
    modalAsignarDerechos,
  },
  data() {
    return {
      search: "",
      buscarSubcategoria: "",
      subcategorias: [],
      categorias: [],
      preload: false,
      loading: false,
      nuevo: false,
      dialogEditar: false,
      modoEdicion: false,
      pagina: 1,
      total: 0,
      opcionActual: 5,
      opciones: [5, 10, 20, 50, 100],
      subcategoriaEditar: {
        id: "",
        nombre: "",
        categoria_id: "",
        descripcion: "",
      },
      subcategoriaCrear: {
        id: "",
        nombre: "",
        categoria_id: "",
        descripcion: "",
      },
      paginate: {
        total: 0,
        page: 1,
      },
      headers: [
        {
          text: "id",
          value: "id",
        },
        {
          text: "Nombre",
          value: "nombre",
        },
        {
          text: "Categoria",
          value: "categoria",
        },
        {
          text: "Descripcion",
          value: "descripcion",
        },
        {
          text: "Estado",
          value: "nombreEstado",
        },
        {
          text: "Acciones",
          value: "actions",
        },
      ],
      mostrarModalDerechos: false,
      subcategoriaSeleccionada: {},
    };
  },

  mounted() {
    this.listarSubcategorias();
    this.listarCategorias();
  },

  methods: {
    listarSubcategorias() {
      (this.preload = true),
        this.$axios
          .get(
            "subcategorias/listarTodos?page=" +
              this.pagina +
              "&cantidad=" +
              this.opcionActual
          )
          .then((res) => {
            this.subcategorias = res.data.data;
            this.total = res.data.last_page;
            this.preload = false;
          })
          .catch((error) => {
            this.$toast.error(error.response.data.mensaje);
          });
    },

    listarCategorias() {
      this.$axios
        .get("/categorias/listar")
        .then((res) => {
          this.categorias = res.data.data;
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        });
    },

    crearSubcategoria() {
      const data = {
        nombre: this.subcategoriaCrear.nombre,
        categoria_id: this.subcategoriaCrear.categoria_id,
        descripcion: this.subcategoriaCrear.descripcion,
      };

      this.$axios
        .post("/subcategorias/crear", data)
        .then((res) => {
          this.$toast.success("Subcategoría Creada Con Éxito!");
          this.nuevo = false;
          this.listarSubcategorias();
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        });
    },

    actualizar() {
      // Verificar si los campos obligatorios están presentes
      if (!this.subcategoriaEditar.nombre) {
        this.$toast.error('Por favor, complete el campo "Nombre".');
        return;
      }

      if (!this.subcategoriaEditar.categoria_id) {
        this.$toast.error('Por favor, complete el campo "Categoría ID".');
        return;
      }

      if (!this.subcategoriaEditar.descripcion) {
        this.$toast.error('Por favor, complete el campo "Descripción".');
        return;
      }

      const categoriaId = parseInt(this.subcategoriaEditar.categoria_id);
      if (isNaN(categoriaId)) {
        this.$toast.error('El campo "Categoría ID" debe ser un número entero.');
        return;
      }

      const data = {
        nombre: this.subcategoriaEditar.nombre,
        categoria_id: categoriaId,
        descripcion: this.subcategoriaEditar.descripcion,
      };

      const id = this.subcategoriaEditar.id;

      this.$axios
        .put(`/subcategorias/${id}`, data)
        .then((res) => {
          this.$toast.success("Subcategoría Actualizada Con Éxito!");
          this.dialogEditar = false;
          this.listarSubcategorias();
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        });
    },

    cerrarDialogo() {
      this.subcategoriaCrear = {
        nombre: "",
        categoria_id: null,
        descripcion: "",
      };
      this.nuevo = false;
    },

    cambiarEstadoSubcategorias(item) {
      this.$swal({
        title: "Atención!",
        text: "¿Esta seguro de cambiar el estado?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.preload = true;
          this.$axios
            .post(`subcategorias/cambiarEstado/${item.id}`, {
              estado_id: item.estado_id ? 1 : 2,
            })
            .then(() => {
              this.$swal({
                title: "Éxito",
                text: "Se ha cambiado el estado con éxito",
                type: "success",
              });
              this.listarSubcategorias();
            })
            .catch((error) => {
              this.$toast.error("Error al cambiar el estado");
              console.error(error);
            })
            .finally(() => {
              this.preload = false;
            });
        }
      });
    },
    editar(item) {
      this.subcategoriaEditar = {
        ...item,
      };
      this.modoEdicion = true;
      this.dialogEditar = true;
    },

    abrirModalDerechos(item) {
      this.mostrarModalDerechos = true;
      this.subcategoriaSeleccionada = item;
    },
  },
};
</script>
