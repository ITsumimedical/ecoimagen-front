<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscar" :items="areas" sort-by="id" class="elevation-1"
      :loading="loading" :disabled="loading" loading-text="Cargando..." disable-pagination hide-default-footer
      no-data-text="Sin datos para mostrar">
      <template v-slot:item.estadoNombre="{ item }">
        <v-chip small :color="item.estado_id == 1 ? 'green' : 'red'" dark>
          {{ item.estado_id == 1 ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="crearAreaNueva = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="abrirDialogoEditar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon :color="item.estado_id == 1 ? 'green' : 'red'" class="mr-2" v-bind="attrs" v-on="on"
              @click="cambiarEstadoArea(item)">
              {{ item.estado_id == 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
            </v-icon>
          </template>
          <span>{{ item.estado_id == 1? 'Desactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-row no-gutters style="background-color: white;">
      <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarAreas">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarAreas()">
        </v-select>
      </v-col>
    </v-row>

    <v-dialog v-model="crearAreaNueva" persistent max-width="900px">
      <v-card :loading="loading" :disabled="loading">
        <v-alert text color="info" dense icon="mdi-tooltip-plus">
          <b> Crear nueva Area </b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col col="12" md="6" sm="6">
              <v-text-field dense outlined label="Nombre" v-model="area.nombre"></v-text-field>
            </v-col>
            <v-col col="12" md="6" sm="6">
              <v-text-field dense outlined label="Descripción" v-model="area.descripcion"></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark small @click="limpiardialogo()">Cerrar</v-btn>
            <v-btn color="success" dark small @click="crearArea()">Crear</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEditar">
      <v-card>
        <v-alert text color="info" dense icon="mdi-tooltip-plus">
          <b>Editar Área</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col col="12" md="6" sm="6">
              <v-text-field dense outlined label="Nombre" v-model="editar.nombre"></v-text-field>
            </v-col>
            <v-col col="12" md="6" sm="6">
              <v-text-field dense outlined label="Descripción" v-model="editar.descripcion"></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark small @click="dialogEditar = false">Cerrar</v-btn>
            <v-btn color="warning" dark small @click="actualizarArea()">Actualizar</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        areas: [],
        buscar: '',
        crearAreaNueva: false,
        loading: false,
        pagina: 1,
        total: 0,
        opcionActual: 5,
        opciones: [5, 10, 20, 50, 100],
        dialogEditar: false,
        area: {
          nombre: '',
          descripcion: ''
        },
        editar: {
          nombre: '',
          descripcion: ''
        },
        headers: [{
            text: 'id',
            value: 'id',
            align: 'center'
          },
          {
            text: 'Nombre',
            value: 'nombre',
            align: 'center'
          },
          {
            text: 'Descripción',
            value: 'descripcion',
            align: 'center'
          },
          {
            text: 'Estado',
            value: 'estadoNombre',
            align: 'center'
          }, {
            text: 'Acciones',
            value: 'actions',
            align: 'center'
          }
        ]
      }
    },

    mounted() {
      this.listarAreas();
    },
    methods: {
      listarAreas() {
        this.loading = true
        this.$axios.get('areas/listarTodos?page=' + this.pagina + '&cantidad=' + this.opcionActual).then(
          res => {
            this.loading = false;
            this.areas = res.data.data;
            this.total = res.data.last_page;
          }
        ).catch(res => {
          this.loading = false;
          console.log(res);
        })
      },

      limpiardialogo() {
        this.crearAreaNueva = false,
          this.area = {
            nombre: '',
            descripcion: ''
          }
      },

      abrirDialogoEditar(item) {
        this.editar.nombre = item.nombre;
        this.editar.descripcion = item.descripcion;
        this.dialogEditar = true;
        this.area_id = item.id;
      },

      crearArea() {
        this.loading = true;
        const data = this.area = {
          nombre: this.area.nombre,
          descripcion: this.area.descripcion,
          estado_id: 1
        }
        this.$axios.post('areas/crear', data).then(res => {
          this.loading = false;
          this.limpiardialogo();
          this.listarAreas();
          this.$toast.success('Se ha creado el área con éxito')
        }).catch(res => {
          this.loading = false
          this.$toast.error('Error al crear el área').
          console.log(res)
        })
      },

      actualizarArea() {
        const data = {
          nombre: this.editar.nombre,
          descripcion: this.editar.descripcion,
          estado_id: 1
        };
        this.$axios.put(`areas/actualizar/${this.area_id}`, data)
          .then(res => {
            this.$toast.success('Área actualizada con éxito!');
            this.dialogEditar = false;
            this.listarAreas();
          })
          .catch(error => {
            this.$toast.error(error.response.data.mensaje);
          });
      },

      cambiarEstadoArea(item) {
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
              .post(`areas/cambiarEstado/${item.id}`, {
                estado_id: item.estado_id ? 1 : 2
              })
              .then(() => {
                this.$swal({
                  title: "Éxito",
                  text: "Se ha cambiado el estado con éxito",
                  type: "success",
                });
                this.listarAreas();
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

    }
  }

</script>
