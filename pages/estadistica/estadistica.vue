<template>
  <div>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <v-container grid-list-md fluid class="pa-0">
      <v-layout row wrap>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-alert text dense color="light-blue darken-4" icon="mdi-chart-bar"><b>ESTADISTICAS</b>
                <v-btn v-if="$can('estadistica.actualizar')" icon dark @click="nuevaEstadistica = true"
                  style="position: absolute; top: 5px; right: 5px; color: blue;">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-plus</v-icon>
                    </template>
                    <span>Agregar Estadística</span>
                  </v-tooltip>
                </v-btn>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-layout>

      <v-row>
        <v-col v-for="card in cards" :key="card.id" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-alert border="left" prominent text color="light-blue darken-4
" icon="mdi-finance" @click="verEstadistica(card)" style="position: relative;">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on"> <b>{{ card.titulo ? card.titulo.toUpperCase() : "" }}</b>
                </span>
              </template>
              <span>Haz clic para abrir la estadistica</span>
            </v-tooltip>
            <v-btn icon style="position: absolute; top: 5px; right: 5px;">

              <v-menu v-if="$can('estadistica.actualizar')" bottom left>

                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark icon v-bind="attrs" v-on="on">
                    <v-icon color="info">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-list-item @click="editarEstadistica(card)" v-on="on">
                        <v-list-item-title>
                          <v-icon small color="orange">mdi-pencil</v-icon>
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                    <span>Editar estadística</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-list-item v-if="$can('estadistica.eliminar')" @click="eliminarEstadistica(card)" v-on="on">
                        <v-list-item-title>
                          <v-icon small color="red">mdi-delete-sweep</v-icon>
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                    <span>Eliminar estadística</span>
                  </v-tooltip>
                </v-list>
              </v-menu>
            </v-btn>
          </v-alert>
        </v-col>

        <v-col>
          <!-- <v-card @click="verEstadistica(card)">
            <v-menu offset-y>
              <template v-if="$can('estadistica.actualizar')" v-slot:activator="{ on }">
                <v-app-bar-nav-icon icon v-on="on" @click.stop></v-app-bar-nav-icon>
              </template>
              <v-list>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-list-item @click="editarEstadistica(card)" v-on="on">
                      <v-list-item-title>
                        <v-icon small color="orange">mdi-pencil</v-icon>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <span>Editar estadística</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-list-item v-if="$can('estadistica.eliminar')" @click="eliminarEstadistica(card)" v-on="on">
                      <v-list-item-title>
                        <v-icon small color="red">mdi-delete-sweep</v-icon>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <span>Eliminar estadística</span>
                </v-tooltip>
              </v-list>
            </v-menu>
            <v-responsive class="pt-2">
              <v-img :src="card.imagen" height="150"></v-img>
            </v-responsive>
            <v-card-actions>
              <v-btn small block outlined color="success" class="py-1 green-button">{{ card.titulo }}</v-btn>
            </v-card-actions>
          </v-card> -->
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card class="d-flex flex-column" style="margin: 0; padding: 0;">
          <v-col cols="12">
            <v-alert shaped outlined color="blue" icon="mdi-chart-bar" dense title="Abrir estadística">
              <v-btn icon dark @click="dialog = false" style="position: absolute; top: 5px; right: 5px; color: blue;">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
              <b>{{ inframe.titulo ? inframe.titulo.toUpperCase() : "" }}</b>
            </v-alert>
          </v-col>
          <v-card-text class="d-flex flex-grow-1" style="padding: 0; margin: 0;">
            <v-list class="d-flex flex-grow-1" style="padding: 0; margin: 0;">
              <iframe class="flex-grow-1" style="width: 100%; height: calc(100vh - 64px); border: none;"
                :src="inframe.inframe" frameborder="0" allowFullScreen="true"></iframe>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="nuevaEstadistica" persistent max-width="600px">
        <v-card>
          <v-col>
            <v-alert type="info" dense text outlined icon="mdi-chart-line"><b>Generar Estadistica </b></v-alert>
          </v-col>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field label="Titulo*" v-model="estadistica.titulo" :error-messages="errors.titulo" required>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field v-model="estadistica.inframe" label="inframe*" :error-messages="errors.inframe"
                    required></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete v-model="estadistica.permission_id" :items="permisos" item-text="name" item-value="id"
                    label="Permiso*" :error-messages="errors.permission_id"></v-autocomplete>
                </v-col>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="limpiar()" small>Cerrar</v-btn>
            <v-btn color="success" @click="generarEstadistica()" small>Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editar" persistent max-width="500px">
        <v-form @submit.prevent="estadisticaEditada()">
          <v-card>
            <v-col>
              <v-alert type="info" dense text outlined icon="mdi-chart-line"><b>Editar Estadistica </b></v-alert>
            </v-col>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field label="Titulo" v-model="cambiarEstadistica.titulo" :error-messages="errors.titulo"
                      required></v-text-field>
                  </v-col>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" dark @click="limpiar()" small>Cerrar</v-btn>
              <v-btn type="submit" color="warning" small>Actualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <v-dialog v-model="eliminar" persistent max-width="500px">
        <v-form>
          <v-card>
            <v-col>
              <v-alert dense outlined text color="deep-orange" icon="mdi-alert-plus-outline"><b>Eliminar Estadistica
                </b></v-alert>
            </v-col>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field label="Titulo" v-model="cambiarEstadistica.titulo" :error-messages="errors.titulo"
                      readonly></v-text-field>
                  </v-col>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" small dark @click="eliminar = false">Cerrar</v-btn>
              <v-btn @click="confirmarEliminacion()" color="orange" small dark>Eliminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can("estadistica.listar")) {
        return redirect("/");
      }
    },

    data() {
      return {
        dialog: false,
        inframe: {},
        cards: [],
        nuevaEstadistica: false,
        editar: false,
        eliminar: false,
        preload: false,
        permisos: [],
        cambiarEstadistica: {
          id: "",
          titulo: "",
        },
        estadistica: {
          id: "",
          titulo: "",
          inframe: "",
          permission_id: "",
          imagen_nombre: "",
        },
        errors: {
          titulo: null,
          imagen: null,
          inframe: null,
          permission_id: null,
        },
      };
    },

    computed: {
      ...mapGetters(["can"]),
    },

    mounted() {
      this.listarPermisos();
      this.listarEstadisticas();
    },

    methods: {
      cargaImagen() {
        this.$refs.fileInput.click();
      },

      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.estadistica.imagen_nombre = file.name;
          this.estadistica.imagen = URL.createObjectURL(file);
        } else {
          this.estadistica.imagen_nombre = "";
          this.estadistica.imagen = "";
        }
      },
      selectFile() {
        this.$refs.fileInput.click();
      },

      generarEstadistica() {
        this.preload = true;
        const formData = new FormData();
        formData.append("titulo", this.estadistica.titulo);
        formData.append("inframe", this.estadistica.inframe);
        formData.append("permission_id", this.estadistica.permission_id);
        this.$axios
          .post("/estadisticas/crear", formData, {
            "Content-Type": "form-data",
          })
          .then((res) => {
            this.preload = false;
            this.listarEstadisticas();
            this.estadistica.imagen = res.data.file_path;
            this.$toast.success("Estadística guardada exitosamente.");
            this.nuevaEstadistica = false;
            this.estadistica = {
              titulo: "",
              imagen: "",
              inframe: "",
              permission_id: "",
            };
          })
          .catch((err) => {
            this.preload = false;
            this.$toast.error(
              "Error al guardar la estadística. Por favor, inténtalo de nuevo."
            );
          });
      },

      editarEstadistica(card) {
        this.cambiarEstadistica = {
          ...card,
        };
        this.modoEdicion = true;
        this.editar = true;
      },

      eliminarEstadistica(card) {
        this.cambiarEstadistica = {
          ...card,
        };
        this.modoEdicion = true;
        this.eliminar = true;
      },

      verEstadistica(card) {
        this.preload = true;
        this.inframe = card;
        this.dialog = true;
        this.preload = false;
      },

      listarPermisos() {
        this.$axios
          .post("/permisos/listar")
          .then((res) => {
            this.permisos = res.data.data;
          })
          .catch((err) => {
            console.error(err);
          });
      },

      listarEstadisticas() {
        const userId = this.$store.state.auth.usuario.id;
        this.preload = true;
        this.$axios
          .get(`/estadisticas/listar/${userId}`)
          .then((response) => {
            this.cards = response.data;
            this.cards.forEach((card) => {
              card.imagen = `${window.location.origin}${card.imagen}`;
            });
            this.preload = false;
          })
          .catch((error) => {
            console.error(error);
          });
      },

      estadisticaEditada() {
        const formData = new FormData();
        if (this.cambiarEstadistica.imagen instanceof File) {
          formData.append("imagen", this.cambiarEstadistica.imagen);
        }
        const data = {
          titulo: this.cambiarEstadistica.titulo,
        };
        const id = this.cambiarEstadistica.id;
        this.$axios
          .put(`/estadisticas/${id}`, data, formData)
          .then((res) => {
            this.$toast.success("Estadistica Actualizada Con Éxito!");
            this.editar = false;
            this.listarEstadisticas();
          })
          .catch((error) => {
            this.$toast.error(error.response.data.mensaje);
          });
      },

      //Eliminar una estadistica creada
      borrarEstadistica() {
        const estadisticaId = this.cambiarEstadistica.id;
        this.$axios
          .delete(`/estadisticas/${estadisticaId}`)
          .then((response) => {
            this.listarEstadisticas();
            this.$toast.success("Estadística eliminada exitosamente.");
            this.eliminar = false;
          })
          .catch((error) => {
            this.$toast.error(
              "Error al eliminar la estadística. Por favor, inténtalo de nuevo."
            );
          });
      },
      confirmarEliminacion() {
        this.$swal({
          title: "¡Atención!",
          text: "¿Está seguro de eliminar esta estadística?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#4CAF50",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.value) {
            this.borrarEstadistica();
          }
        });
      },

      limpiar() {
        this.nuevaEstadistica = false;
        this.estadistica = {
          titulo: "",
          imagen: "",
          inframe: "",
          permission_id: "",
        };
        this.editar = false;
      },
    },
  };

</script>
