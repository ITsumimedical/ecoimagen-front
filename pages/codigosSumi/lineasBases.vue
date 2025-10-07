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

    <v-data-table :headers="headers" :items="lineasBases" :search="buscar" dense :footer-props="{
      itemsPerPageText: 'Filas por página:'
    }">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="nuevo = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon=" mdi-pillar" hide-details single-line></v-text-field>
        </v-card-title>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="nuevo" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <v-alert dense text outlined color="info" icon=" mdi-pillar"><b>Crear Linea Base</b>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="linea.nombre">
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarNuevo" dark>
            Cerrar
          </v-btn>
          <v-btn color="success" small @click="crearLinea()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editarLinea" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <v-alert dense text outlined color="info" icon=" mdi-pillar"><b>Editar Linea Base</b>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="linea_editar.nombre">
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="editarLinea = false" dark>
            Cerrar
          </v-btn>
          <v-btn color="orange" small dark @click="actualizarLinea()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preload: false,
      lineasBases: [],
      buscar: '',
      nuevo: false,
      editarLinea: false,
      linea_editar: {
        nombre: ''
      },
      linea: {
        nombre: ''
      },
      headers: [
        {
          text: 'Id',
		  sortable: false,
          value: 'id'
        },
        {
          text: 'Nombre',
		  sortable: false,
          value: 'nombre'
        },
        {
          text: 'Acciones',
		  sortable: false,
          value: 'actions'
        }
      ]
    }
  },
  mounted() {
    this.listarLineasBase()
  },
  methods: {

    listarLineasBase() {
      this.preload = true;
      this.$axios.get('/lineas-bases/listar')
        .then(res => {
          this.lineasBases = res.data;
          this.preload = false;
        })
        .catch(error => {
          this.$toast.error(error.response.data.mensaje);
        });
    },
    cerrarNuevo() {
      this.nuevo = false,
        this.linea = {
          nombre: '',
        }
    },

    crearLinea() {
      if (this.linea.nombre.length <= 0) {
        return this.$swal({
          title: "¡No puede ser!",
          text: "El nombre de la linea base es obligatorio",
          type: "warning",
        });
      }
      this.$axios.post('/lineas-bases/crear', this.linea)
        .then(response => {
          this.preload = false;
          this.$toast.success('Linea Base creada exitosamente');
          this.nuevo = false;
          this.listarLineasBase();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },

    actualizarLinea() {
      this.preload = true;
      this.$axios.put(`/lineas-bases/actualizar/${this.linea_editar.id}`, { nombre: this.linea_editar.nombre })
        .then(() => {
          this.preload = false;
          this.linea_editar = { nombre: '' };
          this.$toast.success('Linea Base se ha actualizado correctamente.');
          this.editarLinea = false;
          this.listarLineasBase();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },
    editar(item) {
      this.linea_editar = { ...item };
      this.editarLinea = true;
    },
  }
}
</script>
