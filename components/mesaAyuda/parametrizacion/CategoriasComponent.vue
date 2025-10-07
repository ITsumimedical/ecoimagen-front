<template>
  <div>
    <v-card-title>
      <v-btn tile small color="success" @click="dialogCategoria = true | fetchAreas(),listarOperador()">
        Crear categoria
        <v-icon right>
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" dense append-icon="mdi-magnify" label="Buscar" single-line hide-details>
      </v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" dense :items="categorias" :search="search" :loading="loading">
      <template v-slot:item.estadoNombre="{ item }">
        <v-chip small :color="item.estado_id == 1 ? 'green' : 'red'" dark>
          {{ item.estado_id == 1 ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" color="warning" @click="editarCategoria(item)">
          mdi-pencil
        </v-icon>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon :color="item.estado_id == 1 ? 'green' : 'red'" class="mr-2" v-bind="attrs" v-on="on"
              @click="cambiarEstadoCategoria(item)">
              {{ item.estado_id == 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
            </v-icon>
          </template>
          <span>{{ item.estado_id == 1? 'Desactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogCategoria" persistent max-width="1000px">
      <v-card>
        <v-alert dense text border="left" type="info">Creación de categoría</v-alert>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6" md="6">
              <v-text-field dense v-model="form.nombre" label="Nombre"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-autocomplete :items="areas" dense v-model="form.areas_mesa_ayuda_id" item-text="nombre" item-value="id"
                label="Area"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete small-chips dense :items="usersAll" item-text="nombre" item-value="user_id" multiple
                deletable-chips chips v-model="form.user_id" label="Usuario">
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" dark @click="dialogCategoria = false">
            Cerrar
          </v-btn>
          <v-btn small color="success" dark @click="guardarCategoria()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogEditarCategoria" persistent max-width="900px">
      <v-card :loading="loading">
        <v-alert text dense border="left" type="info">Actualización de categoría</v-alert>
        <v-card-text>
          <v-container fluid>
            <v-row dense>
              <v-col cols="12" sm="6" md="4">
                <v-text-field dense v-model="datosCategoria.nombre" label="Nombre"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="8">
                <v-autocomplete :items="areas" dense v-model="datosCategoria.areas_mesa_ayuda_id" item-text="nombre"
                  item-value="id" label="Area"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete small-chips dense :items="usersAll" item-text="nombre" item-value="user_id" multiple
                  deletable-chips chips v-model="datosCategoria.user_id" label="Usuario">
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" dark @click="dialogEditarCategoria = false">
            Cerrar
          </v-btn>
          <v-btn small color="success" dark @click="actualizarCategoria(datosCategoria)">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'FrontHorusCategoriasComponent',

    data() {
      return {
        loading: false,
        categorias: [],
        dialogCategoria: false,
        dialogEditarCategoria: false,
        form: {
          nombre: '',
        },
        search: '',
        headers: [{
            text: 'Id',
            align: 'start',
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Area asociada',
            value: 'areas_mesa_ayuda.nombre'
          },
          {
            text: 'Estado',
            value: 'estadoNombre'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        datosCategoria: {
          user_id: []
        },
        areas: [],
        usersAll: []
      };
    },

    created() {
      this.fetchCategorias()
    },

    methods: {
      /**
       * Consultar todas las cetegorias activas
       * @author Calvarez
       */
      fetchCategorias() {
        this.loading = true
        this.$axios.get('CategoriaMesaAyuda/listarTodas').then(res => {
          this.loading = false
          this.categorias = res.data
        }).catch(error => {
          this.toast.error('No se encontro prioridades')
        })
      },

      /**
       * Listar todas las arear th
       * @author Calvarez
       */
      fetchAreas() {
        this.loading = true
        this.$axios.post('/area-mesa-ayuda/listar', {
          estado: 1
        }).then(res => {
          this.areas = res.data
          this.loading = false
        }).catch(error => {
          this.toast.error('No se encontro areas')
        })
      },

      /**
       * Listar categorias con su respectiva area
       * @author Calvarez
       */
      guardarCategoria() {
        this.$axios.post('/CategoriaMesaAyuda/crear', this.form).then(res => {
          this.$toast.success(res.data.mensaje)
          this.dialogCategoria = false
          this.fetchCategorias()
        }).catch(error => {
          this.toast.error('Error al crear categoria')
        })
      },

      actualizarCategoria(datos) {
        const categoria = {
          id: datos.id,
          nombre: datos.nombre,
          areas_mesa_ayuda_id: this.datosCategoria.areas_mesa_ayuda_id,
          user_id: datos.user_id,
        }
        this.$axios.put('/CategoriaMesaAyuda/' + categoria.id, categoria).then(res => {
          this.dialogEditarCategoria = false
          this.$toast.success(res.data.mensaje)
          this.fetchCategorias()
        }).catch(error => {
          this.toast.error('Error al crear categoria')
        })
      },

      /**
       * Consultar elemento seleccionado
       * @author Calvarez
       */
       editarCategoria(datos) {
        this.fetchAreas()
        this.listarOperador()
        console.log('dff', datos);
        this.datosCategoria = datos
        this.datosCategoria.areas_mesa_ayuda_id = datos.areas_mesa_ayuda_id
        let prueba = datos.user.map((rep) => rep.operador.user_id)
        this.datosCategoria.user_id = prueba
        this.dialogEditarCategoria = true
      },

          listarOperador() {
        this.preload = true
        this.$axios.get('/operador/listar').then(res => {
          this.usersAll = res.data.map((op) => {
            return {
              user_id: op.user_id,
              nombre: `${op.nombre} - ${op.apellido}`,
            }
          })
          this.preload = false
        }).catch(error => {
          this.preload = false
        })
      },

      cambiarEstadoCategoria(item) {
        this.$swal({
          title: "Atención!",
          text: "¿Esta seguro de cambiar el estado?",
          type: "info",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.preload = true;
            this.$axios
              .post(`CategoriaMesaAyuda/cambiarEstado/${item.id}`, {
                estado_id: item.estado_id ? 1 : 2
              })
              .then(() => {
                this.$swal({
                  title: "Éxito",
                  text: "Se ha cambiado el estado con éxito",
                  type: "success",
                });
                this.fetchCategorias();
              })
              .catch((error) => {
                this.$toast.error('Error al cambiar el estado')
                console.error(error);
              })
              .finally(() => {
                this.preload = false;
              });
          }
        });
      },

    },
  };

</script>

<style lang="scss" scoped>

</style>
